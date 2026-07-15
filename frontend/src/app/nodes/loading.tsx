"use client";

export default function NodesLoading() {
  return (
    <div className="space-y-3xl" aria-label="Loading nodes">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="skeleton h-8 w-24" />
          <div className="skeleton h-3 w-48 mt-sm" />
        </div>
        <div className="skeleton h-10 w-36" />
      </div>

      {/* Table skeleton */}
      <div className="card">
        <div role="status" aria-label="Loading table">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex gap-md px-md py-sm border-b border-swiss-gray-200"
            >
              <div className="skeleton h-3 w-1/4" />
              <div className="skeleton h-3 w-1/6" />
              <div className="skeleton h-3 w-1/6" />
              <div className="skeleton h-3 w-1/4" />
              <div className="skeleton h-3 w-1/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}