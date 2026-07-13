"""Health check and global statistics routes."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.services.node_service import NodeService

router = APIRouter(prefix="/api/v1", tags=["health"])


@router.get("/health")
async def health_check() -> dict[str, str]:
    """Simple health check — returns server status."""
    return {"status": "ok", "service": "oasiswaker-backend", "version": "2.0.0"}


@router.get("/stats")
async def get_stats(
    db: Annotated[AsyncSession, Depends(get_session)],
) -> dict:
    """Return aggregate network statistics."""
    return await NodeService.get_stats(db)