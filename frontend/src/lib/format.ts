/* ──────────────────────────────────────────────────────────────────────────
   Shared formatting utilities
   ────────────────────────────────────────────────────────────────────────── */

/**
 * Format bytes into a human-readable string (e.g. "1.2 GB", "345 MB").
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);
  return `${value.toFixed(decimals)} ${sizes[i]}`;
}

/**
 * Format a date string into a locale-aware date string.
 * @param dateString ISO date string
 * @param locale Locale for formatting, defaults to "en-US"
 */
export function formatDate(dateString: string, locale = "en-US"): string {
  return new Date(dateString).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format a date string into a locale-aware date/time string.
 * @param dateString ISO date string
 * @param locale Locale for formatting, defaults to "en-US"
 */
export function formatDateTime(dateString: string, locale = "en-US"): string {
  return new Date(dateString).toLocaleString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Returns a human-readable "time ago" string.
 * NOTE: This is a pure function — use `useTimeAgo` hook for reactive updates.
 */
export function formatTimeAgo(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diffMs = now - then;

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  return formatDate(dateString);
}