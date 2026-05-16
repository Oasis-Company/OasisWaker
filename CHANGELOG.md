# 📝 更新日志

OasisWaker 遵循 [语义化版本控制 (Semantic Versioning)](https://semver.org/lang/zh-CN/)。

## 目录

- [v1.0.0 (2024-当前版本)](#v100-2024)
  - [新增](#新增)
  - [改进](#改进)
  - [安全](#安全)
  - [文档](#文档)

---

## [v1.0.0](https://github.com/oasisbio/oasiswaker/releases/tag/v1.0.0) (2024)

### 首次发布

这是 OasisWaker 的首个正式版本，包含核心功能和基础设施。

#### 新增

- ✨ **CLI 核心功能**
  - `oasiswaker init` - 初始化配置
  - `oasiswaker login` - 连接云平台（Cloudflare/Vercel/Supabase）
  - `oasiswaker deploy` - 部署适配器
  - `oasiswaker status` - 查看连接和部署状态
  - `oasiswaker revoke` - 撤销平台访问权限

- ✨ **多平台支持**
  - Cloudflare Workers 部署
  - Vercel Edge Functions 部署
  - Supabase Storage 配置

- ✨ **OAuth 2.0 认证**
  - PKCE (Proof Key for Code Exchange) 支持
  - 自动令牌刷新
  - 多平台统一认证接口

#### 改进

- 🔄 **项目结构优化**
  - 现代化 TypeScript 项目结构
  - 模块化架构设计
  - 清晰的目录组织

- 🎨 **用户体验改进**
  - 友好的命令行输出
  - 进度指示器（spinner）
  - 彩色日志输出
  - 详细的帮助信息

- 📊 **日志系统**
  - 多级别日志支持（DEBUG/INFO/SUCCESS/WARN/ERROR）
  - 结构化日志格式
  - 日志文件输出
  - 详细程度控制（verbose 模式）

- 🛡️ **错误处理**
  - 统一错误类型系统
  - 全局异常捕获
  - 友好的错误提示和建议
  - 不泄露敏感信息

#### 安全

- 🔒 **凭证加密存储**
  - AES-256-GCM 加密算法
  - 主密钥安全管理
  - 自动凭证迁移（明文→加密）
  - 安全的文件权限（0o600）

- 🔐 **环境变量支持**
  - dotenv 配置管理
  - OAuth 客户端 ID 安全配置
  - 敏感信息与环境变量分离

- ✅ **安全最佳实践**
  - 最小权限原则
  - 凭证隔离存储
  - 安全的密钥生成

#### 文档

- 📖 **完整文档体系**
  - README.md - 项目介绍和使用指南
  - CONTRIBUTING.md - 贡献指南
  - CODE_OF_CONDUCT.md - 行为准则
  - 安全架构文档 - 详细安全说明

- 🎯 **使用文档**
  - 快速开始指南
  - 详细命令参考
  - 配置示例
  - 工作原理图解

#### 技术栈

- **运行时**: Node.js >= 18.0.0
- **语言**: TypeScript 5.6
- **CLI框架**: Commander.js
- **交互界面**: Inquirer.js
- **HTTP客户端**: Axios
- **数据验证**: Zod
- **测试框架**: Vitest
- **代码风格**: ESLint

---

## 发布说明

### 如何查看版本

```bash
oasiswaker --version
```

### 升级指南

```bash
# npm
npm update -g @oasisbio/oasiswaker

# yarn
yarn global upgrade @oasisbio/oasiswaker

# pnpm
pnpm update -g @oasisbio/oasiswaker
```

### 版本语义

- **[MAJOR]** - 不兼容的 API 变更
- **[MINOR]** - 向后兼容的功能新增
- **[PATCH]** - 向后兼容的问题修复

---

## 即将推出

计划中的功能：

- 🔮 **v1.1.0**
  - [ ] 多账户支持
  - [ ] 部署历史记录
  - [ ] 性能监控仪表板

- 🚀 **v2.0.0**
  - [ ] Web UI 界面
  - [ ] 实时状态推送
  - [ ] 团队协作功能
  - [ ] 更多云平台支持

---

<p align="center">
  <strong>📌 所有变更都会记录在此文件中</strong>
  <br>
  <em>Your cloud, the network. Contribute. Connect. Decentralize.</em>
</p>

---

*最后更新: 2024*
