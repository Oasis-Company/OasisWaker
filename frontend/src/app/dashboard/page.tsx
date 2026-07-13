"use client";

import React, { useEffect, useState } from "react";
import { StatsCard } from "@/components/layout/StatsCard";
import { Badge } from "@/components/ui/Badge";
import { Table, type Column } from "@/components/ui/Table";
import { api, type NodeRead, type StatsResponse } from "@/lib/api";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [nodes, setNodes] = useState<NodeRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [statsData, nodesData] = await Promise.all([
          api.stats(),
          api.listNodes({ limit: 10 }),
        ]);
        setStats(statsData);
        setNodes(nodesData.items);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-swiss-gray-400">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <p className="text-swiss-red font-semibold">Connection Error</p>
        <p className="text-caption text-swiss-gray-500 mt-sm">
          Unable to reach the OasisWaker backend. Ensure the server is running on port 8000.
        </p>
        <p className="text-caption text-swiss-gray-400 mt-xs">{error}</p>
      </div>
    );
  }

  const columns: Column<NodeRead>[] = [
    {
      key: "name",
      header: "Name",
      render: (n) => <span className="font-semibold">{n.name}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (n) => (
        <Badge variant={n.status === "online" ? "online" : "offline"}>
          {n.status}
        </Badge>
      ),
    },
    {
      key: "platform",
      header: "Platform",
      render: (n) => n.platform ?? "—",
    },
    {
      key: "storage",
      header: "Storage",
      render: (n) => `${formatBytes(n.used_storage)} / ${formatBytes(n.total_storage)}`,
    },
    {
      key: "last_heartbeat",
      header: "Last Heartbeat",
      render: (n) =>
        n.last_heartbeat
          ? new Date(n.last_heartbeat).toLocaleString()
          : "Never",
    },
  ];

  return (
    <div className="space-y-3xl">
      {/* Page Header */}
      <div>
        <h1 className="text-h1">Dashboard</h1>
        <p className="text-swiss-gray-500 mt-sm">
          Network overview and real-time status
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
        <StatsCard
          label="Total Nodes"
          value={stats?.total_nodes ?? 0}
          sub="Registered in network"
        />
        <StatsCard
          label="Active Nodes"
          value={stats?.active_nodes ?? 0}
          sub="Reporting heartbeat"
        />
        <StatsCard
          label="Total Storage"
          value={formatBytes(stats?.total_storage_bytes ?? 0)}
          sub="Aggregated capacity"
        />
        <StatsCard
          label="Used Storage"
          value={formatBytes(stats?.used_storage_bytes ?? 0)}
          sub="Across all nodes"
        />
      </div>

      {/* Recent Nodes */}
      <div className="card">
        <div className="flex items-center justify-between mb-md">
          <h2 className="text-h2">Recent Nodes</h2>
        </div>
        <Table columns={columns} data={nodes} />
      </div>
    </div>
  );
}