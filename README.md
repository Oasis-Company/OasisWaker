# 🌴 OasisWaker

### *Crowdsourced Edge Infrastructure*

[![Node.js version](https://img.shields.io/node/v/@oasisbio/oasiswaker.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/github/license/Oasis-Company/OasisWaker.svg)](LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/Oasis-Company/OasisWaker/ci.yml.svg)](https://github.com/Oasis-Company/OasisWaker/actions)
[![GitHub stars](https://img.shields.io/github/stars/Oasis-Company/OasisWaker?style=social)](https://github.com/Oasis-Company/OasisWaker)

---

## What is OasisWaker?

OasisWaker is a CLI tool that lets you contribute your cloud platform's free-tier quota (Cloudflare Workers, Vercel Edge, Supabase Edge) into a shared decentralized storage network.

**Current status (v1.0):** A working CLI tool with centralized coordination.  
**Next goal (v2.0):** A true P2P mesh network where nodes discover each other without a central server.

> *"Your free-tier cloud quota, aggregated into infrastructure that no single company controls."*

---

## v1.0 — Current Release

A Node.js CLI tool (`@oasisbio/oasiswaker`) that:

- Generates a unique node identity (`oasiswaker init`)
- Connects your Cloudflare/Vercel/Supabase account via OAuth2.0 PKCE (`oasiswaker login`)
- Deploys an edge Worker to your account that exposes a unified block storage API (`oasiswaker deploy`)
- Reports node health/metrics to a central coordinator (`oasiswaker status`)
- Securely stores credentials with AES-256-GCM encryption

```
$ oasiswaker init
$ oasiswaker login --cloudflare
$ oasiswaker deploy --platform cloudflare
✓ Deployed. Your node is live at: https://oasis-<nodeId>.workers.dev
```

**Limitations (known, documented in [CRITIQUE.md](CRITIQUE.md)):**
- Centralized coordination (OasisBio server is the single point of failure)
- Hardcoded secrets in Worker template (being fixed in Phase 0)
- No P2P node discovery yet (planned for v2.0)
- Test coverage is low

---

## v2.0 — Vision (Not Yet Implemented)

We are working toward a true decentralized mesh:

```
Browser
   │
   ▼
DHT (Kademlia) ← peer discovery
   │
   ├── Cloudflare Worker → R2 Storage
   ├── Vercel Edge     → Blob Storage
   └── Supabase Edge   → Storage Bucket
```

Key goals:
- **P2P node discovery** via DHT (no central directory)
- **Erasure coding** — data survives node failures
- **Client-side encryption** — node operators cannot read stored data
- **Incentive layer** — contribute resources, earn credits

This is the [VISION.md](VISION.md). It is not built yet. See [PLAN.md](PLAN.md) for the roadmap.

---

## Quick Start (v1.0)

```bash
# Clone the repo
git clone https://github.com/Oasis-Company/OasisWaker.git
cd OasisWaker

# Install dependencies
npm install

# Build
npm run build

# Run CLI
node dist/cli/index.js --help
```

> **Note:** You need Cloudflare/Vercel/Supabase API tokens to test deployment. See [RESOURCES.md](RESOURCES.md) for setup.

---

## Documentation

| Document | Description |
|-----------|-------------|
| [VISION.md](VISION.md) | Ideal state — what we're building toward |
| [PLAN.md](PLAN.md) | Phased roadmap with checklists and pitfalls |
| [CRITIQUE.md](CRITIQUE.md) | Known security issues and technical debt |
| [DOCUMENTATION.md](DOCUMENTATION.md) | Full documentation index |
| [RESOURCES.md](RESOURCES.md) | Cloud platform setup checklist |
| [PROJECT_STATUS.md](PROJECT_STATUS.md) | Current development status |
| [NEW_ARCHITECTURE.md](NEW_ARCHITECTURE.md) | v2.0 architecture proposal (not implemented) |

---

## Project Structure

```
oasiswaker/
├── src/
│   ├── cli/           # CLI commands (commander.js)
│   ├── auth/          # OAuth2.0 PKCE flow
│   ├── crypto/        # AES-256-GCM encryption
│   ├── deploy/        # Platform adapters (Cloudflare/Vercel/Supabase)
│   └── utils/        # Shared utilities
├── tests/
├── .github/workflows/ # CI (multi-OS, multi-Node matrix)
├── PLAN.md            # Roadmap
├── VISION.md         # Ideal state
└── CRITIQUE.md       # Known issues
```

> **Note:** The `packages/` monorepo structure described in older docs is planned for v2.0, not yet implemented.

---

## Contributing

We welcome contributions! See:

- [CONTRIBUTING.md](CONTRIBUTING.md) — How to contribute
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) — Community guidelines
- [CRITIQUE.md](CRITIQUE.md) — Known issues (great starting points for contributors)

### Development Setup

```bash
git clone https://github.com/Oasis-Company/OasisWaker.git
cd OasisWaker
npm install
npm run build
npm test
```

---

## License

[MIT licensed](LICENSE).

---

## Community

- 🐛 [GitHub Issues](https://github.com/Oasis-Company/OasisWaker/issues) — Report bugs
- 💬 [GitHub Discussions](https://github.com/Oasis-Company/OasisWaker/discussions) — Ask questions

---

<p align="center">
  <strong>Built with ❤️ by the OasisBio Team</strong><br>
  <em>Your free-tier cloud quota, aggregated.</em>
</p>
