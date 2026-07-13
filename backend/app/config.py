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
    access_token_expire_minutes: int = 60

    # ── Data paths ──────────────────────────────────────────────────────
    data_dir: Path = Path.home() / ".oasiswaker"


settings = Settings()