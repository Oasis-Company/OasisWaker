"""Block metadata routes — /api/v1/blocks."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.schemas.block import BlockCreate, BlockListResponse, BlockRead
from app.services.block_service import BlockService

router = APIRouter(prefix="/api/v1/blocks", tags=["blocks"])


@router.get("", response_model=BlockListResponse)
async def list_blocks(
    db: Annotated[AsyncSession, Depends(get_session)],
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    node_id: str | None = Query(None),
) -> BlockListResponse:
    """List block metadata, optionally filtered by node."""
    if node_id is not None:
        items, total = await BlockService.list_by_node(
            db, node_id, skip=skip, limit=limit
        )
    else:
        items, total = await BlockService.list_all(
            db, skip=skip, limit=limit
        )
    return BlockListResponse(
        items=[BlockRead.model_validate(b) for b in items],
        total=total,
    )


@router.post("", response_model=BlockRead, status_code=status.HTTP_201_CREATED)
async def create_block(
    data: BlockCreate,
    db: Annotated[AsyncSession, Depends(get_session)],
) -> BlockRead:
    """Register block metadata after a successful edge store operation."""
    block = await BlockService.create(db, data)
    return BlockRead.model_validate(block)


@router.get("/{block_id}", response_model=BlockRead)
async def get_block(
    block_id: str,
    db: Annotated[AsyncSession, Depends(get_session)],
) -> BlockRead:
    """Get block metadata by UUID."""
    block = await BlockService.get_by_id(db, block_id)
    if block is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Block '{block_id}' not found",
        )
    return BlockRead.model_validate(block)


@router.delete("/{block_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_block(
    block_id: str,
    db: Annotated[AsyncSession, Depends(get_session)],
) -> None:
    """Soft-delete a block's metadata."""
    deleted = await BlockService.soft_delete(db, block_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Block '{block_id}' not found",
        )