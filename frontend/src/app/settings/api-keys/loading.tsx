"use client";

export default function ApiKeysLoading() {
  return (
    <div aria-label="Loading API keys">
      {/* Header skeleton */}
      <div className="mb-2xl">
        <div className="skeleton h-7 w-32 mb-sm" />
        <div className="skeleton h-3 w-72" />
      </div>

      {/* Create form skeleton */}
      <div className="flex gap-md mb-xl">
        <div className="skeleton h-11 flex-1" />
        <div className="skeleton h-11 w-28" />
      </div>

      {/* Table skeleton */}
      <div className="border border-swiss-gray-300">
        <div role="status" aria-label="Loading table">
          {/* Header row */}
          <div className="flex gap-md px-md py-sm border-b border-swiss-gray-300 bg-swiss-gray-100">
            <div className="skeleton h-3 w-1/5" />
            <div className="skeleton h-3 w-1/5" />
            <div className="skeleton h-3 w-1/6" />
            <div className="skeleton h-3 w-1/6" />
            <div className="skeleton h-3 w-1/12" />
          </div>
          {/* Data rows */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex gap-md px-md py-sm border-b border-swiss-gray-200"
            >
              <div className="skeleton h-3 w-1/5" />
              <div className="skeleton h-3 w-1/5" />
              <div className="skeleton h-3 w-1/6" />
              <div className="skeleton h-3 w-1/6" />
              <div className="skeleton h-3 w-1/12" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}