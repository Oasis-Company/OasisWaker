import { useEffect, useRef, useState, useCallback } from "react";

/* ──────────────────────────────────────────────────────────────────────────
   useFetch — Generic data fetching hook with AbortController cleanup
   Automatically aborts pending requests on unmount and prevents
   setState on unmounted components.
   ────────────────────────────────────────────────────────────────────────── */

interface UseFetchResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFetch<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: unknown[] = []
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track mounted state to prevent setState after unmount
  const mountedRef = useRef(true);
  const abortRef = useRef<AbortController | null>(null);

  const execute = useCallback(() => {
    // Abort any pending request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setError(null);

    fetcher(controller.signal)
      .then((result) => {
        if (mountedRef.current) {
          setData(result);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (mountedRef.current && err.name !== "AbortError") {
          setError(err instanceof Error ? err.message : "Request failed");
          setIsLoading(false);
        }
      });
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    mountedRef.current = true;
    execute();

    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
    };
  }, [execute]);

  return { data, isLoading, error, refetch: execute };
}