"""Application configuration via environment variables."""

from __future__ import annotations

from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # ── Server ──────────────────────────────────────────────────────────
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = True

    # ── Database ────────────────────────────────────────────────────────
    database_url: str = "sqlite+aiosqlite:///./oasiswaker.db"

    # ── CORS ────────────────────────────────────────────────────────────
    cors_origins: list[str] = ["http://localhost:3000"]

    # ── Security ────────────────────────────────────────────────────────
    secret_key: str = "change-me-in-production"

    # ── Data paths ──────────────────────────────────────────────────────
    data_dir: Path = Path.home() / ".oasiswaker"

    # ── JWT ─────────────────────────────────────────────────────────────
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    refresh_token_expire_days: int = 7

    # ── GitHub OAuth ────────────────────────────────────────────────────
    github_client_id: str | None = None
    github_client_secret: str | None = None

    # ── API Key ─────────────────────────────────────────────────────────
    api_key_expire_days: int = 365

    # ── Rate Limiting ───────────────────────────────────────────────────
    rate_limit_enabled: bool = True
    rate_limit_requests_per_minute: int = 60

    # ── Quota ───────────────────────────────────────────────────────────
    default_storage_quota_bytes: int = 10 * 1024 * 1024 * 1024  # 10 GB

    # ── Request Size ────────────────────────────────────────────────────
    max_request_size_mb: int = 10


settings = Settings()