/* ──────────────────────────────────────────────────────────────────────────
   OasisWaker API Client — Swiss Style, typed, and authenticated
   ────────────────────────────────────────────────────────────────────────── */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("ow_access_token");
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  signal?: AbortSignal
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const headers: Record<string, string> = {
    ...authHeaders(),
  };

  const options: RequestInit = { method, headers, signal };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url, options);

  // 204 No Content
  if (res.status === 204) return undefined as T;

  // 401 → redirect to login
  if (res.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem("ow_access_token");
    localStorage.removeItem("ow_refresh_token");
    window.location.href = "/login";
    throw new Error("Session expired");
  }

  // 429 Rate limited
  if (res.status === 429) {
    const data = await res.json();
    throw new Error(data.detail || "Rate limit exceeded");
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

/** Wraps `request` with a 10-second timeout using AbortSignal.timeout() */
async function fetchWithTimeout<T>(
  method: string,
  path: string,
  body?: unknown,
  timeoutMs = 10_000
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await request<T>(method, path, body, controller.signal);
  } finally {
    clearTimeout(timeoutId);
  }
}

/* ── Types ───────────────────────────────────────────────────────────────── */

export interface NodeRead {
  id: string;
  name: string;
  node_id: string;
  status: string;
  platform: string | null;
  endpoint: string | null;
  version: string | null;
  last_heartbeat: string | null;
  total_storage: number;
  used_storage: number;
  is_active: boolean;
  metadata_json: string | null;
  created_at: string;
  updated_at: string;
}

export interface NodeListResponse {
  items: NodeRead[];
  total: number;
  skip: number;
  limit: number;
}

export interface NodeCreatePayload {
  name: string;
  node_id: string;
  platform?: string | null;
  endpoint?: string | null;
  version?: string | null;
  total_storage?: number;
  metadata_json?: Record<string, unknown> | null;
  project_id?: string | null;
}

export interface NodeHeartbeatPayload {
  status: string;
  used_storage?: number;
  version?: string;
}

export interface StatsResponse {
  total_nodes: number;
  active_nodes: number;
  total_storage_bytes: number;
  used_storage_bytes: number;
}

/* ── Auth Types ──────────────────────────────────────────────────────────── */

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface UserInfo {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  storage_quota_bytes: number;
  created_at: string;
}

export interface ApiKeyInfo {
  id: string;
  name: string;
  key_prefix: string;
  last_used_at: string | null;
  expires_at: string | null;
  created_at: string;
}

export interface ApiKeyCreated extends ApiKeyInfo {
  full_key: string;
}

/* ── Auth API ────────────────────────────────────────────────────────────── */

export const authApi = {
  signup: (email: string, password: string, fullName?: string) =>
    request<TokenPair>("POST", "/api/v1/auth/signup", {
      email,
      password,
      full_name: fullName,
    }),

  login: (email: string, password: string) =>
    request<TokenPair>("POST", "/api/v1/auth/login", { email, password }),

  refresh: (refreshToken: string) =>
    request<TokenPair>("POST", "/api/v1/auth/refresh", {
      refresh_token: refreshToken,
    }),

  me: () => request<UserInfo>("GET", "/api/v1/auth/me"),

  listApiKeys: (signal?: AbortSignal) =>
    request<ApiKeyInfo[]>("GET", "/api/v1/auth/api-keys", undefined, signal),

  createApiKey: (name: string) =>
    request<ApiKeyCreated>("POST", "/api/v1/auth/api-keys", { name }),

  deleteApiKey: (id: string) =>
    request<undefined>("DELETE", `/api/v1/auth/api-keys/${id}`),
};

/* ── Public API (no auth required) ───────────────────────────────────────── */

export const publicApi = {
  health: () => request<{ status: string }>("GET", "/health"),
};

/* ── Protected API (auth required) ───────────────────────────────────────── */

export const api = {
  stats: (signal?: AbortSignal) =>
    request<StatsResponse>("GET", "/api/v1/stats", undefined, signal),

  listNodes: (
    params?: {
      skip?: number;
      limit?: number;
      status?: string;
      is_active?: boolean;
    },
    signal?: AbortSignal
  ) => {
    const qs = new URLSearchParams();
    if (params?.skip) qs.set("skip", String(params.skip));
    if (params?.limit) qs.set("limit", String(params.limit));
    if (params?.status) qs.set("status", params.status);
    if (params?.is_active !== undefined)
      qs.set("is_active", String(params.is_active));
    const q = qs.toString();
    return request<NodeListResponse>(
      "GET",
      `/api/v1/nodes${q ? `?${q}` : ""}`,
      undefined,
      signal
    );
  },

  getNode: (id: string, signal?: AbortSignal) =>
    request<NodeRead>("GET", `/api/v1/nodes/${id}`, undefined, signal),

  createNode: (data: NodeCreatePayload) =>
    request<NodeRead>("POST", "/api/v1/nodes", data),

  deleteNode: (id: string) =>
    request<undefined>("DELETE", `/api/v1/nodes/${id}`),

  heartbeat: (id: string, data: NodeHeartbeatPayload) =>
    request<NodeRead>("POST", `/api/v1/nodes/${id}/heartbeat`, data),
};

export { fetchWithTimeout };