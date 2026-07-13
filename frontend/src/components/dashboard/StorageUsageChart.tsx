"use client";

import React from "react";
import { motion } from "framer-motion";

interface StorageUsageChartProps {
  usedBytes: number;
  totalBytes: number;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

/**
 * Pure CSS horizontal bar chart — Swiss Style.
 *
 * - Background: `swiss-gray-200`, foreground: `swiss-red`
 * - Animated width via framer-motion `motion.div`
 * - No axes, no gridlines, no legends
 */
export function StorageUsageChart({ usedBytes, totalBytes }: StorageUsageChartProps) {
  const percentage =
    totalBytes > 0
      ? Math.min(Math.round((usedBytes / totalBytes) * 100), 100)
      : 0;

  return (
    <div className="card" role="img" aria-label={`Storage usage: ${percentage}% used`}>
      <div className="flex items-center justify-between mb-md">
        <p className="text-caption text-swiss-gray-500 uppercase tracking-wider">
          Storage Usage
        </p>
        <span className="text-h1 text-swiss-red">{percentage}%</span>
      </div>

      {/* Bar background */}
      <div className="w-full h-6 bg-swiss-gray-200 relative overflow-hidden">
        {/* Bar foreground with animation */}
        <motion.div
          className="absolute inset-y-0 left-0 bg-swiss-red"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.25 }}
        />
      </div>

      {/* Exact values */}
      <div className="flex justify-between mt-xs">
        <span className="text-caption text-swiss-gray-500">
          {formatBytes(usedBytes)} used
        </span>
        <span className="text-caption text-swiss-gray-500">
          {formatBytes(totalBytes)} total
        </span>
      </div>
    </div>
  );
}