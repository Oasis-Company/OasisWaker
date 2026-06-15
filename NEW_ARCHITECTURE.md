# OasisWaker v2.0 — Architecture Proposal

> **Status:** This is a proposal. No v2.0 code has been written yet.
> v1.0 (the current CLI tool) is documented in [DOCUMENTATION.md](DOCUMENTATION.md).
> The migration plan is in [MIGRATION_PLAN.md](MIGRATION_PLAN.md).

---

## Why a New Architecture?

v1.0 works, but has fundamental limitations:

| Problem | v1.0 | v2.0 Goal |
|---------|-------|------------|
| Central coordination | OasisBio server is SPOF | True P2P — nodes find each other |
| Node discovery | Central directory | DHT (Kademlia) |
| Single point of failure | Yes — server goes down, network stops | No — network routes around outages |
| User ownership | Limited — you deploy via our server | Complete — your project, your node |

---

## Proposed Architecture

### Overview

```
┌─────────────────────────────────────────────────────┐
│                         User Layer                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐   │
│  │ User Project 1  │  │ User Project 2  │  │ User Project 3  │   │
│  │ (GitHub Repo)   │  │ (GitHub Repo)   │  │ (GitHub Repo)   │   │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘   │
│           │                    │                    │              │
│           └──────────────┬────────────────────────┘              │
└──────────────────────────┼──────────────────────────────────────────┘
                           │
                           │ @oasiswaker/cli (Install & Maintain)
                           │
┌──────────────────────────▼──────────────────────────────────────────┐
│                    OasisWaker Kernel Layer                            │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ @oasiswaker/core - P2P Network Engine                          │  │
│  │ ├─ DHT Node Discovery                                           │  │
│  │ ├─ Message Routing                                             │  │
│  │ └─ Data Synchronization                                         │  │
│  └────────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ @oasiswaker/cloudflare/vercel/supabase - Platform Adapters    │  │
│  └────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                           │
                           │ P2P Communication (No Center!)
                           │
┌──────────────────────────▼──────────────────────────────────────────┐
│                    Decentralized Network Layer                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │ Node A (cloudflare) ◄──────► Node B (vercel)                   │ │
│  │        │                                 │                     │ │
│  │        └───────────► Node C (supabase) ◄─────────────────────┘ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### Monorepo Structure (Proposed)

```
oasiswaker/
├── packages/
│   ├── core/          # P2P network kernel
│   ├── cli/           # CLI tool
│   ├── cloudflare/   # Cloudflare Worker adapter
│   ├── vercel/       # Vercel Edge adapter
│   └── supabase/     # Supabase Edge adapter
│
├── templates/         # New user project template
│   └── default/
│       ├── oasiswaker.config.js
│       ├── package.json
│       └── src/
│
└── package.json       # workspace root
```

> **Note:** The current repo is NOT a monorepo yet. This structure is the target for Phase 1 of the migration plan.

---

## Proposed User Workflow (v2.0)

### 1. Initialize Project

```bash
npm install -g @oasiswaker/cli

oasiswaker init my-oasis-node
cd my-oasis-node

# Creates:
# - OasisWaker Kernel (installed as dependency)
# - oasiswaker.config.js
# - Deployment template
# - GitHub Actions workflow
```

### 2. Configure

```javascript
// my-oasis-node/oasiswaker.config.js
export default {
  network: 'mainnet',

  node: {
    id: 'my-awesome-node',
    name: 'My First Oasis Node',
  },

  platforms: ['cloudflare', 'vercel'],

  p2p: {
    discovery: ['dht', 'bootstrap'],
    bootstrap: ['https://seed1.oasiswaker.dev'],
  },

  storage: {
    capacity: '10GB',
  }
};
```

### 3. Push to GitHub

```bash
git init
git add .
git commit -m "Initial OasisWaker node"
git remote add origin https://github.com/you/my-oasis-node
git push
```

### 4. Deploy

```bash
oasiswaker deploy --platform cloudflare
oasiswaker deploy --platform vercel
```

### 5. Auto-form Network (P2P)

Once deployed, the node automatically:
1. Joins the DHT network
2. Discovers other nodes
3. Starts direct P2P communication
4. Forms a decentralized mesh

---

## Core Components (Proposed)

### `@oasiswaker/core`
- P2P DHT Network (libp2p / kad-dht)
- Message Passing System
- Data Synchronization Protocol (CRDT-based)
- Node Discovery

### `@oasiswaker/cli`
- `init` — Initialize user project
- `install` — Install/update kernel
- `deploy` — Deploy user project
- `status` — View network status
- `update` — Update kernel version

### Platform Adapters
- Handle different cloud platform deployments
- Provide unified interface
- Runtime platform detection

---

## Design Principles

✅ **True Decentralization** — No single point of failure  
✅ **Universal Infrastructure** — Any project can integrate  
✅ **User Ownership** — Users own their code and nodes  
✅ **Continuous Maintenance** — `oasiswaker update` keeps kernel current  

---

## Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| v1.0 CLI tool | ✅ Implemented | Working, security issues documented in [CRITIQUE.md](CRITIQUE.md) |
| Monorepo structure | ❌ Not started | Phase 1 of [PLAN.md](PLAN.md) |
| P2P DHT | ❌ Not started | Phase 2 — blocked by Worker runtime limits (see [CRITIQUE.md](CRITIQUE.md)) |
| Erasure coding | ❌ Not started | Phase 3 |
| Incentive layer | ❌ Not started | Phase 4 |

---

## Next Steps

1. **Phase 0:** Fix v1.0 security issues ([CRITIQUE.md](CRITIQUE.md))
2. **Phase 1:** Monorepo migration ([MIGRATION_PLAN.md](MIGRATION_PLAN.md))
3. **Phase 2:** P2P network spike (validate libp2p on CLI daemons before touching Workers)
4. **Phase 3+:** Erasure coding, incentives, production hardening

---

*This document describes a proposal. If you're reading this and want to help build it, see [CONTRIBUTING.md](CONTRIBUTING.md).*
