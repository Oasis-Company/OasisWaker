"""Node routes — CRUD operations for edge nodes."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_current_user
from app.database import get_session
from app.models.user import User
from app.schemas.node import (
    NodeCreate,
    NodeRead,
    NodeUpdate,
    NodeHeartbeat,
    NodeListResponse,
)
from app.services.node_service import NodeService

router = APIRouter(prefix="/api/v1/nodes", tags=["nodes"])


@router.get("", response_model=NodeListResponse)
async def list_nodes(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_session)],
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status: str | None = Query(None),
    is_active: bool | None = Query(None),
) -> NodeListResponse:
    nodes, total = await NodeService.list_all(
        db, user=current_user, skip=skip, limit=limit,
        status_filter=status, is_active=is_active,
    )
    return NodeListResponse(
        items=[NodeRead.model_validate(n) for n in nodes],
        total=total,
        skip=skip,
        limit=limit,
    )


@router.post("", response_model=NodeRead, status_code=status.HTTP_201_CREATED)
async def create_node(
    data: NodeCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_session)],
) -> NodeRead:
    node = await NodeService.create(db, data, user=current_user)
    return NodeRead.model_validate(node)


@router.get("/{node_id}", response_model=NodeRead)
async def get_node(
    node_id: str,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_session)],
) -> NodeRead:
    node = await NodeService.get_by_id(db, node_id, user=current_user)
    if node is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Node '{node_id}' not found",
        )
    return NodeRead.model_validate(node)


@router.patch("/{node_id}", response_model=NodeRead)
async def update_node(
    node_id: str,
    data: NodeUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_session)],
) -> NodeRead:
    node = await NodeService.update(db, node_id, data, user=current_user)
    if node is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Node '{node_id}' not found",
        )
    return NodeRead.model_validate(node)


@router.delete("/{node_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_node(
    node_id: str,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_session)],
) -> None:
    deleted = await NodeService.delete(db, node_id, user=current_user)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Node '{node_id}' not found",
        )


@router.post("/{node_id}/heartbeat", response_model=NodeRead)
async def heartbeat(
    node_id: str,
    data: NodeHeartbeat,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_session)],
) -> NodeRead:
    node = await NodeService.process_heartbeat(
        db, node_id, data, user=current_user
    )
    if node is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Node '{node_id}' not found",
        )
    return NodeRead.model_validate(node)