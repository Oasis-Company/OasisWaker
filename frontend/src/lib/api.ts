const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

interface RequestOptions {
  method?: string;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
}

async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, params } = opts;

  let url = `${API_BASE}${path}`;
  if (params) {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        search.set(key, String(value));
      }
    }
    const qs = search.toString();
    if (qs) url += `?${qs}`;
  }

  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return undefined as T;

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail ?? `HTTP ${res.status}`);
  }
  return data as T;
}

// ── Node API ───────────────────────────────────────────────────────────────

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
  created_at: string;
  updated_at: string;
}

export interface NodeListResponse {
  items: NodeRead[];
  total: number;
}

export interface NodeCreatePayload {
  name: string;
  node_id: string;
  platform?: string;
  endpoint?: string;
  version?: string;
  total_storage?: number;
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

export const api = {
  // Health
  health: () => request<{ status: string }>("/api/v1/health"),

  // Stats
  stats: () => request<StatsResponse>("/api/v1/stats"),

  // Nodes
  listNodes: (params?: {
    skip?: number;
    limit?: number;
    status?: string;
    is_active?: boolean;
  }) => request<NodeListResponse>("/api/v1/nodes", { params }),

  getNode: (id: string) => request<NodeRead>(`/api/v1/nodes/${id}`),

  createNode: (data: NodeCreatePayload) =>
    request<NodeRead>("/api/v1/nodes", {
      method: "POST",
      body: data,
    }),

  deleteNode: (id: string) =>
    request<void>(`/api/v1/nodes/${id}`, { method: "DELETE" }),

  heartbeat: (id: string, data: NodeHeartbeatPayload) =>
    request<NodeRead>(`/api/v1/nodes/${id}/heartbeat`, {
      method: "POST",
      body: data,
    }),
};