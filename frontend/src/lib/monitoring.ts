/**
 * Minimal error monitoring capture.
 * Replace with Sentry or a self-hosted endpoint when ready.
 */
export function captureError(error: unknown, context?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") {
    // TODO: Send to monitoring service
    console.error("[monitoring]", error, context);
  } else {
    console.error("[monitoring:dev]", error, context);
  }
}

export function captureEvent(name: string, data?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") {
    // TODO: Send to monitoring service
    console.log("[monitoring:event]", name, data);
  }
}