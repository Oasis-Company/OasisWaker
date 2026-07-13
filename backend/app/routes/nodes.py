"""Node CRUD routes — /api/v1/nodes."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.schemas.node import (
    NodeCreate,
    NodeHeartbeat,
    NodeListResponse,
    NodeRead,
    NodeUpdate,
)
from app.services.node_service import NodeService

router = APIRouter(prefix="/api/v1/nodes", tags=["nodes"])


@router.get("", response_model=NodeListResponse)
async def list_nodes(
    db: Annotated[AsyncSession, Depends(get_session)],
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status: str | None = Query(None),
    is_active: bool | None = Query(None),
) -> NodeListResponse:
    """List all registered nodes with optional filters."""
    items, total = await NodeService.list_all(
        db, skip=skip, limit=limit, status_filter=status, is_active=is_active
    )
    return NodeListResponse(
        items=[NodeRead.model_validate(n) for n in items],
        total=total,
    )


@router.post("", response_model=NodeRead, status_code=status.HTTP_201_CREATED)
async def create_node(
    data: NodeCreate,
    db: Annotated[AsyncSession, Depends(get_session)],
) -> NodeRead:
    """Register a new node in the network."""
    existing = await NodeService.get_by_node_id(db, data.node_id)
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Node with node_id '{data.node_id}' already exists",
        )
    node = await NodeService.create(db, data)
    return NodeRead.model_validate(node)


@router.get("/{node_id}", response_model=NodeRead)
async def get_node(
    node_id: str,
    db: Annotated[AsyncSession, Depends(get_session)],
) -> NodeRead:
    """Get a single node by its UUID."""
    node = await NodeService.get_by_id(db, node_id)
    if node is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Node '{node_id}' not found",
        )
    return NodeRead.model_validate(node)


@router.put("/{node_id}", response_model=NodeRead)
async def update_node(
    node_id: str,
    data: NodeUpdate,
    db: Annotated[AsyncSession, Depends(get_session)],
) -> NodeRead:
    """Update an existing node's fields."""
    node = await NodeService.update(db, node_id, data)
    if node is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Node '{node_id}' not found",
        )
    return NodeRead.model_validate(node)


@router.delete("/{node_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_node(
    node_id: str,
    db: Annotated[AsyncSession, Depends(get_session)],
) -> None:
    """Permanently remove a node and all its associated data."""
    deleted = await NodeService.delete(db, node_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Node '{node_id}' not found",
        )


@router.post("/{node_id}/heartbeat", response_model=NodeRead)
async def node_heartbeat(
    node_id: str,
    data: NodeHeartbeat,
    db: Annotated[AsyncSession, Depends(get_session)],
) -> NodeRead:
    """Report node health and status.

    Called periodically by the edge node to signal it is alive
    and report current resource usage.
    """
    node = await NodeService.process_heartbeat(db, node_id, data)
    if node is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Node '{node_id}' not found",
        )
    return NodeRead.model_validate(node)