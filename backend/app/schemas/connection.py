"""Pydantic schemas for PlatformConnection operations."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class ConnectionCreate(BaseModel):
    platform: str = Field(..., min_length=1, max_length=64)
    access_token: str | None = None
    account_id: str | None = None
    worker_url: str | None = None


class ConnectionRead(BaseModel):
    model_config = {"from_attributes": True}

    id: str
    node_id: str
    platform: str
    access_token_encrypted: str | None
    account_id: str | None
    worker_url: str | None
    status: str
    created_at: datetime
    updated_at: datetime


class ConnectionListResponse(BaseModel):
    items: list[ConnectionRead]
    total: int