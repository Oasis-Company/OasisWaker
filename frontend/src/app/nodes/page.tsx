"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Table, type Column } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { api, type NodeRead } from "@/lib/api";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

export default function NodesPage() {
  const router = useRouter();
  const [nodes, setNodes] = useState<NodeRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .listNodes()
      .then((data) => setNodes(data.items))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const columns: Column<NodeRead>[] = [
    {
      key: "name",
      header: "Name",
      render: (n) => <span className="font-semibold">{n.name}</span>,
    },
    {
      key: "node_id",
      header: "Node ID",
      render: (n) => (
        <span className="text-caption text-swiss-gray-500 font-mono">
          {n.node_id.slice(0, 12)}...
        </span>
      ),
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
      key: "version",
      header: "Version",
      render: (n) => n.version ?? "—",
    },
    {
      key: "last_heartbeat",
      header: "Last Seen",
      render: (n) =>
        n.last_heartbeat
          ? new Date(n.last_heartbeat).toLocaleString()
          : "Never",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-swiss-gray-400">Loading nodes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <p className="text-swiss-red font-semibold">Error</p>
        <p className="text-caption text-swiss-gray-500 mt-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1">Nodes</h1>
          <p className="text-swiss-gray-500 mt-sm">
            {nodes.length} registered node{nodes.length !== 1 ? "s" : ""} in the network
          </p>
        </div>
        <Button variant="primary" size="md">
          + Register Node
        </Button>
      </div>

      <div className="card">
        <Table
          columns={columns}
          data={nodes}
          onRowClick={(node) => router.push(`/nodes/${node.id}`)}
        />
      </div>
    </div>
  );
}