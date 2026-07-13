"use client";

import React, { useState } from "react";
import { FileText, BookOpen, Layers, Shield, GitBranch, ArrowRight } from "lucide-react";

interface DocSection {
  id: string;
  title: string;
  content: string;
}

const DOC_SECTIONS: DocSection[] = [
  {
    id: "core-principle",
    title: "Core Principle: Protocol vs Adapter",
    content: `OasisWaker is neither "others adapt to us" nor "we adapt to others." It is a layered design.

The Protocol Layer defines the standard — block format, encryption scheme (AES-256-GCM), node registration, heartbeat contracts, and transport interfaces. Any platform that wants to join the network implements this protocol.

The Adapter Layer translates the protocol to each platform's native API. Cloudflare Workers adapters speak R2, Vercel Edge adapters speak Blob, Supabase adapters speak Storage. The adapters speak the platform's language, but obey OasisWaker's protocol.

The User Layer is zero-coupling. The user installs a CLI, OAuth-logins to their existing accounts, and runs put/get. They never see the protocol, the adapter, or the platform difference.`,
  },
  {
    id: "protocol-first",
    title: "Protocol Over Implementation",
    content: `Every capability is defined as a protocol interface first, then implemented per platform.

Storage: put(blockId, data) / get(blockId) → R2 API / Blob API / Storage API
Encryption: AES-256-GCM + key derivation → SubtleCrypto / Node crypto
Node lifecycle: register() / heartbeat() / leave() → per-platform deployment scripts
Discovery: Node list API / WebSocket events → platform-agnostic (backend implementation)

This ensures that adding a new platform costs only writing a new adapter, not redesigning the protocol.`,
  },
  {
    id: "adapter-pluggable",
    title: "Pluggable Adapters",
    content: `Adapters are independent modules registered to the protocol layer through a unified interface. Users can enable any subset of platforms — Cloudflare only, all three, or none.

Consequences:
- Positive: On-demand loading, reduced bundle size, independent deployment
- Negative: Increased module coordination complexity, adapter-level logging needed for debugging

The adapter is a translation layer, not an adaptation layer.`,
  },
  {
    id: "user-zero-coupling",
    title: "Zero User Coupling",
    content: `The user should never perceive that "this block is stored on Cloudflare." All platform differences are encapsulated in the adapter layer. The CLI and Dashboard interact only with the protocol.

This means:
- Consistent user experience regardless of backend
- Single CLI command format across all platforms
- Unified Dashboard metrics aggregated from all connected platforms
- Debugging requires adapter-layer logging`,
  },
];

function SectionCard({ section, index }: { section: DocSection; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <div className="border border-swiss-gray-300">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-lg py-md hover:bg-swiss-gray-100 transition-colors text-left"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-md">
          <div className="w-8 h-8 bg-swiss-black flex items-center justify-center">
            {index === 0 ? (
              <Layers className="w-4 h-4 text-swiss-white" />
            ) : index === 1 ? (
              <FileText className="w-4 h-4 text-swiss-white" />
            ) : index === 2 ? (
              <GitBranch className="w-4 h-4 text-swiss-white" />
            ) : (
              <Shield className="w-4 h-4 text-swiss-white" />
            )}
          </div>
          <span className="text-body-bold text-swiss-black">{section.title}</span>
        </div>
        <ArrowRight
          className={`w-4 h-4 text-swiss-gray-400 transition-transform ${
            expanded ? "rotate-90" : ""
          }`}
        />
      </button>
      {expanded && (
        <div className="px-lg pb-lg">
          <div className="w-full h-px bg-swiss-gray-200 mb-md" />
          <div className="text-body text-swiss-gray-600 leading-relaxed whitespace-pre-line">
            {section.content}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DocsPage() {
  return (
    <div className="space-y-3xl">
      <div>
        <h1 className="text-h1">Design Philosophy</h1>
        <p className="text-swiss-gray-500 mt-sm">
          Architecture principles, protocol decisions, and adapter strategy
        </p>
      </div>

      {/* Quick reference card */}
      <div className="border border-swiss-gray-300 bg-swiss-gray-100 p-lg">
        <div className="flex items-center gap-md mb-md">
          <BookOpen className="w-5 h-5 text-swiss-black" />
          <span className="text-body-bold">The Short Version</span>
        </div>
        <p className="text-body text-swiss-gray-600 leading-relaxed">
          OasisWaker defines the protocol. Adapters translate it to each platform&apos;s native API.
          Users never touch either. <strong>Protocol standard, adapter translation, user zero-coupling.</strong>
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-sm">
        {DOC_SECTIONS.map((section, i) => (
          <SectionCard key={section.id} section={section} index={i} />
        ))}
      </div>

      {/* Reference */}
      <div className="border border-swiss-gray-300 p-lg">
        <p className="text-caption text-swiss-gray-500 uppercase tracking-wider mb-sm">
          Reference
        </p>
        <p className="text-body text-swiss-gray-600">
          Full design philosophy document available at{" "}
          <code className="bg-swiss-gray-100 px-xs text-swiss-black">
            DESIGN_PHILOSOPHY.md
          </code>{" "}
          in the project root.
        </p>
      </div>
    </div>
  );
}