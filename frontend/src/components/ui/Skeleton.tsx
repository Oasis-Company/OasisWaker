import React from "react";

interface SkeletonProps {
  variant: "card" | "table-row" | "text" | "chart";
  rows?: number;
  width?: string;
}

const rowClass = "skeleton h-3 mb-sm";

/**
 * Structural skeleton placeholders — Swiss Style.
 *
 * Uses the existing `skeleton-pulse` CSS animation from globals.css.
 * Zero JS runtime overhead beyond React rendering.
 */
export function Skeleton({ variant, rows = 4, width }: SkeletonProps) {
  switch (variant) {
    case "card":
      return (
        <div className="card space-y-md" role="status" aria-label="Loading content">
          <div className="skeleton h-3 w-1/3" />
          <div className="skeleton h-10 w-2/3" />
          <div className="skeleton h-3 w-1/2" />
        </div>
      );

    case "table-row":
      return (
        <div role="status" aria-label="Loading table">
          {Array.from({ length: rows }).map((_, i) => (
            <div
              key={i}
              className="flex gap-md px-md py-sm border-b border-swiss-gray-200"
            >
              <div className={`${rowClass} w-1/4`} />
              <div className={`${rowClass} w-1/6`} />
              <div className={`${rowClass} w-1/6`} />
              <div className={`${rowClass} w-1/4`} />
              <div className={`${rowClass} w-1/5`} />
            </div>
          ))}
        </div>
      );

    case "chart":
      return (
        <div className="card" role="status" aria-label="Loading chart">
          <div className="skeleton h-6 w-full" />
          <div className="skeleton h-3 w-1/4 mt-md" />
        </div>
      );

    case "text":
      return (
        <div
          className="skeleton h-3"
          style={{ width: width ?? "100%" }}
          role="status"
          aria-label="Loading text"
        />
      );
  }
}