"""Pydantic schemas for Node CRUD operations."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


# ── Create ─────────────────────────────────────────────────────────────────


class NodeCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    node_id: str = Field(..., min_length=1, max_length=64)
    platform: str | None = None
    endpoint: str | None = None
    version: str | None = None
    total_storage: int = 0
    metadata_json: dict[str, Any] | None = None
    project_id: str | None = None


# ── Read ───────────────────────────────────────────────────────────────────


class NodeRead(BaseModel):
    model_config = {"from_attributes": True}

    id: str
    name: str
    node_id: str
    status: str
    platform: str | None
    endpoint: str | None
    version: str | None
    last_heartbeat: datetime | None
    total_storage: int
    used_storage: int
    is_active: bool
    metadata_json: dict[str, Any] | None
    created_at: datetime
    updated_at: datetime


# ── Update ─────────────────────────────────────────────────────────────────


class NodeUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=255)
    status: str | None = None
    endpoint: str | None = None
    version: str | None = None
    total_storage: int | None = None
    used_storage: int | None = None
    is_active: bool | None = None
    metadata_json: dict[str, Any] | None = None


# ── Heartbeat ──────────────────────────────────────────────────────────────


class NodeHeartbeat(BaseModel):
    status: str = "online"
    used_storage: int | None = None
    version: str | None = None


# ── List response ──────────────────────────────────────────────────────────


class NodeListResponse(BaseModel):
    items: list[NodeRead]
    total: int