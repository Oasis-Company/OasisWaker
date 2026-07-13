"""Pydantic schemas for authentication and API key management."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


# ── Signup / Login ──────────────────────────────────────────────────────────


class SignupRequest(BaseModel):
    email: str = Field(..., max_length=255)
    password: str = Field(..., min_length=8, max_length=128)
    full_name: str | None = Field(None, max_length=255)


class LoginRequest(BaseModel):
    email: str = Field(..., max_length=255)
    password: str = Field(..., max_length=128)


# ── Token ───────────────────────────────────────────────────────────────────


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds


class RefreshRequest(BaseModel):
    refresh_token: str = Field(..., min_length=1)


# ── GitHub OAuth ────────────────────────────────────────────────────────────


class GithubAuthRequest(BaseModel):
    code: str = Field(..., min_length=1)


# ── User ────────────────────────────────────────────────────────────────────


class UserRead(BaseModel):
    model_config = {"from_attributes": True}

    id: str
    email: str
    full_name: str | None
    avatar_url: str | None
    storage_quota_bytes: int
    created_at: datetime


# ── API Key ─────────────────────────────────────────────────────────────────


class ApiKeyCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)


class ApiKeyRead(BaseModel):
    model_config = {"from_attributes": True}

    id: str
    name: str
    key_prefix: str
    last_used_at: datetime | None
    expires_at: datetime | None
    created_at: datetime


class ApiKeyCreated(ApiKeyRead):
    """Returned when a new API Key is created — includes the full key once."""

    full_key: str