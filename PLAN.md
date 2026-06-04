<!--
  ╔══════════════════════════════════════════════════════════════════╗
  ║              OASISWAKER — MASTER PLAN & CHECKLIST               ║
  ║              Generated: 2026-06-04 | Deep Code Audit            ║
  ╚══════════════════════════════════════════════════════════════════╝
-->
<!--                                                                      -->
<!--   ██████╗  █████╗ ███████╗██╗███████╗██╗    ██╗ █████╗ ██╗  ██╗███████╗██████╗  -->
<!--  ██╔═══██╗██╔══██╗██╔════╝██║██╔════╝██║    ██║██╔══██╗██║ ██╔╝██╔════╝██╔══██╗ -->
<!--  ██║   ██║███████║███████╗██║███████╗██║ █╗ ██║███████║█████╔╝ █████╗  ██████╔╝ -->
<!--  ██║   ██║██╔══██║╚════██║██║╚════██║██║███╗██║██╔══██║██╔═██╗ ██╔══╝  ██╔══██╗ -->
<!--  ╚██████╔╝██║  ██║███████║██║███████║╚███╔███╔╝██║  ██║██║  ██╗███████╗██║  ██║ -->
<!--   ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝╚══════╝ ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ -->
<!--                                                                      -->
<!--        Universal Infrastructure Kernel — v1 → v2 Roadmap            -->
<!--                                                                      -->
<!--  ╔══════════════════════════════════════════════════════════════════╗ -->
<!--  ║  STATUS : PRE-PHASE 0  (planning complete, execution pending)    ║ -->
<!--  ╚══════════════════════════════════════════════════════════════════╝ -->

# OasisWaker — Master Plan & Checklist

> **From v1.0 CLI tool → v2.0 decentralized infrastructure mesh**
>
> *Generated: 2026-06-04  |  Based on full-source deep audit of 30 `.ts` files*

---

```
                               ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
                               █                           █
                               █    O A S I S W A K E R    █
                               █    M A S T E R   P L A N  █
                               █                           █
                               ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
```

---

## 📊 Project Dashboard

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│   Architecture    │  Flat single-package  │  Target: Monorepo (5 pk) │
│   Topology        │  Star (hub-spoke)     │  Target: P2P mesh        │
│   Codebase        │  ~1,500 LOC, 30 files │  TypeScript, Node >=18  │
│   Tests           │  4 files, ~5% cover   │  Target: >80% core       │
│   Prod Ready?     │  ❌ NO (see CRITIQUE)  │  Target: Phase 5 end     │
│   CI/CD           │  ✅ GitHub Actions     │  3 OS × 4 Node versions  │
│   Overall Progress│  [█░░░░░░░░░░░░░░░░░] │  ~5% (planning done)    │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Current Capability Matrix

```
┌───────────────────────────┬────────┬─────────────────────────────────┐
│ Feature                   │ Status │ Notes                           │
├───────────────────────────┼────────┼─────────────────────────────────┤
│ CLI (6 commands)          │   ✅   │ init/login/deploy/status/revoke │
│ PKCE OAuth 2.0            │   ✅   │ 3-platform interactive login    │
│ Cloudflare adapter        │   ✅   │ Worker + R2 block-storage API   │
│ Vercel adapter            │   ✅   │ Edge Function + Blob            │
│ Supabase adapter          │   ⚠️   │ Hardcoded placeholders remain   │
│ AES-256-GCM encryption    │   ✅   │ Credential encryption at rest   │
│ Unified HTTP API          │   ✅   │ PUT/GET/DELETE /block, health   │
│ P2P / DHT / discovery     │   ❌   │ Zero code — v2 vision only      │
│ Node-to-node comms        │   ❌   │ All traffic via oasisbio.com    │
│ Monorepo structure        │   ❌   │ No packages/ dir exists         │
│ Economic incentives       │   ❌   │ No token/credit code            │
│ Rate limiting / quotas    │   ❌   │ Workers accept unlimited writes │
│ Master-key hardening      │   ❌   │ Plaintext in ~/.oasiswaker/     │
└───────────────────────────┴────────┴─────────────────────────────────┘
```

---

## 🗺️ Roadmap Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  │ PHASE 0  │───▶│ PHASE 1  │───▶│ PHASE 2  │───▶│ PHASE 3  │───▶│ PHASE 4  │───▶ PHASE 5
│  │ Security │    │ Monorepo │    │ P2P Net  │    │  Sync    │    │ Economy  │    │  Prod
│  │  2 wks   │    │  1 wk    │    │ 3-4 wks  │    │ 2-3 wks  │    │  2 wks   │    │  2 wks
│  │  🔴 P0   │    │  🟡 P1   │    │  🟡 P1   │    │  🟢 P2   │    │  🟢 P2   │    │  🟡 P1
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘    └────
│                                                                             │
│  TOTAL: 12–14 weeks  (~3–3.5 months)                                        │
│  CRITICAL PATH: Phase 0 → Phase 1 → Phase 2  (blockers for 3–5)           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

```
Priority Legend:
  🔴 P0 — Must fix immediately (blocker)     🟡 P1 — Important (next)
  🟢 P2 — Nice to have (later)               ⚠️  — Known risk / half-done
```

---

## ╔══════════════════════════════════════════════════════════════╗
## ║  PHASE 0 — Security Hardening & Test Coverage              ║
## ╚══════════════════════════════════════════════════════════════╝

```
┌──────────────────────────────────────────────────────────────────┐
│ GOAL:   Make v1.0 safe enough to actually use                    │
│ RULE:   NO architecture changes. Fix security, add tests, stop.  │
│ INPUT:  CRITIQUE.md  (10+ documented vulnerabilities)            │
│ OUTPUT: Production-viable v1.0 CLI                               │
└──────────────────────────────────────────────────────────────────┘
```

### ┌─ 2.1 Security Checklist ──────────────────────────────────────┐

```
🔴 P0-1  [ ]  Remove hardcoded X-Oasis-Secret
      Files:  src/deploy/{cloudflare,vercel,supabase}.ts
      Problem: "oasiswaker-default-secret" = no auth at all
      Fix:     Generate random secret per deploy → inject via env var

🔴 P0-2  [ ]  Harden master-key storage
      File:    ~/.oasiswaker/.master-key (plaintext, 0o600 only)
      Fix:     Windows Credential Manager / macOS Keychain / Linux Secret Service
               Fallback: PBKDF2-derived key with user unlock passphrase

🔴 P0-3  [ ]  Add Worker-side rate limiting
      Files:   All Worker/Edge Function templates
      Fix:     Sliding-window rate limiter (IP + token), per-Worker

🔴 P0-4  [ ]  Add Worker-side write quotas
      Problem: No capacity ceiling — user can get bill-shocked
      Fix:     Per-Worker counter, 429 on breach, configurable (default 1 GB/day)

🔴 P0-5  [ ]  Improve error handling
      Files:   src/cli/commands/*.ts
      Problem: process.exit(1) on ANY error, no retry, no rollback
      Fix:     Exponential backoff (max 3), auto-revoke on deploy failure
```

### ┌─ 2.2 Test Coverage Checklist ──────────────────────────────────┐

```
T-1  [ ]  Encryption round-trip tests     — src/crypto/encryption.ts
T-2  [ ]  OAuth PKCE flow tests            — src/auth/base.ts (mock callback server)
T-3  [ ]  Config management tests          — src/config/*.ts (concurrency, corruption)
T-4  [ ]  CLI command integration tests    — Happy path + main error paths per command
T-5  [ ]  Worker template tests            — Block API correctness (wrangler dev / miniflare)
```

### ┌─ 2.3 Phase 0 Pitfalls ─────────────────────────────────────────┐

```
┌──────────────────────────────────────────────────────────────────┐
│ ⚠  Worker 模板字符串中的转义地狱                                  │
│                                                                  │
│ src/deploy/cloudflare.ts 用模板字面量生成完整的 Worker.js。       │
│ 在模板里嵌入 X-Oasis-Secret 校验逻辑时：                          │
│                                                                  │
│   - 模板内的 ${} 会和 JS 模板语法冲突 → 必须用 \${} 转义          │
│   - Worker 里如果也用模板字符串 → 双重转义，极易写错              │
│   - 建议：把 Worker 代码抽成 .js 文件，部署时做字符串替换          │
│     （fs.readFileSync + .replace('__SECRET__', secret)）           │
│                                                                  │
│ 验证方法：部署后 curl Worker URL，确认 401 返回正确的错误信息     │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ ⚠  server.listen(0) 后的端口回传问题                              │
│                                                                  │
│ 改成随机端口后，浏览器重定向 URL 需要包含实际端口。                │
│ 但 OAuth provider 的回调 URL 必须在登录前注册（静态）。            │
│                                                                  │
│ 解决：在 redirect_uri 里用 localhost 通配端口？不行——OAuth        │
│ 规范要求 exact match。                                            │
│                                                                  │
│ 可行方案：先用固定端口（如 3099），listen 失败时自动递增重试      │
│ （3099→3100→3101...），同时把最终端口写入 redirect_uri 参数。     │
│ 还要处理 Windows 防火墙弹窗——首次监听会触发，用户可能没看到。     │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ ⚠  Worker 环境无状态——不能用内存做限流                            │
│                                                                  │
│ Cloudflare Worker 每次请求可能路由到不同 instance，内存不共享。    │
│ 所以：                                                            │
│                                                                  │
│   ❌ new Map() 存计数器 → 请求跨 instance 就丢失                   │
│   ✅ 轻量方案：Worker KV（免费 1GB 读/天，延迟 <1s 但够用）       │
│   ✅ 精确方案：Durable Objects（有状态，但需要付费计划）           │
│                                                                  │
│ Phase 0 用 KV 方案——在 KV 里为每个 IP 维护一个滑动窗口计数器。    │
│ 注意 KV 有最终一致性，短时间内可能计数不准——可接受。              │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ ⚠  系统密钥链 API 三平台差异巨大                                  │
│                                                                  │
│ Windows: 需要 node-ffi 调 CredReadW / CredWriteW，或 keytar       │
│          (keytar 需要 C++ 编译环境，用户机器可能没有)              │
│ macOS:   security CLI 可以直接用 child_process.exec，最省事       │
│ Linux:   libsecret (需要 libsecret-1-dev, 很多服务器没装)         │
│                                                                  │
│ 建议：不要硬上系统密钥链。用 PBKDF2 + 用户口令作为 Phase 0        │
│ 首选方案：                                                        │
│   1. 提示用户设置 unlock passphrase                                │
│   2. PBKDF2(passphrase, salt, 600000, sha512) → 派生 256-bit key │
│   3. 用派生密钥加密 master-key，密文存 ~/.oasiswaker/.master-key  │
│   4. 每次 CLI 启动要求输入口令（或缓存到 session）                 │
│                                                                  │
│ 系统密钥链留到 Phase 5 作为增强选项。                              │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ ⚠  Worker 配额实现——为什么不用 R2 的 max-upload-size              │
│                                                                  │
│ R2 本身有 bucket-level 限制，但那是存储量上限，不是"每日写入量"    │
│ 配额。你需要自己计数 PUT 操作的数据量。                            │
│                                                                  │
│ 注意：PUT 请求 body 的大小 ≠ R2 实际存储大小（可能有压缩）        │
│ 计费是按存储量，所以配额也应按 Content-Length header 计算。       │
│ 每日配额在 Worker 中用 KV 计数器维护，UTC 0 点 reset。            │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ ⚠  vitest 测试 Worker 模板的正确姿势                               │
│                                                                  │
│ 不能用 vitest mock Worker 的 global fetch/Request/Response——      │
│ 它们的行为和真实 Worker runtime 不一样（特别是流式 body）。       │
│                                                                  │
│ 正确方案：                                                        │
│   miniflare (npm i -D miniflare) — Cloudflare 官方本地模拟器      │
│   wrangler dev --local 启动 Worker，测试发 HTTP 请求               │
│                                                                  │
│ Vercel 侧没有等价工具，Edge Function 测试靠单元测试 + 集成测试    │
│ 走 vercel dev。Supabase 侧直接用 Deno 本地跑（他们用 Deno runtime）
└──────────────────────────────────────────────────────────────────┘
```

---

## ╔══════════════════════════════════════════════════════════════╗
## ║  PHASE 1 — Monorepo Split                                  ║
## ╚══════════════════════════════════════════════════════════════╝

```
┌──────────────────────────────────────────────────────────────────┐
│ GOAL:   Split flat package into packages/core + packages/cli    │
│         + per-adapter packages. Zero breaking changes.           │
│ RULE:   Extract first, refactor later. Types → crypto → adapters.│
│ OUTPUT: npm workspaces with 5 publishable packages              │
└──────────────────────────────────────────────────────────────────┘
```

### ┌─ 3.1 Target Structure ─────────────────────────────────────────┐

```
packages/
│
├── core/                          @oasiswaker/core
│   ├── src/
│   │   ├── types.ts               Block, NodeInfo, HealthReport etc.
│   │   ├── crypto.ts              AES-256-GCM encrypt/decrypt
│   │   ├── protocol.ts            API version, endpoints, constants
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
├── cli/                           @oasiswaker/cli
│   ├── src/
│   │   ├── index.ts               Commander.js entry (from src/cli/)
│   │   ├── commands/              init, login, deploy, status, revoke
│   │   └── auth/                  PKCE OAuth flow
│   ├── package.json
│   └── tsconfig.json
│
├── adapter-cloudflare/            @oasiswaker/adapter-cloudflare
├── adapter-vercel/                @oasiswaker/adapter-vercel
├── adapter-supabase/              @oasiswaker/adapter-supabase
│                                  ⚠ experimental — placeholders exist
│
└── oasiswaker/                    Umbrella package
    └── package.json               depends on all of the above
                                   npx oasiswaker entry preserved
```

### ┌─ 3.2 Phase 1 Checklist ────────────────────────────────────────┐

```
P1-1  [ ]  Create packages/ dir, configure npm workspaces
P1-2  [ ]  Extract @oasiswaker/core (types → crypto → protocol)
P1-3  [ ]  Migrate CLI to @oasiswaker/cli (depends on core)
P1-4  [ ]  Split adapters into independent packages
P1-5  [ ]  Each package gets its own tsconfig.json + vitest.config.ts
P1-6  [ ]  Umbrella package preserves npx oasiswaker entry point
P1-7  [ ]  Update CI matrix to test all sub-packages
P1-8  [ ]  Update README.md to reflect new structure
```

### ┌─ 3.3 Phase 1 Pitfalls ─────────────────────────────────────────┐

```
┌──────────────────────────────────────────────────────────────────┐
│ ⚠  npm workspaces 依赖提升（hoisting）的静默破坏                   │
│                                                                  │
│ npm workspaces 默认会把子包的依赖提升到根 node_modules。           │
│ 这会导致：                                                        │
│                                                                  │
│   - 子包 A 依赖 crypto-js@4.0，子包 B 依赖 crypto-js@3.0         │
│     提升后只有一个版本存活，另一个的 API 可能静默失败              │
│   - 开发时能跑，发布后装到用户机器上依赖树不同 → 生产炸了          │
│                                                                  │
│ 防御方案：                                                        │
│   1. 每个子包 package.json 里用 exact version (无 ^ ~)            │
│   2. npm ls --all 检查是否有重复包被错误去重                       │
│   3. CI 里跑一次 npm pack + npm install --production 模拟真实安装  │
│   4. 或者直接用 pnpm——它默认不提升，node_modules 结构更可预测     │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ ⚠  TypeScript project references 的路径地狱                       │
│                                                                  │
│ 拆成 monorepo 后，tsconfig.json 要配 references：                 │
│                                                                  │
│   // packages/cli/tsconfig.json                                   │
│   { "references": [{ "path": "../core" }] }                       │
│                                                                  │
│ 但 tsconfig 的 paths 和 references 是两套独立系统：                │
│   - "paths"     → 仅影响编辑器解析，不影响 tsc 编译               │
│   - "references"→ 影响 tsc --build 的编译顺序和 .d.ts 输出        │
│                                                                  │
│ 常见坑：paths 配了但 references 没配 → IDE 不报错，tsc 编译失败   │
│ 两个都要配，且 paths 的路径要和 references 一致。                  │
│                                                                  │
│ 最佳实践：用 tsc --build --verbose 看实际编译顺序。               │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ ⚠  package.json "exports" 字段的默认导出陷阱                      │
│                                                                  │
│ 拆包后每个子包要定义 exports 字段，否则子路径导入会 404：          │
│                                                                  │
│   // @oasiswaker/core/package.json                                │
│   "exports": {                                                    │
│     ".": "./src/index.ts",        // import from '@oasiswaker/core'│
│     "./crypto": "./src/crypto.ts" // import from '.../crypto'      │
│   }                                                              │
│                                                                  │
│ 注意：Node.js 的 exports 对 .ts 文件不生效！tsc 阶段靠            │
│ tsconfig paths，运行时靠编译后的 .js。所以：                       │
│   - 开发时：tsconfig paths 映射到 src/*.ts                        │
│   - 发布时：exports 映射到 dist/*.js（编译产物）                   │
│                                                                  │
│ 忘了配 exports → npm pack 后安装 → Cannot find module 错误。      │
│ 验证：npm pack && tar -tzf *.tgz 看包里是否有 dist/ 目录。        │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ ⚠  循环依赖的死锁检测                                             │
│                                                                  │
│ core → 被 cli 和 adapters 依赖（单向，安全）                      │
│ cli → 依赖 core + 调用 adapters（双向可能形成环）                  │
│                                                                  │
│ 如果 cli 依赖 adapter-cloudflare，adapter-cloudflare 又 import    │
│ cli 里的类型 → 循环依赖 → tsc 编译 OOM 或 Node 加载时卡死。       │
│                                                                  │
│ 解法：在 core 里定义 Adapter 接口（interface IAdapter），          │
│ cli 和 adapters 都只依赖 core，互相不 import。                     │
│                                                                  │
│ 检测工具：npx madge --circular packages/*/src                     │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ ⚠  Windows 上 pnpm vs npm vs yarn 的选择                          │
│                                                                  │
│ yarn link 在 Windows 上需要管理员权限创建 symlink → 已排除。       │
│ npm workspaces：0 配置成本，但 node_modules 体积大（重复拷贝）。   │
│ pnpm：硬链接 + 内容寻址存储，快且省空间，但需要 pnpm 安装。        │
│                                                                  │
│ 推荐：pnpm（项目 CI 里已有 Node.js，加 pnpm 一行的事）。          │
│ 但 package.json 里要加 "packageManager": "pnpm@9.x" 声明版本。    │
│                                                                  │
│ 如果用户全局没有 pnpm → corepack enable && corepack prepare 搞定  │
│ GitHub Actions 里加 `- run: corepack enable` 即可。               │
└──────────────────────────────────────────────────────────────────┘
```

---

## ╔══════════════════════════════════════════════════════════════╗
## ║  PHASE 2 — P2P Network Layer  (THE HARD ONE)               ║
## ╚══════════════════════════════════════════════════════════════╝

```
┌──────────────────────────────────────────────────────────────────┐
│ GOAL:   Node discovery (DHT) + direct node-to-node communication │
│ STAKES: This is the core differentiator. Get it wrong, the       │
│         entire v2 vision collapses.                               │
│ RISK:   Cloudflare Workers DON'T support TCP/UDP sockets.        │
│         This may force a hybrid architecture.                     │
└──────────────────────────────────────────────────────────────────┘
```

### ┌─ 4.1 Technology Decisions ──────────────────────────────────────┐

```
┌──────────────────────┬────────────────────────────────┬───────────────────────────┐
│ Decision             │ Recommendation                │ Why                       │
├──────────────────────┼────────────────────────────────┼───────────────────────────┤
│ DHT Protocol         │ Kademlia (libp2p-kad-dht)      │ Battle-tested by IPFS     │
│ Transport            │ libp2p (TCP + WebRTC)          │ Server + browser coverage  │
│ Node Identity        │ Wrap existing UUID as PeerId   │ Don't break v1 identity    │
│ NAT Traversal        │ AutoNAT + UPnP (libp2p built)  │ Home-network nodes need it │
│ Bootstrap            │ oasisbio.com → bootstrap list  │ Gradual decentralization  │
│ Message Protocol     │ Protobuf over libp2p streams   │ Compact, typed, extensible │
└──────────────────────┴────────────────────────────────┴───────────────────────────┘
```

### ┌─ 4.2 Gradual Decentralization Strategy ────────────────────────┐

```
  Stage A (CURRENT)              Stage B (Phase 2 END)          Stage C (FUTURE)
  
     ★ oasisbio.com                 ★ bootstrap only            ★ optional observer
    ╱ ╲                            ╱                           (metrics only)
   ╱   ╲                          ╱
  ◎     ◎                    ◎───◎───◎                        ◎───◎───◎
                             ╲   ╱   ╱                        ╲ ╱ ╲ ╱
                              ╲ ╱   ╱                          ◎   ◎
                               ◎───◎                          ╱ ╲ ╱ ╲
                                                              ◎───◎───◎
  All traffic via hub         Hub = bootstrap only           Pure DHT mesh
  Zero P2P                    DHT for data, hub for fallback  Fully autonomous
```

### ┌─ 4.3 Phase 2 Checklist ────────────────────────────────────────┐

```
P2-1  [ ]  Add libp2p dependency to @oasiswaker/core
P2-2  [ ]  Implement NodeIdentity (UUID → libp2p PeerId wrapper)
P2-3  [ ]  Implement DHT discovery module    (src/p2p/discovery.ts)
P2-4  [ ]  Implement P2P transport layer     (src/p2p/transport.ts)
P2-5  [ ]  Implement request-response protocol (for block ops)
P2-6  [ ]  Add CLI command: oasiswaker peer list
P2-7  [ ]  Research Worker libp2p feasibility ← CRITICAL BLOCKER
P2-8  [ ]  Convert oasisbio.com to bootstrap-only node
P2-9  [ ]  Integration test: 3+ node mini-mesh
```

### ┌─ 4.4 Phase 2 Pitfalls ─────────────────────────────────────────┐

```
┌──────────────────────────────────────────────────────────────────┐
│ 🔴 Worker 运行时没有 TCP/UDP socket——libp2p 根本起不来            │
│                                                                  │
│ 这不是"可能不好用"的问题，是"API 不存在"的问题。                   │
│ Cloudflare Workers 的 runtime API 白名单里没有：                   │
│   - net.createServer / net.createConnection                       │
│   - dgram.createSocket                                            │
│   - 任何 raw socket                                               │
│                                                                  │
│ 这意味着 @libp2p/tcp 和 @libp2p/webrtc（需要 socket 做信令）     │
│ 在 Worker 里直接报错。                                             │
│                                                                  │
│ 实际可行的路径（按优先级调研）：                                   │
│   ① Cloudflare Workers 的 WebSocket API（connect() 可做客户端）   │
│     → 只能做 outbound WebSocket 客户端，不能 listen               │
│     → libp2p 有 @libp2p/websockets transport，可以试              │
│   ② WebTransport (HTTP/3) — Cloudflare 2024 开始实验性支持        │
│     → libp2p 有 @libp2p/webtransport，但成熟度不如 TCP            │
│   ③ 放弃 Worker 做 P2P 节点 → Worker 只做 HTTP gateway            │
│     → P2P 层完全由 CLI daemon 承载，Worker 转发 HTTP→P2P          │
│                                                                  │
│ 建议：先用方案③快速验证 DHT 可用性，再回头调研①/②。              │
│ 不要卡在 Worker P2P 上——这可能是整个项目最大的单点风险。          │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ ⚠  libp2p 初始化配置的经验参数                                    │
│                                                                  │
│ 一个可工作的 libp2p 节点最小配置（TypeScript）：                   │
│                                                                  │
│   import { createLibp2p } from 'libp2p'                           │
│   import { tcp } from '@libp2p/tcp'                               │
│   import { noise } from '@chainsafe/libp2p-noise'                 │
│   import { yamux } from '@chainsafe/libp2p-yamux'                 │
│   import { kadDHT } from '@libp2p/kad-dht'                        │
│   import { mdns } from '@libp2p/mdns'                             │
│                                                                  │
│   const node = await createLibp2p({                                │
│     transports: [tcp()],                                          │
│     connectionEncrypters: [noise()],                               │
│     streamMuxers: [yamux()],                                      │
│     services: { dht: kadDHT(), peerDiscovery: [mdns()] }          │
│   })                                                              │
│                                                                  │
│ 常见坑：                                                          │
│   - @libp2p/tcp 需要 node:* builtins → bundler (esbuild/rollup)   │
│     要配置 external: ['@libp2p/tcp'] 或 polyfill                  │
│   - kad-dht 依赖 protobufjs → 额外 200KB+                         │
│   - MDNS 在 Docker 容器里不可用（需要 multicast）→ 测试环境需注意 │
│   - noise 握手失败时错误信息极不友好："Invalid MAC" = 密钥不匹配  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ ⚠  DHT 引导节点的配置                                             │
│                                                                  │
│ Kademlia DHT 需要 bootstrap list 冷启动。用 oasisbio.com 做       │
│ bootstrap 节点需要：                                               │
│                                                                  │
│   1. 在服务器上运行一个 libp2p 节点（Go 或 JS）                   │
│   2. 获取其 multiaddr：/ip4/<ip>/tcp/<port>/p2p/<peerId>         │
│   3. 硬编码到 CLI 配置里（或通过 DNS TXT 记录动态获取）           │
│                                                                  │
│ multiaddr 里的 IP 不能是 localhost——客户端在不同机器上。          │
│ 如果服务器 IP 会变 → 用域名：/dns4/bootstrap.oasisbio.com/tcp/... │
│                                                                  │
│ 冷启动测试：只开 1 个 bootstrap 节点 + 2 个新节点，              │
│ 确认 30s 内新节点能通过 DHT 找到彼此。                            │
│ 超时 >60s → DHT 参数需要调整（k-bucket size, alpha 并发度）。     │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ ⚠  NAT 穿透——不是所有节点都能被直连                                │
│                                                                  │
│ 用户节点多在家宽/移动热点后面，NAT 类型各异：                      │
│   - Full Cone: 直连成功                                           │
│   - Restricted / Port-Restricted: 需要 STUN 打洞                  │
│   - Symmetric: 几乎打不通，需要中继                                │
│                                                                  │
│ libp2p 内置 AutoNAT 可以检测自己的 NAT 类型。但：                  │
│   - STUN 需要外部服务器（可以用 Google 的 stun.l.google.com:19302│
│     做测试，但生产环境需要自建）                                   │
│   - 中继需要 circuit-relay 节点（需要公网 IP 的志愿者节点）       │
│                                                                  │
│ Phase 2 最低目标：DHT 发现可用 + TCP 直连（NAT 友好的节点之间）。 │
│ 中继和打洞是 Phase 3/NAT 专项，不要卡在 Phase 2。                  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ ⚠  libp2p 与 Node.js ESM/CJS 的兼容性                             │
│                                                                  │
│ libp2p 生态目前以 ESM 为主。如果 CLI 的 tsconfig 设               │
│ "module": "CommonJS"，import libp2p 会报错：                      │
│                                                                  │
│   Error [ERR_REQUIRE_ESM]: require() of ES Module not supported   │
│                                                                  │
│ 解法：                                                            │
│   - tsconfig: "module": "NodeNext", "moduleResolution": "NodeNext"│
│   - package.json: "type": "module"                                │
│   - 所有 import 用 .js 扩展名（TypeScript 的 NodeNext 要求）      │
│                                                                  │
│ 这会影响整个 CLI 的模块系统——Phase 2 开始前先确认 CLI 能切 ESM。  │
└──────────────────────────────────────────────────────────────────┘
```

---

## ╔══════════════════════════════════════════════════════════════╗
## ║  PHASE 3 — Data Sync & Consensus                           ║
## ╚══════════════════════════════════════════════════════════════╝

```
┌──────────────────────────────────────────────────────────────────┐
│ GOAL:      Multi-node data replication with conflict resolution  │
│ DEPENDS:   Phase 2 (need P2P transport first)                    │
│ APPROACH:  CRDT-first, eventual consistency, on-demand sync     │
└──────────────────────────────────────────────────────────────────┘
```

### ┌─ 5.1 Design Principles ────────────────────────────────────────┐

```
  ★ CRDT over Consensus
    Block PUT/DELETE = set operations. CRDT avoids heavy consensus protocols.

  ★ Eventual Consistency
    Accept transient divergence. Don't fight for strong consistency.

  ★ On-Demand Sync
    Pull data only when requested. No full-mesh broadcast — too expensive.
```

### ┌─ 5.2 Phase 3 Checklist ────────────────────────────────────────┐

```
P3-1  [ ]  Design CRDT block-store data structure (LWW-Register + OR-Set)
P3-2  [ ]  Implement gossip-based sync protocol (not full broadcast)
P3-3  [ ]  Implement conflict resolution (LWW, timestamp-based)
P3-4  [ ]  Data integrity verification (Merkle tree or hash chain)
P3-5  [ ]  Performance test: 100 nodes, 1,000 blocks
```

### ┌─ 5.3 Phase 3 Pitfalls ─────────────────────────────────────────┐

```
┌──────────────────────────────────────────────────────────────────┐
│ ⚠  CRDT 库的选择——别被 yjs 的"协同编辑"迷惑                       │
│                                                                  │
│ yjs 很好，但它为协同文本编辑优化，数据结构（Y.Map, Y.Array,       │
│ Y.Text）是文档导向的。块存储是 key-value 模型，用 yjs 相当于      │
│ 用 Word 来存 JSON——能行但不顺手。                                  │
│                                                                  │
│ 更适合块存储的 CRDT 方案：                                        │
│   - @organicdesign/crdts 的 LWW-Register + OR-Set                │
│   - 或者自己实现一个简单的 LWW-Map（Last-Write-Wins Map）        │
│     key → {value, timestamp, nodeId}，时间戳大的 wins             │
│                                                                  │
│ 自己实现 LWW-Map 只需要 ~100 行 TS，但要注意：                     │
│   - 时钟偏移问题：不同节点时间不一致，需要 NTP 校准或用 logical   │
│     clock（Lamport timestamp）                                     │
│   - 并发 PUT 同一 key：两个节点同时写入，timestamp 相同 → 用      │
│     nodeId 做 tiebreaker（字典序大的 wins）                        │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ ⚠  Gossip 协议的消息放大                                          │
│                                                                  │
│ 假设 100 个节点，每 30s 做一轮 gossip：                           │
│   - Full broadcast: 每轮 ~10,000 条消息 → 不可接受                │
│   - 标准 gossip (fanout=3): 每轮 ~300 条消息 → 可控              │
│                                                                  │
│ 实现要点：                                                        │
│   - 每次 gossip 随机选 √N 个 peer（不是全部）                     │
│   - 带 vector clock 避免重复传播已见过的更新                      │
│   - 只传播"摘要"（key + timestamp），对方需要时才拉完整 value     │
│   - 如果节点发现本地数据落后 >N 个版本，切到 full sync 而非 gossip │
│                                                                  │
│ 反压：单节点待处理消息 > 100 → 暂停接收新 gossip → 消费者先消化   │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ ⚠  Merkle 树的实现复杂度                                          │
│                                                                  │
│ 块存储场景的 Merkle 树不需要是二叉树——所有 block key 可以直接     │
│ 算一个 root hash（简单 Merkle-DAG 或直接 sorted hash chain）。    │
│                                                                  │
│ 实用方案（最简）：                                                 │
│   1. 按 key 排序所有 block                                        │
│   2. 每个 block 算 sha256(key + value)                            │
│   3. 所有 hash concat 再 sha256 → root hash                       │
│   4. 两个节点对比 root hash → 不同则二分查找差异 key              │
│                                                                  │
│ 这不是真正的 Merkle 树，但块数量 <10K 时够用，实现 ~30 行。       │
│ 等到 block 数量突破 100K 再考虑真正的 Merkle 树。                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## ╔══════════════════════════════════════════════════════════════╗
## ║  PHASE 4 — Economic Incentive Layer                        ║
## ╚══════════════════════════════════════════════════════════════╝

```
┌──────────────────────────────────────────────────────────────────┐
│ GOAL:      Reward storage/bandwidth contributors, throttle usage  │
│ MODEL:     Quota credits (NOT tokens — avoids securities law)    │
│ STORAGE:   Centralized ledger → distributed ledger (post-Phase 2) │
└──────────────────────────────────────────────────────────────────┘
```

### ┌─ 6.1 Core Model ───────────────────────────────────────────────┐

```
  Contributors earn credits:   storage_gb × hours_online + bandwidth_served
  Consumers spend credits:     storage_gb × hours_stored + bandwidth_consumed
  
  Credits are non-tradeable — quota allocation only, not a financial instrument.
```

### ┌─ 6.2 Phase 4 Checklist ────────────────────────────────────────┐

```
P4-1  [ ]  Design credit formula (storage × time + bandwidth)
P4-2  [ ]  Worker-side metering (actual usage, request counts)
P4-3  [ ]  Central credit ledger on oasisbio.com
P4-4  [ ]  CLI command: oasiswaker credits (balance view)
P4-5  [ ]  Later: migrate ledger to distributed (post-Phase 2)
```

### ┌─ 6.3 Phase 4 Pitfalls ─────────────────────────────────────────┐

```
┌──────────────────────────────────────────────────────────────────┐
│ 🔴 积分账本的"可审计但不可交易"设计                                │
│                                                                  │
│ 使用"quota credits"这个词，代码里变量名用 credits/quota，          │
│ 绝对不用 token/coin/reward/earn/mine 等词。                       │
│                                                                  │
│ 这不仅仅是措辞问题——如果被误分类为证券/虚拟货币，项目直接死。     │
│ 代码审查 checklist：grep -ri "token\|coin\|reward\|earn\|mine"    │
│ 确保零命中（除了 OAuth token 这种不同语义的）。                    │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ ⚠  Worker 侧埋点的性能开销                                        │
│                                                                  │
│ 每次 PUT/GET 请求都要：                                           │
│   1. 记录请求体积（bytes）                                         │
│   2. 更新 KV 中的计数器                                           │
│   3. (可能的) 报告给中心服务器                                     │
│                                                                  │
│ KV 写入延迟：~100ms（多数 <10ms，但 P99 可达 500ms+）             │
│ 如果 KV 写入在请求关键路径上 → 用户感知延迟翻倍。                  │
│                                                                  │
│ 方案：                                                            │
│   - 请求关键路径：只读 KV 计数器（快）→ 判断是否超配额             │
│   - 异步更新：写入计数丢到 waitUntil() 里（Worker 的 background    │
│     promise，不阻塞响应）                                          │
│   - 定期 bulk report：每 100 个请求或每 5 分钟向中心服务器报告一次│
│     而不是每次请求都报告                                           │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ ⚠  Sybil 防御——PoW 还是社交验证？                                  │
│                                                                  │
│ 一个节点 = 一个 UUID，零成本创建。                                 │
│ 防女巫方案对比：                                                  │
│                                                                  │
│   PoW (工作量证明)：                                                │
│     + 纯技术方案，不依赖第三方                                     │
│     - 耗电，移动设备不友好                                         │
│     - 实现：节点注册时解一个 hashcash puzzle (难度可调)           │
│                                                                  │
│   社交验证 (已有 OAuth 账号)：                                     │
│     + 零额外成本（用户已经 OAuth 登录）                            │
│     - GitHub/Google 账号也能批量注册                               │
│     + 可以结合账号年龄/follower 数做信誉分                          │
│                                                                  │
│ 建议：Phase 4 先用 OAuth 账号做基础 anti-sybil（一个账号 = 一个   │
│ 节点），不做 PoW。如果发现滥用再上 PoW。                            │
└──────────────────────────────────────────────────────────────────┘
```

---

## ╔══════════════════════════════════════════════════════════════╗
## ║  PHASE 5 — Production Hardening & Audit                    ║
## ╚══════════════════════════════════════════════════════════════╝

```
┌──────────────────────────────────────────────────────────────────┐
│ GOAL:   Make the system trustworthy for real users               │
│ INPUT:  All previous phases complete, feature-stable             │
└──────────────────────────────────────────────────────────────────┘
```

### ┌─ 7.1 Phase 5 Checklist ────────────────────────────────────────┐

```
P5-1  [ ]  Third-party security audit (encryption, auth, P2P protocol)
P5-2  [ ]  Performance benchmarks (latency P50/P95/P99, throughput)
P5-3  [ ]  Chaos engineering (random node kills, partitions, clock skew)
P5-4  [ ]  API documentation + deployment guide + security best practices
P5-5  [ ]  Privacy policy + terms of service
P5-6  [ ]  Observability: monitoring + alerting for central services
P5-7  [ ]  Implement oasiswaker update (CLI self-update)
```

---

## ╔══════════════════════════════════════════════════════════════╗
## ║  CROSS-PHASE PITFALLS  (apply everywhere)                  ║
## ╚══════════════════════════════════════════════════════════════╝

```
┌──────────────────────────────────────────────────────────────────┐
│ 🔴  Windows PowerShell 的编码和路径问题                           │
│                                                                  │
│ 中文 Windows 默认使用 GBK (cp936) 编码，而非 UTF-8。              │
│ 但项目所有 .ts/.md/.json 文件都以 UTF-8 存储。                    │
│                                                                  │
│ 具体坑：                                                          │
│   - child_process.exec 返回的 stdout 中文乱码 → 加 {encoding:'utf8'}│
│   - fs.readFileSync 无 encoding 参数返回 Buffer，toString() 默认  │
│     utf8 没问题；但 Windows 路径分隔符 \ 在 JSON 里要转义          │
│   - .gitattributes 加 *.ts text eol=lf ——避免 CRLF 混入          │
│   - PowerShell 的 curl 是 Invoke-WebRequest 的别名，行为不同！    │
│     测试脚本用 curl.exe 而不是 curl                               │
│                                                                  │
│ CI 务必包含 windows-latest runner ——很多问题只有 Windows 能暴露。 │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ 🔴  Worker free-tier 边界数字（每次设计决策前必查）                │
│                                                                  │
│  Cloudflare Workers Free:                                        │
│    100,000 req/day  |  10 ms CPU/req  |  128 MB memory           │
│    1,000 req/min burst limit（超过排队，不是拒绝）                 │
│                                                                  │
│  Cloudflare KV Free:                                              │
│    1 GB stored  |  1M reads/day  |  1K writes/day                 │
│    ⚠ 写操作极贵（Free 只有 1000 次/天！）                          │
│                                                                  │
│  Vercel Edge Functions (Hobby):                                   │
│    100,000 invocations/day  |  默认 10s timeout                   │
│    500,000 function-duration (GB-sec) / month                     │
│                                                                  │
│  Supabase Edge Functions (Free):                                  │
│    500,000 invocations/month  |  2M function-duration/month       │
│    50 MB max payload                                              │
│                                                                  │
│  设计约束：一个节点每天处理 1000 个块操作 → 需要 ~50 ms CPU       │
│  → Cloudflare 免费额度只够 200 req/天（10ms 限制太紧了！）        │
│                                                                  │
│  对策：Worker 用 Wall-clock time（idle 时间不算 CPU time），       │
│  利用 I/O 等待（R2 读写不算 CPU）来节省 CPU 配额。                │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ 🟡  Git 提交信息语言：英文                                        │
│                                                                  │
│ 用户偏好：所有 commit message 和代码注释用英文。                   │
│ 中文仅用于 PR description 和文档（如本文件）。                     │
│ 提交格式：Conventional Commits（docs:/feat:/fix:/chore: 前缀）。  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ 🟡  package.json engines 字段的变化要谨慎                         │
│                                                                  │
│ 当前 "engines": { "node": ">=18" }。                              │
│ 如果要引入 Node 20 特性（如 .env 内置、import.meta.resolve、      │
│ test runner），必须：                                              │
│   1. 更新 engines 字段 + CI matrix                                │
│   2. 在 CHANGELOG 标明 breaking change                            │
│   3. 检查所有 deploy target（Worker/Edge Function runtime）       │
│      的 Node 版本兼容性                                            │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ 🟡  避免过早抽象                                                  │
│                                                                  │
│ Phase 0 的 Worker 模板不需要抽象成 Adapter 基类。                  │
│ Phase 2 的 P2P 协议不需要通用 Message Router。                     │
│                                                                  │
│ 判断标准：同样的代码出现了 3 次再抽象。                            │
│ 在此之前，复制粘贴比错误抽象成本低得多。                            │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ 🟡  CRITIQUE.md 是唯一的安全债务清单                              │
│                                                                  │
│ 修一个 → ~~划线~~ + 备注 commit hash。                            │
│ 新增一个 → 追加到列表底部 + 注明发现日期。                        │
│ 不要另开 issue tracker 跟踪安全问题（分散、难维护）。             │
└──────────────────────────────────────────────────────────────────┘
```

---

## ╔══════════════════════════════════════════════════════════════╗
## ║  IMMEDIATE NEXT ACTIONS  (do these NOW)                   ║
## ╚══════════════════════════════════════════════════════════════╝

```
┌─────┬───────────────────────────────────────────────────────────────┐
│     │                                                               │
│  1  │  Fix P0-1: Remove hardcoded X-Oasis-Secret                    │
│     │  Impact: Highest  |  Risk: Low  |  Scope: Worker templates    │
│     │                                                               │
├─────┼───────────────────────────────────────────────────────────────┤
│     │                                                               │
│  2  │  Add T-1: Encryption module unit tests                        │
│     │  Impact: Foundation  |  Risk: None  |  Scope: 1 file          │
│     │                                                               │
├─────┼───────────────────────────────────────────────────────────────┤
│     │                                                               │
│  3  │  Scaffold monorepo skeleton                                   │
│     │  Impact: Unblocks Phase 1  |  Risk: Low  |  Scope: Dir+config │
│     │  (Don't migrate code yet — just create packages/ and verify   │
│     │   npm workspaces resolve correctly)                           │
│     │                                                               │
└─────┴───────────────────────────────────────────────────────────────┘
```

---

```
                              ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
                              █                         █
                              █   END OF MASTER PLAN   █
                              █                         █
                              ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
                              
    This document evolves with the project.
    Update checklist items in-place as each is completed.
    Record actual time spent per Phase for calibration.
    Last updated: 2026-06-04  |  Commit: see git log
```
