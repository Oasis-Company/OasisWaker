"use client";

/**
 * Global error boundary — Swiss Style.
 *
 * Renders a centered error card with:
 * - Black border container
 * - Red 2px accent bar
 * - Error message display
 * - Error ID (digest) for debugging
 * - Retry button
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-swiss-white p-lg">
      <div
        className="max-w-md w-full border border-swiss-black p-lg bg-swiss-white"
        role="alert"
        aria-live="assertive"
      >
        {/* Red accent bar */}
        <div className="w-8 h-0.5 bg-swiss-red mb-md" />

        <p className="text-h3 text-swiss-black mb-sm">Something went wrong</p>
        <p className="text-caption text-swiss-gray-500 mb-lg">
          {error.message ?? "An unexpected error occurred."}
        </p>
        {error.digest && (
          <p className="text-caption text-swiss-gray-400 mb-lg font-mono text-xs">
            Error ID: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          className="bg-swiss-black text-swiss-white text-body-bold px-md py-sm hover:bg-swiss-gray-700 transition-colors"
          aria-label="Try again"
        >
          Retry
        </button>
      </div>
    </div>
  );
}