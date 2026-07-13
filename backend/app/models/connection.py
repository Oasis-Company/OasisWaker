"""PlatformConnection ORM model — OAuth-linked platform credentials for a node."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class PlatformConnection(Base):
    __tablename__ = "platform_connections"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    node_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("nodes.id", ondelete="CASCADE"), nullable=False, index=True
    )
    platform: Mapped[str] = mapped_column(String(64), nullable=False)
    access_token_encrypted: Mapped[str | None] = mapped_column(
        "access_token", Text, nullable=True
    )
    account_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    worker_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(32), default="active")
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
    node: Mapped["Node"] = relationship(
        "Node", back_populates="connections"
    )

    def __repr__(self) -> str:
        return (
            f"<PlatformConnection id={self.id!r} "
            f"platform={self.platform!r} node_id={self.node_id!r}>"
        )