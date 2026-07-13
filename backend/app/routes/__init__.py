"""Route registrations for the FastAPI application."""

from app.routes.nodes import router as nodes_router
from app.routes.blocks import router as blocks_router
from app.routes.health import router as health_router
from app.routes.ws import router as ws_router
from app.routes.auth import router as auth_router

__all__ = ["nodes_router", "blocks_router", "health_router", "ws_router", "auth_router"]