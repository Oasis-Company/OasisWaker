import { useEffect, useRef, useState, useCallback } from "react";
import { api, type NodeRead, type StatsResponse } from "@/lib/api";
import { wsClient, type WsConnectionStatus } from "@/lib/ws";

/* ── Types ───────────────────────────────────────────────────────────────── */

interface UseDashboardDataResult {
  stats: StatsResponse | null;
  nodes: NodeRead[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: Error | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
  wsStatus: WsConnectionStatus;
}

/* ── Constants ───────────────────────────────────────────────────────────── */

const POLL_INTERVAL = 30_000; // 30s
const MAX_RETRIES = 3;
const RETRY_DELAYS = [1_000, 2_000, 4_000]; // 1s, 2s, 4s
const TIMEOUT_MS = 10_000;

/* ── Hook ─────────────────────────────────────────────────────────────────── */

export function useDashboardData(): UseDashboardDataResult {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [nodes, setNodes] = useState<NodeRead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [wsStatus, setWsStatus] = useState<WsConnectionStatus>("disconnected");

  // Refs for lifecycle management
  const abortRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(true);
  const pendingPromiseRef = useRef<Promise<{ stats: StatsResponse; nodes: NodeRead[] }> | null>(null);
  const wsConnectedRef = useRef(false);

  /* ── Core fetch function ──────────────────────────────────────────────── */

  const fetchData = useCallback(
    async (isManualRefresh = false): Promise<{ stats: StatsResponse; nodes: NodeRead[] } | null> => {
      // Abort any in-flight request
      if (abortRef.current) {
        abortRef.current.abort();
      }
      abortRef.current = new AbortController();
      const signal = abortRef.current.signal;

      // Request deduplication: if same call is in-flight, return same promise
      if (!isManualRefresh && pendingPromiseRef.current) {
        return pendingPromiseRef.current;
      }

      // Timeout via AbortController
      const timeoutId = setTimeout(() => abortRef.current?.abort(), TIMEOUT_MS);

      const promise = (async () => {
        try {
          const [statsData, nodesData] = await Promise.all([
            api.stats(signal),
            api.listNodes({ limit: 10 }, signal),
          ]);
          return { stats: statsData, nodes: nodesData.items };
        } finally {
          clearTimeout(timeoutId);
        }
      })();

      if (!isManualRefresh) {
        pendingPromiseRef.current = promise;
      }

      try {
        const result = await promise;
        return result;
      } catch (e) {
        if (signal.aborted) {
          // Component unmounted or superseded — silently ignore
          return null;
        }
        throw e;
      }
    },
    []
  );

  /* ── Load with retry ──────────────────────────────────────────────────── */

  const load = useCallback(
    async (isManualRefresh = false) => {
      if (!mountedRef.current) return;

      // Show skeleton only on first load, not on background refresh
      if (isManualRefresh) {
        setIsRefreshing(true);
      }

      try {
        const result = await fetchData(isManualRefresh);
        if (!result || !mountedRef.current) return;

        setStats(result.stats);
        setNodes(result.nodes);
        setLastUpdated(new Date());
        setError(null);
        retryCountRef.current = 0;
        setIsLoading(false);
        setIsRefreshing(false);
      } catch (e) {
        if (!mountedRef.current) return;

        const err = e instanceof Error ? e : new Error(String(e));

        // Retry with exponential backoff
        if (retryCountRef.current < MAX_RETRIES) {
          const delay = RETRY_DELAYS[retryCountRef.current] ?? RETRY_DELAYS[RETRY_DELAYS.length - 1];
          retryCountRef.current++;
          retryTimerRef.current = setTimeout(() => {
            load(isManualRefresh);
          }, delay);
          return;
        }

        // All retries exhausted
        setError(err);
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [fetchData]
  );

  /* ── Manual refresh ───────────────────────────────────────────────────── */

  const refresh = useCallback(async () => {
    await load(true);
  }, [load]);

  /* ── Polling ──────────────────────────────────────────────────────────── */

  const stopPolling = useCallback(() => {
    if (pollTimerRef.current !== null) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  const startPolling = useCallback(() => {
    stopPolling();
    pollTimerRef.current = setInterval(() => {
      load(false);
    }, POLL_INTERVAL);
  }, [load, stopPolling]);

  /* ── WebSocket integration ────────────────────────────────────────────── */

  useEffect(() => {
    // Connect WebSocket
    wsClient.connect();

    // Listen for connection status changes
    const unsubStatus = wsClient.onStatusChange((status) => {
      setWsStatus(status);
      wsConnectedRef.current = status === "connected";

      if (status === "connected") {
        // WS connected → stop polling
        stopPolling();
      } else if (status === "disconnected") {
        // WS disconnected → resume polling
        startPolling();
      }
    });

    // Listen for real-time events
    const unsubEvent = wsClient.onEvent((event) => {
      if (!mountedRef.current) return;
      if (event.type === "stats_update" || event.type === "node_update") {
        // Trigger a background refresh
        load(false);
      }
    });

    return () => {
      unsubStatus();
      unsubEvent();
    };
  }, [load, startPolling, stopPolling]);

  /* ── Initial load + lifecycle ─────────────────────────────────────────── */

  useEffect(() => {
    mountedRef.current = true;
    setIsLoading(true);

    // Kick off first load
    load(false);

    // Start polling as fallback (will be paused if WS connects)
    startPolling();

    return () => {
      mountedRef.current = false;
      if (abortRef.current) abortRef.current.abort();
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
      stopPolling();
      pendingPromiseRef.current = null;
    };
  }, [load, startPolling, stopPolling]);

  return {
    stats,
    nodes,
    isLoading,
    isRefreshing,
    error,
    lastUpdated,
    refresh,
    wsStatus,
  };
}