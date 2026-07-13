"""GitHub OAuth integration — exchange code for access token, fetch user info."""

from __future__ import annotations

from typing import Any

import httpx

from app.config import settings

GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token"
GITHUB_USER_URL = "https://api.github.com/user"


async def get_github_access_token(code: str) -> str | None:
    """Exchange an OAuth authorization code for a GitHub access token.

    Args:
        code: The authorization code from GitHub's OAuth callback.

    Returns:
        The access token string, or ``None`` if the exchange failed.
    """
    if not settings.github_client_id or not settings.github_client_secret:
        return None

    async with httpx.AsyncClient() as client:
        response = await client.post(
            GITHUB_TOKEN_URL,
            json={
                "client_id": settings.github_client_id,
                "client_secret": settings.github_client_secret,
                "code": code,
            },
            headers={"Accept": "application/json"},
        )
        data = response.json()
        return data.get("access_token")


async def get_github_user_info(access_token: str) -> dict[str, Any] | None:
    """Fetch the authenticated user's GitHub profile.

    Args:
        access_token: A valid GitHub OAuth access token.

    Returns:
        A dict with ``id``, ``login``, ``avatar_url``, ``name``, and ``email``
        keys, or ``None`` if the request failed.
    """
    async with httpx.AsyncClient() as client:
        response = await client.get(
            GITHUB_USER_URL,
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/json",
            },
        )
        if response.status_code != 200:
            return None

        data = response.json()
        return {
            "github_id": str(data.get("id")),
            "login": data.get("login"),
            "avatar_url": data.get("avatar_url"),
            "name": data.get("name"),
            "email": data.get("email"),
        }