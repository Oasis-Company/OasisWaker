"""Storage quota enforcement — checks quota before storing new blocks."""

from __future__ import annotations

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.block import Block
from app.models.node import Node
from app.models.user import User


async def check_storage_quota(
    db: AsyncSession, user: User, new_block_size: int
) -> tuple[bool, int, int]:
    """Check whether adding a new block would exceed the user's storage quota.

    Args:
        db: The database session.
        user: The authenticated user.
        new_block_size: The size (in bytes) of the new block to store.

    Returns:
        A tuple of ``(within_quota, used_bytes, quota_bytes)``.
        - ``within_quota``: ``True`` if the block fits within the quota.
        - ``used_bytes``: The total storage currently used by the user.
        - ``quota_bytes``: The user's storage quota limit.
    """
    # Calculate current total storage used across all user's nodes
    result = await db.execute(
        select(func.coalesce(func.sum(Block.size), 0))
        .select_from(Block)
        .join(Node, Block.node_id == Node.id)
        .where(Node.user_id == user.id, Block.is_deleted == False)  # noqa: E712
    )
    used_bytes: int = result.scalar_one()

    total_after = used_bytes + new_block_size
    within_quota = total_after <= user.storage_quota_bytes

    return within_quota, used_bytes, user.storage_quota_bytes


async def calculate_used_storage(
    db: AsyncSession, user: User
) -> int:
    """Calculate the total storage used by all blocks belonging to the user.

    Args:
        db: The database session.
        user: The authenticated user.

    Returns:
        Total used bytes (only non-deleted blocks).
    """
    result = await db.execute(
        select(func.coalesce(func.sum(Block.size), 0))
        .select_from(Block)
        .join(Node, Block.node_id == Node.id)
        .where(Node.user_id == user.id, Block.is_deleted == False)  # noqa: E712
    )
    return result.scalar_one()