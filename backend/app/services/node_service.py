"""Node business logic — CRUD, heartbeat, and status management."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from sqlalchemy import select, func, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.node import Node
from app.schemas.node import NodeCreate, NodeUpdate, NodeHeartbeat


class NodeService:
    """Stateless service for node operations."""

    @staticmethod
    async def create(db: AsyncSession, data: NodeCreate) -> Node:
        node = Node(
            name=data.name,
            node_id=data.node_id,
            platform=data.platform,
            endpoint=data.endpoint,
            version=data.version,
            total_storage=data.total_storage,
            metadata_json=(
                str(data.metadata_json) if data.metadata_json else None
            ),
        )
        db.add(node)
        await db.flush()
        await db.refresh(node)
        return node

    @staticmethod
    async def get_by_id(db: AsyncSession, node_id: str) -> Node | None:
        result = await db.execute(select(Node).where(Node.id == node_id))
        return result.scalar_one_or_none()

    @staticmethod
    async def get_by_node_id(db: AsyncSession, node_id: str) -> Node | None:
        result = await db.execute(
            select(Node).where(Node.node_id == node_id)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def list_all(
        db: AsyncSession,
        skip: int = 0,
        limit: int = 100,
        status_filter: str | None = None,
        is_active: bool | None = None,
    ) -> tuple[list[Node], int]:
        query = select(Node)

        if status_filter is not None:
            query = query.where(Node.status == status_filter)
        if is_active is not None:
            query = query.where(Node.is_active == is_active)

        # Total count
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await db.execute(count_query)
        total = total_result.scalar_one()

        # Paginated results
        result = await db.execute(
            query.order_by(Node.created_at.desc()).offset(skip).limit(limit)
        )
        return list(result.scalars().all()), total

    @staticmethod
    async def update(
        db: AsyncSession, node_id: str, data: NodeUpdate
    ) -> Node | None:
        node = await NodeService.get_by_id(db, node_id)
        if node is None:
            return None

        update_data = data.model_dump(exclude_unset=True)
        if "metadata_json" in update_data:
            update_data["metadata_json"] = (
                str(update_data["metadata_json"])
                if update_data["metadata_json"]
                else None
            )

        for field, value in update_data.items():
            setattr(node, field, value)

        await db.flush()
        await db.refresh(node)
        return node

    @staticmethod
    async def delete(db: AsyncSession, node_id: str) -> bool:
        node = await NodeService.get_by_id(db, node_id)
        if node is None:
            return False
        await db.delete(node)
        await db.flush()
        return True

    @staticmethod
    async def process_heartbeat(
        db: AsyncSession, node_id: str, data: NodeHeartbeat
    ) -> Node | None:
        node = await NodeService.get_by_id(db, node_id)
        if node is None:
            return None

        node.status = data.status
        node.last_heartbeat = datetime.now(timezone.utc)
        if data.used_storage is not None:
            node.used_storage = data.used_storage
        if data.version is not None:
            node.version = data.version

        await db.flush()
        await db.refresh(node)
        return node

    @staticmethod
    async def get_stats(db: AsyncSession) -> dict[str, Any]:
        """Return global statistics across all nodes."""
        total_result = await db.execute(select(func.count()).select_from(Node))
        total_nodes = total_result.scalar_one()

        active_result = await db.execute(
            select(func.count()).select_from(Node).where(Node.is_active == True)  # noqa: E712
        )
        active_nodes = active_result.scalar_one()

        storage_result = await db.execute(
            select(
                func.coalesce(func.sum(Node.total_storage), 0),
                func.coalesce(func.sum(Node.used_storage), 0),
            )
        )
        total_storage, used_storage = storage_result.one()

        return {
            "total_nodes": total_nodes,
            "active_nodes": active_nodes,
            "total_storage_bytes": total_storage,
            "used_storage_bytes": used_storage,
        }