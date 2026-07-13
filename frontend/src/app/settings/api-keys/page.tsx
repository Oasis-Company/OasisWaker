"use client";

import { useState, useEffect, type FormEvent } from "react";
import { authApi, type ApiKeyInfo, type ApiKeyCreated } from "@/lib/api";

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKeyInfo[]>([]);
  const [newKey, setNewKey] = useState<ApiKeyCreated | null>(null);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchKeys = async () => {
    try {
      const data = await authApi.listApiKeys();
      setKeys(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load API keys");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

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

  const handleRevoke = async (id: string) => {
    if (!window.confirm("Revoke this API key? This action cannot be undone.")) {
      return;
    }
    try {
      await authApi.deleteApiKey(id);
      setNewKey(null);
      await fetchKeys();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to revoke API key"
      );
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
                    {new Date(key.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-md py-sm text-caption text-swiss-gray-500">
                    {key.last_used_at
                      ? new Date(key.last_used_at).toLocaleDateString()
                      : "Never"}
                  </td>
                  <td className="px-md py-sm text-right">
                    <button
                      onClick={() => handleRevoke(key.id)}
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