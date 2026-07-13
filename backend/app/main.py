"""FastAPI application factory — OasisWaker v2.0 Backend."""

from __future__ import annotations

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import close_db, create_all_tables, init_db
from app.routes import (
    blocks_router,
    health_router,
    nodes_router,
    ws_router,
)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Application lifespan: initialise DB on start, close on shutdown."""
    init_db()
    await create_all_tables()
    yield
    await close_db()


def create_app() -> FastAPI:
    """Build and return the configured FastAPI application."""
    app = FastAPI(
        title="OasisWaker v2.0",
        description="Central coordination server for the OasisWaker "
        "decentralized edge storage network.",
        version="2.0.0",
        lifespan=lifespan,
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # ── CORS ────────────────────────────────────────────────────────────
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── Routers ─────────────────────────────────────────────────────────
    app.include_router(nodes_router)
    app.include_router(blocks_router)
    app.include_router(health_router)
    app.include_router(ws_router)

    return app


app = create_app()


def main() -> None:
    """Entry point for ``oasiswaker-backend`` CLI command."""
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
    )


if __name__ == "__main__":
    main()