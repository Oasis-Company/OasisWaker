"""Sliding window rate limiter using the ``limits`` library.

v1.0 uses in-memory storage (suitable for single-instance deployments).
v2.0 should migrate to Redis-backed storage for horizontal scaling.
"""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends, HTTPException, Request, status
from limits import RateLimitItemPerMinute
from limits.storage import MemoryStorage
from limits.strategies import MovingWindowRateLimiter

from app.config import settings

# ── Global rate limiter (singleton) ───────────────────────────────────────
_storage = MemoryStorage()
_strategy: MovingWindowRateLimiter = MovingWindowRateLimiter(_storage)
_auth_daily_limit = RateLimitItemPerMinute(
    settings.rate_limit_requests_per_minute
)
_unauth_daily_limit = RateLimitItemPerMinute(20)  # 20 req/min for unauthenticated


async def check_rate_limit(
    request: Request,
) -> None:
    """FastAPI middleware/guard — enforce rate limits per-user or per-IP.

    Must be called after ``get_current_user`` so that the request can
    carry the authenticated user's identity.  If the user is authenticated,
    the limit is keyed by user ID.  Otherwise, it falls back to the client IP.

    Usage:
        .. code-block:: python
            @router.get("/endpoint")
            async def my_endpoint(
                _: Annotated[None, Depends(check_rate_limit)],
                current_user: Annotated[User, Depends(get_current_user)],
            ):
                ...
    """
    if not settings.rate_limit_enabled:
        return

    # Determine the rate limit key
    user_id = getattr(request.state, "user_id", None)
    if user_id:
        key = f"user:{user_id}"
        item = _auth_daily_limit
    else:
        client_ip = request.client.host if request.client else "unknown"
        key = f"ip:{client_ip}"
        item = _unauth_daily_limit

    if not _strategy.hit(item, key):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded. Please slow down and try again.",
        )


async def check_rate_limit_optional(
    request: Request,
) -> None:
    """Rate limit guard that silently allows if the limiter is disabled."""
    if not settings.rate_limit_enabled:
        return
    await check_rate_limit(request)