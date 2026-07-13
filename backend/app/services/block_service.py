"""Block business logic — metadata CRUD with node-level scoping."""

from __future__ import annotations

from typing import Any

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.block import Block
from app.models.node import Node
from app.models.user import User
from app.schemas.block import BlockCreate


class BlockService:
    """Stateless service for block metadata operations."""

    @staticmethod
    async def _verify_node_access(
        db: AsyncSession, node_id: str, user: User | None = None
    ) -> Node | None:
        """Verify that the user has access to the given node."""
        query = select(Node).where(Node.id == node_id)
        if user is not None:
            query = query.where(Node.user_id == user.id)
        result = await db.execute(query)
        return result.scalar_one_or_none()

    @staticmethod
    async def create(
        db: AsyncSession, data: BlockCreate, user: User | None = None
    ) -> Block:
        # Verify user has access to the node
        if user is not None:
            node = await BlockService._verify_node_access(db, data.node_id, user)
            if node is None:
                raise PermissionError("Node not found or access denied")

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
    async def get_by_id(
        db: AsyncSession, block_id: str, user: User | None = None
    ) -> Block | None:
        query = select(Block).where(Block.id == block_id)
        if user is not None:
            # Join with Node to filter by user_id
            query = (
                query.join(Node, Block.node_id == Node.id)
                .where(Node.user_id == user.id)
            )
        result = await db.execute(query)
        return result.scalar_one_or_none()

    @staticmethod
    async def list_by_node(
        db: AsyncSession,
        node_id: str,
        user: User | None = None,
        skip: int = 0,
        limit: int = 100,
        include_deleted: bool = False,
    ) -> tuple[list[Block], int]:
        # Verify user has access to the node
        if user is not None:
            node = await BlockService._verify_node_access(db, node_id, user)
            if node is None:
                return [], 0

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
        user: User | None = None,
        skip: int = 0,
        limit: int = 100,
        include_deleted: bool = False,
    ) -> tuple[list[Block], int]:
        query = select(Block)

        if user is not None:
            # Scope to blocks belonging to user's nodes
            query = (
                query.join(Node, Block.node_id == Node.id)
                .where(Node.user_id == user.id)
            )

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
    async def soft_delete(
        db: AsyncSession, block_id: str, user: User | None = None
    ) -> bool:
        block = await BlockService.get_by_id(db, block_id, user=user)
        if block is None:
            return False
        block.is_deleted = True
        await db.flush()
        return True