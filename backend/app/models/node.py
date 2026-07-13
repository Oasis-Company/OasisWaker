"""Node ORM model — represents a registered edge node in the network."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Node(Base):
    __tablename__ = "nodes"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    node_id: Mapped[str] = mapped_column(
        String(64), unique=True, nullable=False, index=True
    )
    status: Mapped[str] = mapped_column(
        String(32), default="offline", index=True
    )
    platform: Mapped[str | None] = mapped_column(String(64), nullable=True)
    endpoint: Mapped[str | None] = mapped_column(Text, nullable=True)
    version: Mapped[str | None] = mapped_column(String(32), nullable=True)
    last_heartbeat: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    total_storage: Mapped[int] = mapped_column(Integer, default=0)
    used_storage: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    metadata_json: Mapped[str | None] = mapped_column(
        "metadata", Text, nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # ── Relationships ────────────────────────────────────────────────────
    blocks: Mapped[list["Block"]] = relationship(
        "Block", back_populates="node", cascade="all, delete-orphan"
    )
    connections: Mapped[list["PlatformConnection"]] = relationship(
        "PlatformConnection",
        back_populates="node",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<Node id={self.id!r} node_id={self.node_id!r} status={self.status!r}>"