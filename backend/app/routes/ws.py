"""WebSocket route — real-time event broadcasting.

Clients connect to ``/ws/v1/events`` and receive JSON-encoded events
whenever nodes are created, updated, or deleted, or when blocks are
stored or removed.
"""

from __future__ import annotations

import json
from typing import Any

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter(prefix="/ws/v1", tags=["websocket"])


class ConnectionManager:
    """Manages active WebSocket connections for real-time events."""

    def __init__(self) -> None:
        self._connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        self._connections.append(websocket)

    def disconnect(self, websocket: WebSocket) -> None:
        if websocket in self._connections:
            self._connections.remove(websocket)

    async def broadcast(self, event_type: str, payload: dict[str, Any]) -> None:
        """Send a JSON event to every connected client."""
        message = json.dumps({"type": event_type, "data": payload})
        stale: list[WebSocket] = []
        for ws in self._connections:
            try:
                await ws.send_text(message)
            except Exception:
                stale.append(ws)
        for ws in stale:
            self._connections.remove(ws)


manager = ConnectionManager()


@router.websocket("/events")
async def websocket_events(websocket: WebSocket) -> None:
    """WebSocket endpoint for real-time events.

    The server pushes events; clients do not need to send messages.
    """
    await manager.connect(websocket)
    try:
        # Keep the connection open.  The server pushes events
        # independently via the ``manager.broadcast()`` method.
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)