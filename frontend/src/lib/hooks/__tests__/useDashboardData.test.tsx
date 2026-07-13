import { renderHook, waitFor } from "@testing-library/react";
import { useDashboardData } from "@/lib/hooks/useDashboardData";
import { api } from "@/lib/api";
import type { Mock } from "vitest";

// Mock API
vi.mock("@/lib/api", () => ({
  api: {
    stats: vi.fn(),
    listNodes: vi.fn(),
  },
}));

// Mock WebSocket
vi.mock("@/lib/ws", () => {
  const mockWsClient = {
    connect: vi.fn(),
    disconnect: vi.fn(),
    onEvent: vi.fn(() => vi.fn()),
    onStatusChange: vi.fn(() => vi.fn()),
    getConnectionStatus: vi.fn(() => "disconnected" as const),
  };
  return { wsClient: mockWsClient };
});

const mockStats = {
  total_nodes: 10,
  active_nodes: 7,
  total_storage_bytes: 1_000_000_000,
  used_storage_bytes: 450_000_000,
};

const mockNodes = {
  items: [
    { id: "1", name: "Node 1", status: "online", platform: "linux", used_storage: 100, total_storage: 500, last_heartbeat: "2026-07-13T00:00:00Z" },
  ],
  total: 1,
  skip: 0,
  limit: 10,
};

describe("useDashboardData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows isLoading=true on initial load", () => {
    (api.stats as Mock).mockReturnValue(new Promise(() => {}));
    (api.listNodes as Mock).mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useDashboardData());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.stats).toBeNull();
    expect(result.current.nodes).toEqual([]);
  });

  it("returns stats and nodes after successful load", async () => {
    (api.stats as Mock).mockResolvedValue(mockStats);
    (api.listNodes as Mock).mockResolvedValue(mockNodes);

    const { result } = renderHook(() => useDashboardData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 10_000 });

    expect(result.current.stats).toEqual(mockStats);
    expect(result.current.nodes).toEqual(mockNodes.items);
    expect(result.current.error).toBeNull();
    expect(result.current.lastUpdated).toBeInstanceOf(Date);
  });

  it("sets error after API failures", { timeout: 15_000 }, async () => {
    (api.stats as Mock).mockRejectedValue(new Error("Network error"));
    (api.listNodes as Mock).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useDashboardData());

    // Wait for retries to exhaust (1s + 2s + 4s = 7s of real timeouts)
    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false);
      },
      { timeout: 12_000 }
    );

    expect(result.current.error).toBeTruthy();
  });

  it("provides refresh function to manually reload", async () => {
    (api.stats as Mock).mockResolvedValue(mockStats);
    (api.listNodes as Mock).mockResolvedValue(mockNodes);

    const { result } = renderHook(() => useDashboardData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 10_000 });

    // Reset mocks to count fresh calls
    (api.stats as Mock).mockClear();
    (api.listNodes as Mock).mockClear();
    (api.stats as Mock).mockResolvedValue(mockStats);
    (api.listNodes as Mock).mockResolvedValue(mockNodes);

    await result.current.refresh();

    expect(api.stats).toHaveBeenCalledTimes(1);
    expect(api.listNodes).toHaveBeenCalledTimes(1);
  });
});