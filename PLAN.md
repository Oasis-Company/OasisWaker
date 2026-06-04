# OasisWaker 总体计划 & 检查清单

> 从 v1.0 CLI 工具 → v2.0 去中心化基础设施网格的完整路线图
>
> 生成日期：2026-06-04 | 基于当前代码库深度审查

---

## 0. 项目当前状态速览

| 维度 | 现状 |
|---|---|
| 代码行数 | ~1,500 行 TypeScript（src/ 下 30 个文件） |
| 架构模式 | 扁平单包，无 monorepo |
| 拓扑结构 | **星型**（中心 oasisbio.com + 边缘 Worker 节点） |
| 已实现 | CLI 6 命令、PKCE OAuth、3 平台部署适配器、统一块存储 API |
| 未实现 | P2P/DHT/节点发现、消息路由、数据同步、经济模型、monorepo |
| 测试 | 4 个测试文件，覆盖率极低 |
| 生产就绪度 | ❌ 不可生产部署（CRITIQUE.md 列出 10+ 严重问题） |
| CI/CD | GitHub Actions 三 OS 矩阵（lint + test + build），npm 发布脚本就绪 |

---

## 1. 总体路线图

```
Phase 0: 安全加固 + 测试补全     [2 周]   ← 当前应该从这里开始
Phase 1: Monorepo 拆分           [1 周]
Phase 2: P2P 网络层              [3-4 周]  ← 最难的阶段
Phase 3: 数据同步 & 共识         [2-3 周]
Phase 4: 经济激励层              [2 周]
Phase 5: 生产化 & 审计            [2 周]
──────────────────────────────────────────
总计预估：12-14 周（约 3-3.5 个月）
```

---

## 2. Phase 0：安全加固 + 测试补全（优先级：🔴 最高）

> **目标**：把现有 v1.0 代码修到"敢给人用"的程度，为后续重构打基础。
> **原则**：不动架构，只修安全漏洞和补测试。

### 2.1 安全检查清单

- [ ] **P0-1：移除硬编码 `X-Oasis-Secret`**
  - 位置：`src/deploy/cloudflare.ts` Worker 模板、`src/deploy/vercel.ts`、`src/deploy/supabase.ts`
  - 当前问题：用 `oasiswaker-default-secret` 做验证，等于没验证
  - 方案：部署时生成随机 secret，通过环境变量注入 Worker；CLI 端从加密存储读取

- [ ] **P0-2：主密钥存储加固**
  - 位置：`~/.oasiswaker/.master-key`
  - 当前问题：明文存储，仅靠 0o600 文件权限
  - 方案（按优先级）：① 用系统密钥链（Windows Credential Manager / macOS Keychain / Linux Secret Service API）② 至少用 PBKDF2 对主密钥做一层密码派生，让用户设一个 unlock 密码

- [ ] **P0-3：Worker 端速率限制**
  - 位置：所有 Worker/Edge Function 模板
  - 当前问题：无任何速率限制，任何人拿到 URL 可以无限写入
  - 方案：基于 IP + token 的滑动窗口限流（每个 Worker 独立维护）

- [ ] **P0-4：Worker 端写入配额**
  - 当前问题：无容量上限，用户可能被刷爆免费额度
  - 方案：每个 Worker 维护本地计数器，超过配额返回 429；CLI `deploy` 时让用户设置上限（默认 1GB/天）

- [ ] **P0-5：错误处理改进**
  - 位置：`src/cli/commands/*.ts`
  - 当前问题：任何错误直接 `process.exit(1)`，无重试、无回滚
  - 方案：引入指数退避重试（最多 3 次），部署失败时自动 `revoke` 清理残留资源

### 2.2 测试补全清单

- [ ] **T-1：加密模块单元测试**
  - `src/crypto/encryption.ts` — 加解密往返测试、边界条件、错误输入
  
- [ ] **T-2：OAuth PKCE 流程测试**
  - `src/auth/base.ts` — Mock 本地回调服务器，测试 code_verifier/code_challenge 生成、token 交换

- [ ] **T-3：配置管理测试**
  - `src/config/*.ts` — 配置读写、并发安全、损坏文件恢复

- [ ] **T-4：CLI 命令集成测试**
  - 每个命令的 happy path + 主要错误路径

- [ ] **T-5：Worker 模板测试**
  - `src/deploy/cloudflare.ts` 生成的 Worker 代码 — 块存储 API 的正确性测试
  - 用 `wrangler dev` 或 `miniflare` 做本地集成测试

### 2.3 避坑点（Phase 0）

| 坑 | 说明 |
|---|---|
| ⚠️ **别碰架构** | Phase 0 只修安全问题，不做任何架构改动。架构改动留到 Phase 1-2 |
| ⚠️ **Worker 代码是字符串模板** | `src/deploy/cloudflare.ts` 用模板字符串生成 Worker 代码，修改时要小心引号转义 |
| ⚠️ **OAuth 回调端口冲突** | 当前固定端口 3000，可能与用户本地开发服务器冲突。安全加固时顺便改成随机端口 |
| ⚠️ **Supabase 适配器半成品** | `src/deploy/supabase.ts` 有硬编码占位符 `<project-ref>`，Phase 0 先标记为 "experimental" 而非修它 |
| ⚠️ **不要引入新依赖** | Phase 0 尽量用 Node.js 内置模块（crypto, http），避免膨胀 |

---

## 3. Phase 1：Monorepo 拆分（优先级：🟡 中）

> **目标**：把扁平单包拆成 `packages/core` + `packages/cli` + 各平台适配器独立包。
> **原则**：先拆结构，接口保持兼容，不引入破坏性变更。

### 3.1 目标目录结构

```
packages/
├── core/                   # @oasiswaker/core — 共享类型、加密、协议定义
│   ├── src/
│   │   ├── types.ts        # Block, NodeInfo, HealthReport 等类型
│   │   ├── crypto.ts       # 从 src/crypto/ 迁移
│   │   ├── protocol.ts     # API 协议常量/版本定义（新增）
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
├── cli/                    # @oasiswaker/cli — CLI 入口
│   ├── src/
│   │   ├── index.ts        # 从 src/cli/index.ts 迁移
│   │   ├── commands/       # 从 src/cli/commands/ 迁移
│   │   └── auth/           # 从 src/auth/ 迁移
│   ├── package.json
│   └── tsconfig.json
│
├── adapter-cloudflare/     # @oasiswaker/adapter-cloudflare
├── adapter-vercel/         # @oasiswaker/adapter-vercel
├── adapter-supabase/       # @oasiswaker/adapter-supabase (experimental)
│
└── oasiswaker/             # 顶层包，聚合 CLI + 所有适配器（npm install @oasisbio/oasiswaker）
    └── package.json        # dependencies → 所有子包
```

### 3.2 检查清单

- [ ] 创建 `packages/` 根目录，配置 `workspaces`（npm/yarn/pnpm）
- [ ] 从现有代码提取 `@oasiswaker/core`（类型 + 加密 + 协议常量）
- [ ] 将 CLI 迁移到 `@oasiswaker/cli`，依赖 `@oasiswaker/core`
- [ ] 拆分适配器到独立包，各自依赖 `@oasiswaker/core`
- [ ] 每个包有独立的 `tsconfig.json` + `vitest.config.ts`
- [ ] 顶层 `oasiswaker` 聚合包保持 `npx oasiswaker` 入口不变
- [ ] 更新 CI 矩阵覆盖所有子包
- [ ] 更新 `README.md` 反映新的包结构

### 3.3 避坑点（Phase 1）

| 坑 | 说明 |
|---|---|
| ⚠️ **别用 yarn link** | Windows 上符号链接权限问题很多。用 npm workspaces 或 pnpm workspaces |
| ⚠️ **路径引用全部改为包名引用** | `../../crypto/encryption` → `@oasiswaker/core` |
| ⚠️ **先抽类型，再抽逻辑** | 类型定义是最无争议的提取目标，先做这个验证工具链 |
| ⚠️ **保持顶层 CLI 入口不变** | `npx oasiswaker` 必须继续能用，这是用户唯一入口 |

---

## 4. Phase 2：P2P 网络层（优先级：🟡 中，但最复杂）

> **目标**：实现节点发现（DHT）和节点间直接通信。
> **这是整个项目最核心也最难的阶段。**

### 4.1 技术选型

| 决策点 | 推荐方案 | 理由 |
|---|---|---|
| DHT 协议 | **Kademlia (libp2p-kad-dht)** | 成熟、有 JS 实现、被 IPFS 验证过 |
| 传输层 | **libp2p** (TCP + WebRTC) | 同时支持服务器节点和浏览器节点 |
| 节点身份 | 复用现有 UUID 节点 ID，包装为 PeerId |
| NAT 穿透 | libp2p 内置 AutoNAT + UPnP | 必需，因为用户节点多在家宽/NAT 后 |
| 引导节点 | 由 oasisbio.com 提供 bootstrap list | 渐进式去中心化，不一次性砍掉中心服务器 |

### 4.2 渐进式去中心化策略

```
阶段 A（当前）: 全部通过中心服务器
    节点 ←→ oasisbio.com ←→ 节点

阶段 B（Phase 2 完成后）: 中心服务器仅做引导 + 备份
    节点 ←→ 节点（DHT 直连）
    节点 → oasisbio.com（仅 bootstrap + fallback）

阶段 C（未来）: 完全去中心化
    节点 ←→ 节点（纯 DHT）
    oasisbio.com 仅提供可选的可观测性服务
```

### 4.3 检查清单

- [ ] 在 `@oasiswaker/core` 中引入 `libp2p` 依赖
- [ ] 实现 `NodeIdentity` — 把现有 UUID 节点 ID 包装为 libp2p PeerId
- [ ] 实现 DHT 节点发现模块（`src/p2p/discovery.ts`）
- [ ] 实现节点间直连传输（`src/p2p/transport.ts`）
- [ ] 实现简单的请求-响应协议（用于块存储操作）
- [ ] CLI 新增 `oasiswaker peer list` 命令（查看已连接节点）
- [ ] Worker 模板更新：内嵌 libp2p 轻量节点（关键挑战！）
- [ ] 中心服务器 `oasisbio.com` 改造为 bootstrap 节点
- [ ] 集成测试：3+ 节点组成的迷你网络

### 4.4 避坑点（Phase 2）

| 坑 | 说明 |
|---|---|
| 🔴 **Worker 环境不能跑完整 libp2p** | Cloudflare Worker / Vercel Edge Function 不支持 TCP/UDP socket！这是最大的技术障碍。需要调研：① libp2p 的 WebTransport 是否可行 ② 是否用 WebRTC 纯浏览器端方案 ③ 是否只让 CLI 守护进程做 P2P，Worker 仍然走 HTTP |
| 🔴 **NAT 穿透在 Worker 环境下不可用** | Worker 没有 UPnP 能力，这意味着 Worker 节点可能只能做客户端角色 |
| ⚠️ **DHT 冷启动问题** | 节点少于 ~20 个时 DHT 查找成功率很低，需要 bootstrap 节点撑着 |
| ⚠️ **libp2p JS 的包体积** | libp2p 完整引入可能 500KB+，需要按需引入（只引入 kad-dht + tcp + webrtc） |
| ⚠️ **不要同时改 CLi 和 Worker 模板** | 先让 CLI 守护进程跑通 P2P，验证 DHT 可行后，再考虑 Worker 侧 |

---

## 5. Phase 3：数据同步 & 共识（优先级：🟢 低，依赖 Phase 2）

### 5.1 设计原则

- **CRDT 优先，共识其次**：块存储操作（PUT/DELETE）本质上是集合操作，用 CRDT 可以避免复杂共识
- **最终一致性**：接受短暂的不一致，不追求强一致性
- **按需同步**：节点只在被请求时才拉取数据，不做全量广播

### 5.2 检查清单

- [ ] 设计块存储 CRDT 数据结构（基于 LWW-Register + Observed-Remove Set）
- [ ] 实现数据同步协议（gossip-based，非全量广播）
- [ ] 实现冲突解决策略（LWW，以时间戳为准）
- [ ] 数据完整性验证（Merkle 树或简单哈希链）
- [ ] 同步性能测试（100 节点、1000 块场景）

### 5.3 避坑点

| 坑 | 说明 |
|---|---|
| ⚠️ **不要自己发明 CRDT** | 用 `@organicdesign/crdts` 或 `yjs` 的底层数据结构，不要从头写 |
| ⚠️ **gossip 频率控制** | 节点数 × gossip 频率 = 指数级消息量。需要反压机制 |
| ⚠️ **大文件分块** | 当前块存储设计假设小块数据。大文件需要分块 + Merkle 树 |

---

## 6. Phase 4：经济激励层（优先级：🟢 低）

### 6.1 核心模型

- 贡献者提供存储 + 带宽 → 获得积分
- 消费者使用存储 → 消耗积分
- 积分不可交易（避免证券法问题），仅用于配额分配

### 6.2 检查清单

- [ ] 设计积分计算模型（存储量 × 时间 + 带宽消耗）
- [ ] Worker 端埋点（实际存储用量、请求次数）
- [ ] 中心服务器积分账本（Phase 2 后迁移到链上或分布式账本）
- [ ] CLI `oasiswaker credits` 查看积分余额

### 6.3 避坑点

| 坑 | 说明 |
|---|---|
| 🔴 **积分 ≠ 代币** | 避免任何 token/区块链术语，定位为"配额积分"，降低监管风险 |
| ⚠️ **Sybil 攻击** | 一个人注册 1000 个节点骗积分。需要 PoW 或社交验证 |
| ⚠️ **先不做链** | 先用中心化账本验证经济模型是否合理，验证通过后再考虑去中心化账本 |

---

## 7. Phase 5：生产化 & 审计（优先级：🟡 中）

### 7.1 检查清单

- [ ] 安全审计（第三方，至少覆盖加密、认证、P2P 协议）
- [ ] 性能测试（延迟 P50/P95/P99、吞吐量）
- [ ] 混沌工程测试（随机杀节点、网络分区、时钟偏移）
- [ ] 文档完善（API 文档、部署指南、安全最佳实践）
- [ ] 隐私政策 + 使用条款
- [ ] 监控 & 告警（中心服务器的可观测性）
- [ ] `oasiswaker update` 命令（CLI 自更新）

---

## 8. 跨阶段通用避坑点

| 编号 | 坑 | 说明 |
|---|---|---|
| G-1 | **文档和代码同时改** | 每次代码变更立即更新对应文档，不要让文档再落后于代码 |
| G-2 | **Windows 优先测试** | 项目主要用户在 Windows 上开发，所有命令先在 PowerShell 跑通 |
| G-3 | **Node.js 版本锁定** | 当前 `engines.node >= 18`，不要引入需要 Node 20+ 的特性，除非有意升级 |
| G-4 | **Worker 免费额度边界** | Cloudflare Workers 免费：10 万请求/天、10ms CPU 时间/请求。所有设计必须在此约束内 |
| G-5 | **一个 PR 只做一个 Phase 的事** | 不要混，否则 review 地狱 |
| G-6 | **CRITIQUE.md 更新** | 每修一个 CRITIQUE.md 里的问题，就在上面划线标记已修复 |
| G-7 | **别过早优化** | Phase 0 修安全不优化性能，Phase 2 搭 P2P 不优化吞吐 |

---

## 9. 立即可做的前 3 件事

按优先级排序：

1. **修 P0-1（硬编码密钥）** — 影响面最大，改 Worker 模板即可，风险低
2. **补 T-1（加密模块测试）** — 后续所有安全相关改动的基础
3. **建立 Monorepo 骨架** — 不迁移代码，先建 `packages/` 目录结构 + workspace 配置，验证工具链

---

*此文档随项目演进而更新。每完成一个 Phase，更新对应检查项状态并记录实际耗时。*
