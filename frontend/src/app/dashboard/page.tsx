"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { RefreshCw, Activity } from "lucide-react";
import { StatsCard } from "@/components/layout/StatsCard";
import { Badge } from "@/components/ui/Badge";
import { Table, type Column } from "@/components/ui/Table";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { StorageUsageChart } from "@/components/dashboard/StorageUsageChart";
import { useDashboardData } from "@/lib/hooks";
import { formatBytes, formatTimeAgo, formatDateTime } from "@/lib/format";
import type { NodeRead } from "@/lib/api";
import type { WsConnectionStatus } from "@/lib/ws";

/* ── Table columns (memoized) ──────────────────────────────────────────────── */

const WS_STATUS_LABEL: Record<WsConnectionStatus, { label: string; className: string }> = {
  connected: { label: "Connected", className: "bg-swiss-black" },
  connecting: { label: "Connecting...", className: "bg-swiss-gray-400" },
  disconnected: { label: "Disconnected", className: "bg-swiss-gray-300" },
};

/* ── Page Component ────────────────────────────────────────────────────────── */

export default function DashboardPage() {
  const router = useRouter();
  const reducedMotion = useReducedMotion();

  const containerVariants = useMemo(
    () =>
      reducedMotion
        ? {
            hidden: { opacity: 1 },
            visible: { opacity: 1, transition: { staggerChildren: 0 } },
          }
        : {
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.03 },
            },
          },
    [reducedMotion],
  );

  const itemVariants = useMemo(
    () =>
      reducedMotion
        ? {
            hidden: { y: 0, opacity: 1 },
            visible: { y: 0, opacity: 1 },
          }
        : {
            hidden: { y: 8, opacity: 0 },
            visible: {
              y: 0,
              opacity: 1,
              transition: { duration: 0.4, ease: "easeOut" },
            },
          },
    [reducedMotion],
  );

  const {
    stats,
    nodes,
    isLoading,
    error,
    lastUpdated,
    refresh,
    wsStatus,
  } = useDashboardData();

  // Memoize column definitions — they never change
  const columns = useMemo<Column<NodeRead>[]>(
    () => [
      {
        key: "name",
        header: "Name",
        sortable: true,
        sortValue: (n) => n.name,
        render: (n) => <span className="font-semibold">{n.name}</span>,
      },
      {
        key: "status",
        header: "Status",
        sortable: true,
        sortValue: (n) => n.status,
        render: (n) => (
          <Badge variant={n.status === "online" ? "online" : "offline"}>
            {n.status}
          </Badge>
        ),
      },
      {
        key: "platform",
        header: "Platform",
        sortable: true,
        sortValue: (n) => n.platform ?? "",
        render: (n) => n.platform ?? "—",
      },
      {
        key: "storage",
        header: "Storage",
        sortable: true,
        sortValue: (n) => n.used_storage / Math.max(n.total_storage, 1),
        render: (n) =>
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>
            {formatBytes(n.used_storage)} / {formatBytes(n.total_storage)}
          </span>,
      },
      {
        key: "last_heartbeat",
        header: "Last Heartbeat",
        sortable: true,
        sortValue: (n) => n.last_heartbeat ?? "",
        render: (n) =>
          n.last_heartbeat
            ? formatDateTime(n.last_heartbeat)
            : "Never",
      },
    ],
    []
  );

  /* ── Loading state ──────────────────────────────────────────────────── */

  if (isLoading && !stats) {
    return (
      <motion.div
        className="space-y-3xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Page header skeleton */}
        <div>
          <div className="skeleton h-10 w-48 mb-sm" />
          <div className="skeleton h-4 w-72" />
        </div>

        {/* Stats cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          <Skeleton variant="card" />
          <Skeleton variant="card" />
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </div>

        {/* Chart skeleton */}
        <Skeleton variant="chart" />

        {/* Table skeleton */}
        <div className="card">
          <div className="skeleton h-6 w-32 mb-md" />
          <Skeleton variant="table-row" rows={4} />
        </div>
      </motion.div>
    );
  }

  /* ── Error state (render within ErrorBoundary) ──────────────────────── */

  // We render the error inline if useDashboardData exhausted retries
  const errorContent = error ? (
    <div className="border border-swiss-black p-lg bg-swiss-white" role="alert">
      <div className="w-8 h-0.5 bg-swiss-red mb-md" />
      <p className="text-h3 text-swiss-black mb-sm">Connection Error</p>
      <p className="text-caption text-swiss-gray-500 mb-lg">
        Unable to reach the OasisWaker backend. Ensure the server is running on
        port 8000.
      </p>
      <p className="text-caption text-swiss-gray-400 mb-lg">{error.message}</p>
      <button
        onClick={refresh}
        className="bg-swiss-black text-swiss-white text-body-bold px-md py-sm hover:bg-swiss-gray-700 transition-colors"
        aria-label="Retry loading"
      >
        Retry
      </button>
    </div>
  ) : null;

  /* ── Empty state ────────────────────────────────────────────────────── */

  const isEmpty = stats && stats.total_nodes === 0;

  const emptyContent = isEmpty ? (
    <div className="flex flex-col items-center justify-center py-4xl text-center">
      <Activity className="w-16 h-16 text-swiss-gray-300 mb-lg" />
      <h2 className="text-h2 text-swiss-black mb-sm">Network is Ready</h2>
      <p className="text-body text-swiss-gray-500 max-w-md mb-xl">
        Connect your first node to begin monitoring your edge infrastructure.
      </p>
      <Link
        href="/nodes"
        className="bg-swiss-black text-swiss-white text-body-bold px-xl py-md hover:bg-swiss-gray-700 transition-colors"
      >
        Add Node
      </Link>
    </div>
  ) : null;

  /* ── Normal state ───────────────────────────────────────────────────── */

  const wsInfo = WS_STATUS_LABEL[wsStatus] ?? WS_STATUS_LABEL.disconnected;

  return (
    <ErrorBoundary>
      <motion.div
        className="space-y-3xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Page Header */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-h1">Dashboard</h1>
              <p className="text-swiss-gray-500 mt-sm">
                Network overview and real-time status
              </p>
            </div>
            <div className="flex items-center gap-md">
              {/* WebSocket status */}
              <div className="flex items-center gap-sm">
                <div className={`w-2 h-2 ${wsInfo.className}`} />
                <span className="text-caption text-swiss-gray-500">
                  {wsInfo.label}
                </span>
              </div>
              {/* Last updated */}
              <span className="text-caption text-swiss-gray-400">
                {lastUpdated ? `Updated ${formatTimeAgo(lastUpdated.toISOString())}` : ""}
                <span aria-live="polite" aria-atomic="true" className="sr-only">
                  {lastUpdated
                    ? `Dashboard updated ${formatTimeAgo(lastUpdated.toISOString())}`
                    : ""}
                </span>
              </span>
              {/* Refresh button */}
              <button
                onClick={refresh}
                className="p-sm border border-swiss-gray-300 hover:bg-swiss-gray-100 transition-colors"
                aria-label="Refresh data"
              >
                <RefreshCw className="w-4 h-4 text-swiss-black" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Error banner */}
        {errorContent}

        {/* Empty state */}
        {emptyContent}

        {/* Stats Cards — 2×2 grid */}
        {!isEmpty && stats && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-md"
            variants={itemVariants}
          >
            <StatsCard
              label="Total Nodes"
              value={stats.total_nodes}
              sub="Registered in network"
              delay={100}
            />
            <StatsCard
              label="Active Nodes"
              value={stats.active_nodes}
              sub="Reporting heartbeat"
              accent
              delay={130}
            />
            <StatsCard
              label="Total Storage"
              value={formatBytes(stats.total_storage_bytes)}
              sub="Aggregated capacity"
              delay={160}
            />
            <StatsCard
              label="Used Storage"
              value={formatBytes(stats.used_storage_bytes)}
              sub="Across all nodes"
              delay={190}
            />
          </motion.div>
        )}

        {/* Storage Usage Chart — full width */}
        {!isEmpty && stats && stats.total_storage_bytes > 0 && (
          <motion.div variants={itemVariants}>
            <StorageUsageChart
              usedBytes={stats.used_storage_bytes}
              totalBytes={stats.total_storage_bytes}
            />
          </motion.div>
        )}

        {/* Recent Nodes Table */}
        {!isEmpty && (
          <motion.div className="card" variants={itemVariants}>
            <div className="flex items-center justify-between mb-md">
              <h2 className="text-h2">Recent Nodes</h2>
            </div>
            <Table
              columns={columns}
              data={nodes}
              getRowKey={(n) => n.id}
              searchable
              pageSize={10}
              isLoading={isLoading && !error}
              emptyMessage="No nodes registered yet"
              onRowClick={(n) => {
                router.push(`/nodes/${n.id}`);
              }}
            />
          </motion.div>
        )}
      </motion.div>
    </ErrorBoundary>
  );
}