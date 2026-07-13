"""Health check routes — /public for uptime, /stats for user-scoped metrics."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_current_user
from app.database import get_session
from app.models.user import User
from app.services.node_service import NodeService

router = APIRouter(tags=["health"])


@router.get("/health")
async def health_check() -> dict:
    """Public endpoint — returns server status (no auth required)."""
    return {"status": "ok", "service": "oasiswaker-v2"}


@router.get("/api/v1/stats")
async def get_stats(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_session)],
) -> dict:
    """User-scoped statistics — only returns data for the current user."""
    stats = await NodeService.get_stats(db, user=current_user)
    return stats