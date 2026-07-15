"use client";

import { Skeleton } from "@/components/ui/Skeleton";

export default function NodeDetailLoading() {
  return (
    <div className="space-y-3xl" aria-label="Loading node details">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-md">
          <div className="skeleton h-10 w-10" />
          <div>
            <div className="skeleton h-8 w-48" />
            <div className="skeleton h-3 w-64 mt-xs" />
          </div>
          <div className="skeleton h-6 w-16" />
        </div>
        <div className="skeleton h-10 w-24" />
      </div>

      {/* Info grid skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        <Skeleton variant="card" />
        <Skeleton variant="card" />
        <Skeleton variant="card" />
      </div>

      {/* Storage card skeleton */}
      <div className="card space-y-md">
        <div className="skeleton h-6 w-32" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-3 w-48" />
      </div>
    </div>
  );
}