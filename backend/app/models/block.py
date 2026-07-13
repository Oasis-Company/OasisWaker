"""Block ORM model — metadata for a data block stored on an edge node."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Block(Base):
    __tablename__ = "blocks"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    node_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("nodes.id", ondelete="CASCADE"), nullable=False, index=True
    )
    key: Mapped[str] = mapped_column(String(512), nullable=False, index=True)
    size: Mapped[int] = mapped_column(Integer, default=0)
    platform: Mapped[str] = mapped_column(String(64), nullable=False)
    content_type: Mapped[str | None] = mapped_column(String(128), nullable=True)
    metadata_json: Mapped[str | None] = mapped_column(
        "metadata", Text, nullable=True
    )
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False)
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
        "Node", back_populates="blocks"
    )

    def __repr__(self) -> str:
        return (
            f"<Block id={self.id!r} key={self.key!r} "
            f"node_id={self.node_id!r} size={self.size}>"
        )