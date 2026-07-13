"""Pydantic schemas for Block metadata operations."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class BlockCreate(BaseModel):
    node_id: str = Field(..., min_length=1)
    key: str = Field(..., min_length=1, max_length=512)
    size: int = 0
    platform: str = Field(..., min_length=1)
    content_type: str | None = None
    metadata_json: dict[str, Any] | None = None


class BlockRead(BaseModel):
    model_config = {"from_attributes": True}

    id: str
    node_id: str
    key: str
    size: int
    platform: str
    content_type: str | None
    metadata_json: dict[str, Any] | None
    is_deleted: bool
    created_at: datetime
    updated_at: datetime


class BlockListResponse(BaseModel):
    items: list[BlockRead]
    total: int