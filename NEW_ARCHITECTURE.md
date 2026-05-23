# OasisWaker New Architecture: Universal Infrastructure Kernel

## 📋 Repositioning

**Old Design**:
- Users directly run CLI to deploy one-time nodes
- Centralized coordination (OasisBio)
- Single purpose

**New Design**:
- OasisWaker as a kernel integrated into user projects
- True P2P decentralized network
- Universal infrastructure (not limited to OasisBio)

---

## 🏗️ New Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
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

---

## 📦 Monorepo Project Structure

```
oasiswaker/
├── 📁 packages/
│   ├── 📦 core/
│   │   ├── src/
│   │   │   ├── p2p/           # P2P Network
│   │   │   ├── storage/       # Storage Abstraction
│   │   │   └── discovery/     # Node Discovery
│   │   └── package.json
│   │
│   ├── 📦 cli/
│   │   ├── src/
│   │   │   ├── init.ts        # Initialize User Project
│   │   │   ├── install.ts     # Install Kernel
│   │   │   ├── deploy.ts      # Deploy User Project
│   │   │   └── update.ts      # Update Kernel
│   │   └── package.json
│   │
│   ├── 📦 cloudflare/
│   ├── 📦 vercel/
│   └── 📦 supabase/
│
├── 📁 templates/
│   └── default/               # New User Project Template
│       ├── oasiswaker.config.js
│       ├── package.json
│       └── src/
│
└── package.json
```

---

## 🚀 New User Workflow

### 1️⃣ Initialize Project (User)

```bash
# Install CLI
npm install -g @oasiswaker/cli

# Initialize a new project
oasiswaker init my-oasis-node

cd my-oasis-node

# This creates a complete project including:
# - OasisWaker Kernel
# - Configuration File
# - Deployment Template
# - GitHub Workflow
```

### 2️⃣ Configure Project (User)

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

### 3️⃣ Push to GitHub (User)

```bash
git init
git add .
git commit -m "Initial OasisWaker node"
git remote add origin https://github.com/you/my-oasis-node
git push
```

### 4️⃣ Deploy (User)

```bash
# Deploy to Cloudflare
oasiswaker deploy --platform cloudflare

# Deploy to Vercel
oasiswaker deploy --platform vercel

# This deploys your entire project + OasisWaker kernel together
```

### 5️⃣ Auto-form Network (P2P)

```
Once deployed, user's node automatically:
1. Joins DHT network
2. Discovers other nodes
3. Starts direct communication
4. Forms decentralized network
```

---

## 🎯 Core Design Principles

### ✅ True Decentralization
- No single point of failure
- Direct P2P communication between nodes
- DHT node discovery

### ✅ Universal Infrastructure
- Any project can integrate
- Not limited to OasisBio
- Modular design

### ✅ User Ownership
- Users have full control over their nodes
- Users own their project code
- Users have their own GitHub repositories

### ✅ Continuous Maintenance
- `oasiswaker update` command updates kernel
- Version management
- Rolling upgrades

---

## 📝 Core Components Details

### @oasiswaker/core
- P2P DHT Network
- Message Passing System
- Data Synchronization Protocol
- Node Discovery

### @oasiswaker/cli
- init: Initialize user project
- install: Install/update kernel
- deploy: Deploy user project
- status: View network status
- update: Update kernel version

### Platform Adapters
- Handle different cloud platform deployments
- Provide unified interface
- Runtime platform detection

---

## 🎨 New Architecture Advantages

| Comparison | Old Architecture | New Architecture |
|------------|------------------|------------------|
| Centralization | ❌ Yes | ✅ No (P2P) |
| Universality | ❌ Single purpose | ✅ Universal infrastructure |
| User Control | ⚠️ Partial | ✅ Complete |
| Scalability | ⚠️ Limited | ✅ Unlimited |
| Single Point of Failure | ❌ Yes | ✅ No |

---

**This is what OasisWaker should look like!** 🌴
