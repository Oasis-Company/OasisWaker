# 🌴 OasisWaker

### *Your cloud, the network. Contribute. Connect. Decentralize.*

[![npm version](https://img.shields.io/npm/v/@oasisbio/oasiswaker.svg)](https://www.npmjs.com/package/@oasisbio/oasiswaker)
[![Node.js version](https://img.shields.io/node/v/@oasisbio/oasiswaker.svg)](https://nodejs.org/)
[![License](https://img.shields.io/github/license/oasisbio/oasiswaker.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![Build Status](https://img.shields.io/github/actions/workflow/status/oasisbio/oasiswaker/ci.yml.svg)](https://github.com/oasisbio/oasiswaker/actions)
[![Security: AES-256-GCM](https://img.shields.io/badge/Security-AES--256--GCM-green.svg)](https://github.com/oasisbio/oasiswaker#security)
[![Join OasisBio Discord](https://img.shields.io/badge/Discord-Join-7289da.svg?logo=discord)](https://discord.gg/oasisbio)

---

```
    ██████╗██╗   ██╗██████╗ ███████╗██████╗ ████████╗     
   ██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔══██╗╚══██╔══╝     
   ██║      ╚████╔╝ ██████╔╝█████╗  ██████╔╝   ██║        
   ██║       ╚██╔╝  ██╔═══╝ ██╔══╝  ██╔══██╗   ██║        
   ╚██████╗   ██║   ██║     ███████╗██║  ██║   ██║        
    ╚═════╝   ╚═╝   ╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝        
                                                              
   ██████╗ ██╗███████╗ ██████╗ ██████╗ ███████╗            
   ██╔══██╗██║██╔════╝██╔════╝██╔═══██╗██╔════╝            
   ██║  ██║██║███████╗██║     ██║   ██║███████╗            
   ██║  ██║██║╚════██║██║     ██║   ██║╚════██║            
   ██████╔╝██║███████║╚██████╗╚██████╔╝███████║            
   ╚═════╝ ╚═╝╚══════╝ ╚═════╝ ╚═════╝ ╚══════╝            
                                                              
   ███████╗██╗  ██╗ █████╗ ██████╗  ██████╗ ██████╗        
   ██╔════╝██║  ██║██╔══██╗██╔══██╗██╔═══██╗██╔══██╗       
   ███████╗███████║███████║██║  ██║██║   ██║██████╔╝       
   ╚════██║██╔══██║██╔══██║██║  ██║██║   ██║██╔═══╝        
   ███████║██║  ██║██║  ██║██████╔╝╚██████╔╝██║            
   ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝  ╚═════╝ ╚═╝            
```

## 🚀 核心价值

**OasisWaker** 是一个开源 CLI 工具，让您轻松地将 Cloudflare、Vercel 和 Supabase 的云资源贡献给 OasisBio 去中心化网络。

> **"你的云，就是网络。贡献资源、连接、去中心化。"**

### ✨ 为什么选择 OasisWaker？

- 🔒 **安全优先** - AES-256-GCM 加密保护您的凭证
- 🌐 **多平台支持** - 一键连接 Cloudflare、Vercel、Supabase
- ⚡ **简单易用** - 友好的命令行界面，快速上手
- 🔄 **自动管理** - 自动处理 OAuth 认证和令牌刷新
- 📊 **实时监控** - 查看连接状态和部署进度
- 🎯 **零成本** - 完全免费，为去中心化网络贡献力量

## 🎯 支持的平台

<p align="center">
  <img src="https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=cloudflare&logoColor=white" alt="Cloudflare"/>
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel"/>
  <img="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase"/>
</p>

## 📦 安装

### 使用 npm（推荐）

```bash
npm install -g @oasisbio/oasiswaker
```

### 使用 yarn

```bash
yarn global add @oasisbio/oasiswaker
```

### 使用 pnpm

```bash
pnpm add -g @oasisbio/oasiswaker
```

### 前置要求

- **Node.js** >= 18.0.0
- **npm** / **yarn** / **pnpm** (任选其一)
- 支持的操作系统：macOS、Linux、Windows

## 🚀 快速开始

### 1. 初始化配置

```bash
oasiswaker init
```

这将创建本地配置文件，引导您完成初始设置。

### 2. 连接云平台

```bash
# 连接所有平台
oasiswaker login

# 连接特定平台
oasiswaker login cloudflare
oasiswaker login vercel
oasiswaker login supabase
```

### 3. 部署适配器

```bash
# 部署到所有已连接的平台
oasiswaker deploy

# 部署到特定平台
oasiswaker deploy cloudflare
oasiswaker deploy vercel
oasiswaker deploy supabase
```

### 4. 查看状态

```bash
oasiswaker status
```

### 5. 撤销访问

```bash
# 撤销所有平台的访问权限
oasiswaker revoke

# 撤销特定平台
oasiswaker revoke cloudflare
```

## 🔧 高级配置

### 环境变量配置

创建 `.env` 文件来自定义配置：

```bash
# OAuth 客户端配置
CLOUDFLARE_CLIENT_ID=your_cloudflare_client_id
VERCELL_CLIENT_ID=your_vercel_client_id
SUPABASE_CLIENT_ID=your_supabase_client_id

# 重定向 URI
CLOUDFLARE_REDIRECT_URI=http://localhost:3000/callback
VERCELL_REDIRECT_URI=http://localhost:3000/callback
SUPABASE_REDIRECT_URI=http://localhost:3000/callback

# OasisBio API 端点
OASIS_API_ENDPOINT=https://api.oasisbio.com
```

查看完整配置示例：[`.env.example`](.env.example)

### verbose 模式

添加 `-v` 或 `--verbose` 标志以获取详细日志输出：

```bash
oasiswaker -v login cloudflare
oasiswaker --verbose deploy
```

## 🛡️ 安全特性

| 安全特性 | 描述 |
|---------|------|
| **AES-256-GCM 加密** | 使用行业标准的 AES-256-GCM 算法加密存储凭证 |
| **PKCE OAuth 2.0** | 支持 Proof Key for Code Exchange，增强认证安全 |
| **主密钥管理** | 自动生成和管理主密钥，存储在用户目录 |
| **最小权限原则** | 仅请求必要的 OAuth 权限范围 |
| **凭证隔离** | 凭证文件与主密钥分离存储 |

详细安全说明：[安全架构文档](.trae/specs/oasiswaker-security-architecture/spec.md)

## 📚 命令参考

### 全局选项

```
-v, --verbose    启用详细日志输出
--version        显示版本号
--help           显示帮助信息
```

### 可用命令

| 命令 | 描述 |
|------|------|
| `init` | 初始化 OasisWaker 配置 |
| `login [platform]` | 连接云平台（cloudflare/vercel/supabase） |
| `deploy [platform]` | 部署适配器到指定平台 |
| `status` | 显示已连接平台和部署状态 |
| `revoke [platform]` | 撤销平台访问权限 |

## 🔍 工作原理

```
┌─────────────────────────────────────────────────────────────┐
│                         用户操作                            │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐     │
│  │  init   │ → │  login  │ → │  deploy │ → │ status  │     │
│  └────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘     │
└───────┼─────────────┼─────────────┼─────────────┼───────────┘
        │             │             │             │
        ▼             ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────┐
│                      OasisWaker CLI                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Config     │  │  OAuth     │  │  Deployer   │         │
│  │  Manager    │  │  Manager   │  │  Manager    │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                │                │                  │
│         │                │                ▼                  │
│         │                │         ┌─────────────┐         │
│         │                │         │  Adapter    │         │
│         │                │         │  Templates  │         │
│         │                │         └──────┬──────┘         │
└─────────┼────────────────┼────────────────┼────────────────┘
          │                │                │
          ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────┐
│                      云平台 API                              │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐                │
│  │Cloudflare│   │  Vercel  │   │ Supabase │                │
│  └──────────┘   └──────────┘   └──────────┘                │
└─────────────────────────────────────────────────────────────┘
          │                │                │
          └────────────────┼────────────────┘
                           ▼
              ┌──────────────────────────┐
              │   OasisBio 网络          │
              │   (去中心化基础设施)      │
              └──────────────────────────┘
```

## 🤝 贡献

我们欢迎所有形式的贡献！请查看我们的贡献指南：

- [贡献者指南](CONTRIBUTING.md)
- [行为准则](CODE_OF_CONDUCT.md)

### 开发设置

```bash
# 克隆仓库
git clone https://github.com/oasisbio/oasiswaker.git
cd oasiswaker

# 安装依赖
npm install

# 构建项目
npm run build

# 运行测试
npm test

# 开发模式（监听文件变化）
npm run dev
```

## 📄 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。

## 🗣️ 社区与支持

- 💬 [Discord 社区](https://discord.gg/oasisbio) - 加入讨论，获取帮助
- 🐛 [GitHub Issues](https://github.com/oasisbio/oasiswaker/issues) - 报告问题和建议
- 📖 [Wiki 文档](https://github.com/oasisbio/oasiswaker/wiki) - 详细文档和教程
- 🔄 [Changelog](CHANGELOG.md) - 版本更新历史

## 🙏 致谢

感谢所有为 OasisWaker 做出贡献的开发者！

特别感谢以下开源项目：
- [Commander.js](https://github.com/tj/commander.js) - 命令行界面
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js) - 交互式命令行
- [Chalk](https://github.com/chalk/chalk) - 命令行着色
- [Vitest](https://vitest.dev/) - 测试框架

---

<p align="center">
  <strong>Built with ❤️ by the OasisBio Team</strong>
  <br>
  <em>Your cloud, the network. Contribute. Connect. Decentralize.</em>
</p>

[![Star us on GitHub](https://img.shields.io/github/stars/oasisbio/oasiswaker?style=social)](https://github.com/oasisbio/oasiswaker)
[![Follow us on Twitter](https://img.shields.io/twitter/follow/oasisbio?style=social)](https://twitter.com/oasisbio)
