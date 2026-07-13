"""Block business logic — metadata CRUD with node-level scoping."""

from __future__ import annotations

from typing import Any

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.block import Block
from app.schemas.block import BlockCreate


class BlockService:
    """Stateless service for block metadata operations."""

    @staticmethod
    async def create(db: AsyncSession, data: BlockCreate) -> Block:
        block = Block(
            node_id=data.node_id,
            key=data.key,
            size=data.size,
            platform=data.platform,
            content_type=data.content_type,
            metadata_json=(
                str(data.metadata_json) if data.metadata_json else None
            ),
        )
        db.add(block)
        await db.flush()
        await db.refresh(block)
        return block

    @staticmethod
    async def get_by_id(db: AsyncSession, block_id: str) -> Block | None:
        result = await db.execute(
            select(Block).where(Block.id == block_id)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def list_by_node(
        db: AsyncSession,
        node_id: str,
        skip: int = 0,
        limit: int = 100,
        include_deleted: bool = False,
    ) -> tuple[list[Block], int]:
        query = select(Block).where(Block.node_id == node_id)

        if not include_deleted:
            query = query.where(Block.is_deleted == False)  # noqa: E712

        count_query = select(func.count()).select_from(query.subquery())
        total_result = await db.execute(count_query)
        total = total_result.scalar_one()

        result = await db.execute(
            query.order_by(Block.created_at.desc()).offset(skip).limit(limit)
        )
        return list(result.scalars().all()), total

    @staticmethod
    async def list_all(
        db: AsyncSession,
        skip: int = 0,
        limit: int = 100,
        include_deleted: bool = False,
    ) -> tuple[list[Block], int]:
        query = select(Block)
        if not include_deleted:
            query = query.where(Block.is_deleted == False)  # noqa: E712

        count_query = select(func.count()).select_from(query.subquery())
        total_result = await db.execute(count_query)
        total = total_result.scalar_one()

        result = await db.execute(
            query.order_by(Block.created_at.desc()).offset(skip).limit(limit)
        )
        return list(result.scalars().all()), total

    @staticmethod
    async def soft_delete(db: AsyncSession, block_id: str) -> bool:
        block = await BlockService.get_by_id(db, block_id)
        if block is None:
            return False
        block.is_deleted = True
        await db.flush()
        return True