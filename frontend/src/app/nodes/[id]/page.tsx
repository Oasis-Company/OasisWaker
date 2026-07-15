"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useFetch } from "@/lib/hooks/useFetch";
import { api } from "@/lib/api";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { formatBytes, formatDateTime } from "@/lib/format";

export default function NodeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const nodeId = params.id as string;
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { data: node, isLoading, error: fetchError } = useFetch(
    () => api.getNode(nodeId),
    [nodeId]
  );

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.deleteNode(nodeId);
      router.push("/nodes");
    } catch {
      setDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-swiss-gray-400">Loading...</p>
      </div>
    );
  }

  if (fetchError || !node) {
    return (
      <div className="card">
        <p className="text-swiss-red font-semibold">Error</p>
        <p className="text-caption text-swiss-gray-500 mt-sm">
          {fetchError ?? "Node not found"}
        </p>
        <Link href="/nodes" className="inline-block mt-md">
          <Button variant="secondary" size="sm">
            ← Back to Nodes
          </Button>
        </Link>
      </div>
    );
  }

  const storageUsed = node.total_storage > 0
    ? ((node.used_storage / node.total_storage) * 100).toFixed(1)
    : "0";

  return (
    <div className="space-y-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-md">
          <Link href="/nodes">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-h1">{node.name}</h1>
            <p className="text-caption text-swiss-gray-500 font-mono mt-xs">
              {node.node_id}
            </p>
          </div>
          <Badge variant={node.status === "online" ? "online" : "offline"}>
            {node.status}
          </Badge>
        </div>
        <Button
          variant="danger"
          size="sm"
          onClick={() => setShowConfirm(true)}
          disabled={deleting}
        >
          <Trash2 className="w-4 h-4 mr-sm" />
          {deleting ? "Deleting..." : "Delete"}
        </Button>
      </div>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        title="Delete Node"
        message="Permanently remove this node? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        isLoading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        <div className="card">
          <p className="text-caption text-swiss-gray-500 uppercase tracking-wider mb-sm">
            Platform
          </p>
          <p className="text-body-bold">{node.platform ?? "Not specified"}</p>
        </div>
        <div className="card">
          <p className="text-caption text-swiss-gray-500 uppercase tracking-wider mb-sm">
            Version
          </p>
          <p className="text-body-bold">{node.version ?? "—"}</p>
        </div>
        <div className="card">
          <p className="text-caption text-swiss-gray-500 uppercase tracking-wider mb-sm">
            Last Heartbeat
          </p>
          <p className="text-body-bold">
            {node.last_heartbeat
              ? formatDateTime(node.last_heartbeat)
              : "Never"}
          </p>
        </div>
      </div>

      {/* Storage */}
      <div className="card">
        <h2 className="text-h2 mb-md">Storage Usage</h2>
        <div className="flex items-center gap-md mb-sm">
          <div className="flex-1 h-4 bg-swiss-gray-200">
            <div
              className="h-full bg-swiss-black transition-all"
              style={{ width: `${Math.min(Number(storageUsed), 100)}%` }}
            />
          </div>
          <span className="text-body-bold text-swiss-gray-700">
            {storageUsed}%
          </span>
        </div>
        <p className="text-caption text-swiss-gray-500" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {formatBytes(node.used_storage)} used of {formatBytes(node.total_storage)}
        </p>
      </div>
    </div>
  );
}