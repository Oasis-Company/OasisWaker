# OasisWaker — Project Status

> **Important:** This file describes current reality, including known issues.  
> For the ideal vision, see [VISION.md](VISION.md).  
> For the roadmap, see [PLAN.md](PLAN.md).

---

## Current Version: v1.0.0 (CLI Tool)

**Status:** Functional but not production-ready.

The v1.0 CLI tool works end-to-end:
`init` → `login` → `deploy` → `status` → `revoke`

But it has known security and reliability issues documented in [CRITIQUE.md](CRITIQUE.md).

---

## What Works

| Feature | Status | Notes |
|---------|--------|-------|
| `oasiswaker init` | ✅ | Generates node UUID + config |
| `oasiswaker login` (PKCE OAuth) | ✅ | Cloudflare/Vercel/Supabase |
| `oasiswaker deploy` | ✅ | Deploys Worker to user's account |
| `oasiswaker status` | ✅ | Health check + node status |
| `oasiswaker revoke` | ✅ | Deletes resources + revokes credentials |
| AES-256-GCM credential encryption | ✅ | But master key stored in plaintext (see Critique) |
| CI/CD (GitHub Actions) | ✅ | Multi-OS, multi-Node.js matrix |
| npm package config | ✅ | `@oasisbio/oasiswaker` v1.0.0 |

---

## Known Issues (Honest Assessment)

Documented in [CRITIQUE.md](CRITIQUE.md):

| Issue | Severity | Status |
|-------|----------|--------|
| Master key stored as plaintext file | 🔴 High | Not fixed |
| Hardcoded `X-Oasis-Secret` in Worker template | 🔴 High | Not fixed |
| No true decentralization (central coordinator) | 🔴 High | v1.0 design, v2.0 planned |
| Supabase adapter has hardcoded placeholders | 🟡 Medium | Not fixed |
| Error handling is `process.exit(1)` everywhere | 🟡 Medium | Not fixed |
| Test coverage is low (~4 test files) | 🟡 Medium | Not fixed |
| No rate limiting in Worker | 🔴 High | Not fixed |
| Worker free-tier limits not enforced | 🔴 High | Not fixed |

**These issues are being addressed in Phase 0 of [PLAN.md](PLAN.md).**

---

## What Does NOT Exist Yet (v2.0 Vision)

These are described in docs but **not implemented**:

- [ ] P2P DHT node discovery
- [ ] Erasure coding for data redundancy
- [ ] True mesh topology (no central coordinator)
- [ ] Monorepo package structure (`packages/`)
- [ ] `@oasiswaker/core`, `@oasiswaker/cli` as separate packages
- [ ] Incentive/credit layer
- [ ] `oasiswaker update` command

---

## Development Phases

| Phase | Goal | Status |
|--------|------|--------|
| **Phase 0** | Fix v1.0 security issues | 🔄 Not started |
| **Phase 1** | Monorepo migration | ⏳ Blocked by Phase 0 |
| **Phase 2** | P2P network (DHT spike) | ⏳ Blocked by Phase 1 |
| **Phase 3** | Data sync & CRDT | ⏳ Not started |
| **Phase 4** | Incentive layer | ⏳ Not started |
| **Phase 5** | Production hardening | ⏳ Not started |

---

## How to Help

If you want to contribute:

1. Pick a item from [CRITIQUE.md](CRITIQUE.md)
2. Read [CONTRIBUTING.md](CONTRIBUTING.md)
3. Open a PR

Good first issues:
- [ ] Replace `process.exit(1)` with structured error handling
- [ ] Add `waitUntil()` to Worker for async KV writes
- [ ] Write tests for `src/deploy/cloudflare.ts`
- [ ] Fix Supabase adapter hardcoded URLs

---

*Updated: 2026-06-04 — always check [CHANGELOG.md](CHANGELOG.md) for latest.*
