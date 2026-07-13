import { useEffect, useRef, useCallback } from "react";

interface UsePollingOptions {
  enabled?: boolean;
  onError?: (e: Error) => void;
}

/**
 * Generic polling hook with visibility-aware pausing and manual revalidation.
 *
 * - Pauses when `document.visibilityState` is "hidden" (background tab).
 * - Cleans up timer on unmount.
 * - `revalidate()` triggers an immediate callback and resets the interval.
 */
export function usePolling(
  callback: () => Promise<void>,
  interval: number,
  options: UsePollingOptions = {}
): { isPolling: boolean; revalidate: () => void } {
  const { enabled = true, onError } = options;
  const savedCallback = useRef(callback);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPollingRef = useRef(false);

  // Keep callback ref fresh
  savedCallback.current = callback;

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    isPollingRef.current = false;
  }, []);

  const startTimer = useCallback(() => {
    if (!enabled) return;
    clearTimer();
    timerRef.current = setInterval(async () => {
      try {
        await savedCallback.current();
      } catch (e) {
        onError?.(e instanceof Error ? e : new Error(String(e)));
      }
    }, interval);
    isPollingRef.current = true;
  }, [enabled, interval, clearTimer, onError]);

  // Manual revalidation
  const revalidate = useCallback(() => {
    clearTimer();
    // Fire immediately then restart
    savedCallback.current().catch((e) =>
      onError?.(e instanceof Error ? e : new Error(String(e)))
    );
    startTimer();
  }, [clearTimer, startTimer, onError]);

  // Visibility-aware polling
  useEffect(() => {
    if (!enabled) {
      clearTimer();
      return;
    }

    const handleVisibility = () => {
      if (document.hidden) {
        clearTimer();
      } else {
        startTimer();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    startTimer();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      clearTimer();
    };
  }, [enabled, startTimer, clearTimer]);

  return { isPolling: isPollingRef.current, revalidate };
}