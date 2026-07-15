"use client";

import { useState, type FormEvent } from "react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useFetch } from "@/lib/hooks/useFetch";
import { authApi, type ApiKeyCreated } from "@/lib/api";
import { formatDate } from "@/lib/format";

export default function ApiKeysPage() {
  const [newKey, setNewKey] = useState<ApiKeyCreated | null>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [revokeTarget, setRevokeTarget] = useState<string | null>(null);
  const [revoking, setRevoking] = useState(false);

  const { data, isLoading, refetch: fetchKeys } = useFetch(
    () => authApi.listApiKeys(),
    []
  );
  const keys = data ?? [];

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const created = await authApi.createApiKey(name);
      setNewKey(created);
      setName("");
      await fetchKeys();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create API key"
      );
    }
  };

  const handleRevoke = async () => {
    if (!revokeTarget) return;
    setRevoking(true);
    try {
      await authApi.deleteApiKey(revokeTarget);
      setNewKey(null);
      setRevokeTarget(null);
      await fetchKeys();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to revoke API key"
      );
    } finally {
      setRevoking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-body text-swiss-gray-500">Loading API keys...</div>
    );
  }

  return (
    <div>
      <div className="mb-2xl">
        <h2 className="text-h2 mb-sm">API Keys</h2>
        <p className="text-body text-swiss-gray-500">
          Create and manage API keys for programmatic access to OasisWaker.
        </p>
      </div>

      {/* New Key Created — Show Once */}
      {newKey && (
        <div className="border border-swiss-black p-lg mb-xl bg-swiss-gray-100">
          <p className="text-caption text-swiss-red uppercase tracking-wider mb-sm">
            Store this key now — it will not be shown again
          </p>
          <div className="flex items-center gap-md">
            <code className="flex-1 bg-swiss-white border border-swiss-gray-300 px-md py-sm text-body break-all select-all">
              {newKey.full_key}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(newKey.full_key);
              }}
              className="border border-swiss-black px-md py-sm text-caption text-swiss-black hover:bg-swiss-gray-100"
            >
              Copy
            </button>
          </div>
        </div>
      )}

      {/* Create Form */}
      <form onSubmit={handleCreate} className="flex gap-md mb-xl">
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Key name (e.g. sandboxer-integration)"
          className="flex-1 border border-swiss-gray-300 px-md py-sm text-body text-swiss-black bg-swiss-white focus:outline-none focus:border-swiss-black"
        />
        <button
          type="submit"
          className="bg-swiss-black text-swiss-white text-body-bold px-xl py-sm hover:bg-swiss-gray-700 transition-colors"
        >
          Create key
        </button>
      </form>

      {error && (
        <p className="text-caption text-swiss-red mb-lg">{error}</p>
      )}

      {/* Revoke confirmation dialog */}
      <ConfirmDialog
        isOpen={revokeTarget !== null}
        title="Revoke API Key"
        message="Revoke this API key? Any services using this key will immediately lose access."
        confirmLabel="Revoke"
        cancelLabel="Cancel"
        variant="danger"
        isLoading={revoking}
        onConfirm={handleRevoke}
        onCancel={() => setRevokeTarget(null)}
      />

      {/* Key List */}
      {keys.length === 0 ? (
        <p className="text-body text-swiss-gray-400">
          No API keys yet. Create one above.
        </p>
      ) : (
        <div className="border border-swiss-gray-300">
          <table className="w-full">
            <thead>
              <tr className="border-b border-swiss-gray-300 bg-swiss-gray-100">
                <th className="text-caption text-swiss-gray-500 uppercase tracking-wider text-left px-md py-sm">
                  Name
                </th>
                <th className="text-caption text-swiss-gray-500 uppercase tracking-wider text-left px-md py-sm">
                  Key
                </th>
                <th className="text-caption text-swiss-gray-500 uppercase tracking-wider text-left px-md py-sm">
                  Created
                </th>
                <th className="text-caption text-swiss-gray-500 uppercase tracking-wider text-left px-md py-sm">
                  Last used
                </th>
                <th className="px-md py-sm" />
              </tr>
            </thead>
            <tbody>
              {keys.map((key) => (
                <tr
                  key={key.id}
                  className="border-b border-swiss-gray-200 hover:bg-swiss-gray-50"
                >
                  <td className="px-md py-sm text-body text-swiss-black">
                    {key.name}
                  </td>
                  <td className="px-md py-sm">
                    <code className="text-caption text-swiss-gray-500">
                      {key.key_prefix}...
                    </code>
                  </td>
                  <td className="px-md py-sm text-caption text-swiss-gray-500">
                    {formatDate(key.created_at)}
                  </td>
                  <td className="px-md py-sm text-caption text-swiss-gray-500">
                    {key.last_used_at
                      ? formatDate(key.last_used_at)
                      : "Never"}
                  </td>
                  <td className="px-md py-sm text-right">
                    <button
                      onClick={() => setRevokeTarget(key.id)}
                      className="text-caption text-swiss-red hover:underline"
                    >
                      Revoke
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}