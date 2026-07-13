"""WebSocket routes — real-time event broadcasting for authenticated users."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.jwt import decode_token
from app.database import get_session
from app.models.user import User

router = APIRouter()


class ConnectionManager:
    """Manages WebSocket connections keyed by user ID."""

    def __init__(self) -> None:
        self._connections: dict[str, list[WebSocket]] = {}

    async def connect(self, user_id: str, ws: WebSocket) -> None:
        await ws.accept()
        if user_id not in self._connections:
            self._connections[user_id] = []
        self._connections[user_id].append(ws)

    def disconnect(self, user_id: str, ws: WebSocket) -> None:
        if user_id in self._connections:
            self._connections[user_id] = [
                w for w in self._connections[user_id] if w != ws
            ]
            if not self._connections[user_id]:
                del self._connections[user_id]

    async def broadcast(self, user_id: str, event: dict[str, Any]) -> None:
        """Send an event to all connections for a specific user."""
        if user_id not in self._connections:
            return
        dead: list[WebSocket] = []
        for ws in self._connections[user_id]:
            try:
                await ws.send_json(event)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.disconnect(user_id, ws)


manager = ConnectionManager()


@router.websocket("/ws")
async def websocket_endpoint(
    ws: WebSocket,
    token: str = Query(...),
    db: AsyncSession = Depends(get_session),
) -> None:
    """Connect to the real-time event stream.

    Requires a valid JWT access token as a ``?token=`` query parameter.
    """
    # Authenticate via token query param
    payload = decode_token(token)
    if payload is None or payload.get("type") != "access":
        await ws.close(code=4001, reason="Invalid or expired token")
        return

    user_id = payload["sub"]
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if user is None or not user.is_active:
        await ws.close(code=4001, reason="User not found or inactive")
        return

    await manager.connect(user_id, ws)

    try:
        while True:
            data = await ws.receive_json()
            # Echo back for now; future: handle client messages
            await ws.send_json({"type": "ack", "data": data})
    except WebSocketDisconnect:
        manager.disconnect(user_id, ws)
    except Exception:
        manager.disconnect(user_id, ws)