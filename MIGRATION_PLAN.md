# OasisWaker Architecture Migration Plan

## 📋 Overview

This document outlines how to migrate from the **single CLI tool** architecture to the **universal infrastructure kernel** architecture.

---

## 🎯 Goals

### Phase 0: Archive Current Code
- Mark current code as `v1.0.0` (legacy)
- Keep in project, but start new architecture development

### Phase 1: Monorepo Refactoring
- Establish packages structure
- Separate core packages

### Phase 2: New CLI Development
- Start with simple installation tool
- Project template generation

### Phase 3: P2P Network Implementation
- DHT node discovery
- Message routing

---

## 📅 Detailed Migration Phases

### Phase 0: Archive & Mark (Day 1)

```
Actions:
1. Mark current state as v1.0.0 (legacy)
2. Create LEGACY.md documentation
3. Keep all existing code

Location:
- Current code stays unchanged
- New development in v2/ branch or new monorepo structure
```

---

### Phase 1: Refactor Project Structure (1-2 Weeks)

```
Goal: Establish monorepo

Steps:
1. Install Turborepo or Lerna
2. Create packages/ folder
3. Move current code to packages/legacy-cli
4. Set up workspace configuration

New Structure:
oasiswaker/
├── packages/
│   ├── legacy-cli/        (current code)
│   ├── core/              (new)
│   ├── cli/               (new)
│   └── adapters/
│       ├── cloudflare/
│       ├── vercel/
│       └── supabase/
├── templates/
└── package.json
```

---

### Phase 2: Develop New CLI (2-3 Weeks)

```
Goal: New @oasiswaker/cli

Features:
1. oasiswaker init <name> - Generate project template
2. oasiswaker install - Install kernel to project
3. oasiswaker deploy - Deploy user project
4. oasiswaker update - Update kernel

Template Structure:
my-oasis-node/
├── oasiswaker.config.js
├── package.json
├── src/
│   └── index.js
└── .github/
    └── workflows/
```

---

### Phase 3: Develop Core Package (3-4 Weeks)

```
Goal: @oasiswaker/core - P2P Network Engine

Core Modules:
├── p2p/
│   ├── dht/              # DHT Node Discovery
│   ├── peer/             # Peer Management
│   └── message/          # Message Routing
├── storage/
│   ├── abstraction/      # Storage Abstraction
│   └── sync/            # Data Synchronization
└── discovery/
    ├── bootstrap/
    └── gossip/
```

---

### Phase 4: Platform Adapters (2 Weeks)

```
Goal: @oasiswaker/cloudflare, vercel, supabase

Features:
- Unified deployment interface
- Runtime environment detection
- Storage backend adapters
```

---

### Phase 5: Testing & Documentation (2 Weeks)

```
Goals:
- Integration tests
- User documentation
- Example projects
```

---

## 📦 New Package Release Plan

```
npm packages:
├── @oasiswaker/core
├── @oasiswaker/cli
├── @oasiswaker/cloudflare
├── @oasiswaker/vercel
├── @oasiswaker/supabase
└── oasiswaker (legacy, keep compatibility)
```

---

## 🚀 Summary

| Phase | Time | Deliverables |
|-------|------|--------------|
| Phase 0 | 1 day | Archive current code |
| Phase 1 | 1-2 weeks | Monorepo structure |
| Phase 2 | 2-3 weeks | New CLI tool |
| Phase 3 | 3-4 weeks | P2P core |
| Phase 4 | 2 weeks | Platform adapters |
| Phase 5 | 2 weeks | Testing & docs |

**Total Time: ~2.5-3 months**

---

**New architecture, new beginning!** 🌴
