"""Block routes — CRUD operations for block metadata."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_current_user
from app.database import get_session
from app.models.user import User
from app.schemas.block import BlockCreate, BlockRead, BlockListResponse
from app.services.block_service import BlockService

router = APIRouter(prefix="/api/v1/blocks", tags=["blocks"])


@router.get("", response_model=BlockListResponse)
async def list_blocks(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_session)],
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
) -> BlockListResponse:
    blocks, total = await BlockService.list_all(
        db, user=current_user, skip=skip, limit=limit
    )
    return BlockListResponse(
        items=[BlockRead.model_validate(b) for b in blocks],
        total=total,
        skip=skip,
        limit=limit,
    )


@router.post("", response_model=BlockRead, status_code=status.HTTP_201_CREATED)
async def create_block(
    data: BlockCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_session)],
) -> BlockRead:
    try:
        block = await BlockService.create(db, data, user=current_user)
    except PermissionError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )
    return BlockRead.model_validate(block)


@router.get("/{block_id}", response_model=BlockRead)
async def get_block(
    block_id: str,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_session)],
) -> BlockRead:
    block = await BlockService.get_by_id(db, block_id, user=current_user)
    if block is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Block '{block_id}' not found",
        )
    return BlockRead.model_validate(block)


@router.delete("/{block_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_block(
    block_id: str,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_session)],
) -> None:
    deleted = await BlockService.soft_delete(db, block_id, user=current_user)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Block '{block_id}' not found",
        )