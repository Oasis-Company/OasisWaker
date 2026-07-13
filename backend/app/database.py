"""Database engine, session factory, and lifecycle management.

Uses SQLAlchemy 2.0 async patterns with aiosqlite for development.
The engine is lazily initialised — call ``init_db()`` once at startup.
"""

from __future__ import annotations

from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from sqlalchemy import event
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

from app.config import settings

# ── Engine (lazy) ──────────────────────────────────────────────────────────
_engine = None
_async_session_maker: async_sessionmaker[AsyncSession] | None = None


class Base(DeclarativeBase):
    """Declarative base for all ORM models."""
    pass


# ── Lifecycle ──────────────────────────────────────────────────────────────


def init_db() -> None:
    """Create the async engine and session factory.

    Must be called once during application startup **before** any
    database operation.
    """
    global _engine, _async_session_maker  # noqa: PLW0603

    if _engine is not None:
        return  # already initialised

    _engine = create_async_engine(
        settings.database_url,
        echo=settings.debug,
        future=True,
        pool_pre_ping=True,
    )

    # Enable WAL mode + foreign keys on every SQLite connection
    @event.listens_for(_engine.sync_engine, "connect")
    def _sqlite_pragmas(dbapi_connection, _connection_record) -> None:  # noqa: ANN001
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA journal_mode=WAL;")
        cursor.execute("PRAGMA foreign_keys=ON;")
        cursor.execute("PRAGMA busy_timeout=5000;")
        cursor.close()

    _async_session_maker = async_sessionmaker(
        _engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )


async def close_db() -> None:
    """Dispose of the engine.  Call during application shutdown."""
    global _engine, _async_session_maker  # noqa: PLW0603
    if _engine is not None:
        await _engine.dispose()
    _engine = None
    _async_session_maker = None


async def create_all_tables() -> None:
    """Create all tables defined by ORM models.

    Safe to call repeatedly — SQLAlchemy uses ``CREATE TABLE IF NOT EXISTS``.
    """
    if _engine is None:
        init_db()
    async with _engine.begin() as conn:
        from app.models import node, block, connection  # noqa: F401  — register models
        await conn.run_sync(Base.metadata.create_all)


# ── Session dependency ─────────────────────────────────────────────────────


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency that yields an async database session.

    Usage::

        @router.get("/items")
        async def list_items(db: AsyncSession = Depends(get_session)):
            ...
    """
    if _async_session_maker is None:
        raise RuntimeError(
            "Database not initialised. Call init_db() before using get_session()."
        )
    async with _async_session_maker() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise