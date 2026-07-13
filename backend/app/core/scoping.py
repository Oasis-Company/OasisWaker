"""Query scoping utilities — enforce data isolation at the service layer."""

from __future__ import annotations

from sqlalchemy import select, Select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.node import Node
from app.models.user import User


def scope_query_by_user(query: Select, user: User) -> Select:
    """Add a WHERE clause to restrict results to the given user's records.

    Works for any model that has a ``user_id`` column
    (e.g. ``Node``, ``Project``, ``APIKey``).

    Args:
        query: A SQLAlchemy ``Select`` statement.
        user: The authenticated user.

    Returns:
        The same ``Select`` with ``.where(<model>.user_id == user.id)`` added.
    """
    # Determine the entity being queried to get the correct column.
    # This works for simple single-entity queries.
    for col in query.inner_columns:
        table = getattr(col, "table", None)
        if table is not None and hasattr(table, "columns"):
            user_id_col = table.columns.get("user_id")
            if user_id_col is not None:
                return query.where(user_id_col == user.id)

    # Fallback: assume the first FROM clause entity has user_id
    from_entities = getattr(query, "froms", [])
    for from_ in from_entities:
        user_id_col = getattr(from_.c, "user_id", None)
        if user_id_col is not None:
            return query.where(user_id_col == user.id)

    return query


async def verify_user_owns_node(
    db: AsyncSession, user: User, node_id: str
) -> Node | None:
    """Check whether a node belongs to the given user.

    Returns:
        The ``Node`` if it exists and belongs to the user, ``None`` otherwise.
    """
    result = await db.execute(
        select(Node).where(
            Node.id == node_id,
            Node.user_id == user.id,
        )
    )
    return result.scalar_one_or_none()