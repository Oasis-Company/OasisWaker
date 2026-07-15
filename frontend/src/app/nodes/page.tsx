"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Table, type Column } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { useFetch } from "@/lib/hooks/useFetch";
import { api, type NodeRead } from "@/lib/api";
import { formatBytes, formatDateTime } from "@/lib/format";

export default function NodesPage() {
  const router = useRouter();
  const { data, isLoading, error } = useFetch(
    (signal) => api.listNodes(undefined, signal),
    []
  );

  const nodes = data?.items ?? [];

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
      render: (n) => <span style={{ fontVariantNumeric: 'tabular-nums' }}>{formatBytes(n.used_storage)} / {formatBytes(n.total_storage)}</span>,
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
          ? formatDateTime(n.last_heartbeat)
          : "Never",
    },
  ];

  if (isLoading) {
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
          getRowKey={(node) => node.id}
          onRowClick={(node) => router.push(`/nodes/${node.id}`)}
        />
      </div>
    </div>
  );
}