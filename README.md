# 🌴 OasisWaker

### *Universal Infrastructure Kernel for Decentralized Networks*

[![npm version](https://img.shields.io/npm/v/@oasisbio/oasiswaker.svg)](https://www.npmjs.com/package/@oasisbio/oasiswaker)
[![Node.js version](https://img.shields.io/node/v/@oasisbio/oasiswaker.svg)](https://nodejs.org/)
[![License](https://img.shields.io/github/license/oasisbio/oasiswaker.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![Build Status](https://img.shields.io/github/actions/workflow/status/oasisbio/oasiswaker/ci.yml.svg)](https://github.com/oasisbio/oasiswaker/actions)
[![Join OasisBio Discord](https://img.shields.io/badge/Discord-Join-7289da.svg?logo=discord)](https://discord.gg/oasisbio)

---

## 🎯 Vision

**OasisWaker v2.0** is a **universal infrastructure kernel** that transforms any project into a node in a decentralized P2P network.

> *"Your project, the network. Build. Deploy. Connect."*

### Core Principles

- ✅ **True Decentralization** - P2P nodes, no central coordinator
- ✅ **User Ownership** - You own your code, your node, your infrastructure
- ✅ **Universal** - Not limited to OasisBio, works with any decentralized network
- ✅ **GitHub-Native** - Deploy via GitHub, maintain via CLI

---

## 🚀 What's New in v2.0

**Different from v1.0:**
- v1.0: CLI tool that deploys nodes → Centralized coordination
- v2.0: Kernel you install in your project → True P2P network

### Key Changes

| Aspect | v1.0 (Legacy) | v2.0 (New) |
|--------|---------------|-------------|
| **Deployment** | One-time CLI deploy | Your project on GitHub |
| **Network** | Centralized via OasisBio | True P2P |
| **Ownership** | Limited user control | Complete user ownership |
| **Scalability** | Limited | Unlimited |

---

## 📦 Quick Start (v2.0)

### For New Projects

```bash
# 1. Install CLI
npm install -g @oasiswaker/cli

# 2. Initialize your project
oasiswaker init my-oasis-node

# 3. Configure
cd my-oasis-node
# Edit oasiswaker.config.js

# 4. Push to GitHub
git add . && git commit -m "Initial OasisWaker node"
git push

# 5. Deploy
oasiswaker deploy --platform cloudflare
```

### For Existing Projects

```bash
# Install kernel into your project
oasiswaker install

# Configure
# Edit oasiswaker.config.js

# Deploy
oasiswaker deploy
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      User Layer                            │
│  Your GitHub Repo                                          │
│  └─ Your Project + OasisWaker Kernel                       │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ @oasiswaker/cli
                           │
┌──────────────────────────▼────────────────────────────────┐
│                    Kernel Layer                            │
│  @oasiswaker/core - P2P Network Engine                    │
│  @oasiswaker/cloudflare/vercel/supabase - Adapters        │
└────────────────────────────────────────────────────────────┘
                           │
                           │ P2P
                           │
┌──────────────────────────▼────────────────────────────────┐
│                Decentralized Network                       │
│  Node A ◄────────────► Node B ◄────────────► Node C      │
└────────────────────────────────────────────────────────────┘
```

---

## 📚 Project Structure

```
oasiswaker/
├── packages/           # Monorepo packages (coming soon)
│   ├── core/          # P2P network kernel
│   ├── cli/           # CLI tool
│   └── adapters/      # Platform adapters
│
├── legacy/             # v1.0.0 archived code
│
├── NEW_ARCHITECTURE.md # v2.0 vision
├── MIGRATION_PLAN.md   # How to get there
└── DOCUMENTATION.md     # This index
```

---

## 📖 Documentation

### Getting Started
- [DOCUMENTATION.md](DOCUMENTATION.md) - Complete documentation index
- [NEW_ARCHITECTURE.md](NEW_ARCHITECTURE.md) - v2.0 architecture vision
- [MIGRATION_PLAN.md](MIGRATION_PLAN.md) - Phase-by-phase migration plan

### Learning from v1.0
- [LEGACY.md](LEGACY.md) - What v1.0.0 was
- [CRITIQUE.md](CRITIQUE.md) - What went wrong (important lessons!)

### Current Status
- [.trae/specs/project-preparation-phase/](.trae/specs/project-preparation-phase/) - Current work
- [.trae/archive/CODE_CLEANUP.md](.trae/archive/CODE_CLEANUP.md) - Known code issues

---

## 🤝 Contributing

We welcome contributions! See our docs:

- [CONTRIBUTING.md](CONTRIBUTING.md) - How to contribute
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) - Community guidelines

### Development Setup (Legacy v1.0)

```bash
# Clone and install
git clone https://github.com/oasisbio/oasiswaker.git
cd oasiswaker
npm install

# Build
npm run build

# Test
npm test
```

**Note:** v2.0 development is coming soon. See [MIGRATION_PLAN.md](MIGRATION_PLAN.md).

---

## 📄 License

This project is [MIT licensed](LICENSE).

---

## 🗣️ Community & Support

- 💬 [Discord](https://discord.gg/oasisbio) - Join discussions
- 🐛 [GitHub Issues](https://github.com/oasisbio/oasiswaker/issues) - Report issues
- 📖 [Documentation](DOCUMENTATION.md) - Full documentation

---

<p align="center">
  <strong>Built with ❤️ by the OasisBio Team</strong>
  <br>
  <em>Your project, the network. Build. Deploy. Connect.</em>
</p>

[![Star us on GitHub](https://img.shields.io/github/stars/oasisbio/oasiswaker?style=social)](https://github.com/oasisbio/oasiswaker)
