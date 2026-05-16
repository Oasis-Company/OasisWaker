# 🤝 如何为 OasisWaker 做出贡献

感谢您对 OasisWaker 项目的兴趣！我们欢迎所有形式的贡献，无论是报告问题、提交功能请求，还是直接提交代码。

## 📋 目录

- [行为准则](#行为准则)
- [入门指南](#入门指南)
- [开发环境设置](#开发环境设置)
- [工作流程](#工作流程)
- [提交规范](#提交规范)
- [测试规范](#测试规范)
- [代码审查](#代码审查)
- [问题反馈](#问题反馈)
- [功能请求](#功能请求)
- [许可证](#许可证)

---

## 行为准则

请阅读我们的 [行为准则](CODE_OF_CONDUCT.md) 并在任何与项目相关的互动中遵守它。

## 入门指南

在开始贡献之前，请确保您：

1. ✅ 阅读了 [README.md](README.md) 了解项目概述
2. ✅ 阅读了 [安全架构文档](.trae/specs/oasiswaker-security-architecture/spec.md)
3. ✅ 熟悉项目的核心概念和架构
4. ✅ 拥有一个 GitHub 账户

## 开发环境设置

### 前置要求

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 或 **yarn** >= 1.22.0 或 **pnpm** >= 8.0.0
- **Git** >= 2.30.0

### 克隆仓库

```bash
git clone https://github.com/oasisbio/oasiswaker.git
cd oasiswaker
```

### 安装依赖

```bash
npm install
```

### 构建项目

```bash
npm run build
```

### 运行测试

```bash
npm test
```

### 监听模式（开发）

```bash
npm run dev
```

## 工作流程

### 1. Fork 仓库

点击 GitHub 页面右上角的 "Fork" 按钮来创建您自己的仓库副本。

### 2. 克隆您的 Fork

```bash
git clone https://github.com/YOUR_USERNAME/oasiswaker.git
cd oasiswaker
```

### 3. 添加上游仓库

```bash
git remote add upstream https://github.com/oasisbio/oasiswaker.git
```

### 4. 创建分支

始终为每个功能或修复创建一个新分支：

```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/your-bug-fix
```

### 5. 进行更改

在您的分支上进行开发工作。

### 6. 保持同步

在开始工作前和定期地，将您的分支与上游仓库同步：

```bash
git fetch upstream
git rebase upstream/main
```

### 7. 提交更改

```bash
git add .
git commit -m "Your descriptive commit message"
```

### 8. 推送更改

```bash
git push origin feature/your-feature-name
```

### 9. 创建 Pull Request

在 GitHub 上打开您的分支并创建 Pull Request 到 `main` 分支。

## 提交规范

我们遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### 类型 (type)

- `feat`: 新功能
- `fix`: 错误修复
- `docs`: 文档更改
- `style`: 代码格式（不影响功能）
- `refactor`: 代码重构
- `perf`: 性能改进
- `test`: 测试相关
- `build`: 构建系统或依赖
- `ci`: CI 配置
- `chore`: 其他更改

### 范围 (scope)

表示更改的模块，例如：
- `auth`
- `config`
- `crypto`
- `cli`
- `deploy`

### 示例

```
feat(auth): add PKCE support for OAuth flow
fix(cli): handle missing config file gracefully
docs(readme): add architecture diagram
refactor(crypto): improve key generation algorithm
```

## 测试规范

### 运行测试

```bash
# 运行所有测试
npm test

# 监听模式（开发时）
npm run test:watch

# 带覆盖率
npm test -- --coverage
```

### 编写测试

- 所有新功能必须包含测试
- 所有 bug 修复必须包含回归测试
- 使用 [Vitest](https://vitest.dev/) 作为测试框架
- 测试文件命名：`*.test.ts`
- 遵循 AAA 模式（Arrange, Act, Assert）

### 示例

```typescript
import { describe, it, expect } from 'vitest';
import { yourFunction } from '../your-module';

describe('yourFunction', () => {
  it('should do something specific', () => {
    // Arrange
    const input = 'test value';

    // Act
    const result = yourFunction(input);

    // Assert
    expect(result).toBe('expected output');
  });
});
```

## 代码审查

### 作为贡献者

- 确保所有测试通过
- 确保代码符合项目的 linting 规则
- 清晰地描述您的 Pull Request
- 响应审查反馈

### 作为审查者

- 尊重和礼貌
- 提供建设性的反馈
- 指出问题而不是指责
- 帮助贡献者改进代码

## 问题反馈

### 报告 Bug

在报告 bug 时，请包含：

1. **清晰的标题和描述**
2. **复现步骤**（1. 2. 3. ...）
3. **预期行为 vs 实际行为**
4. **环境信息**：
   - Node.js 版本
   - 操作系统
   - npm/yarn/pnpm 版本
5. **相关日志或错误信息**
6. **可能的解决方案**

使用 [Bug 报告模板](https://github.com/oasisbio/oasiswaker/issues/new?template=bug_report.md)。

## 功能请求

### 提出新功能

在提出功能请求时，请包含：

1. **清晰的功能描述**
2. **使用场景**（谁会用？为什么？）
3. **预期行为**
4. **可能的实现方案**（可选）
5. **替代方案**（如果有）

使用 [功能请求模板](https://github.com/oasisbio/oasiswaker/issues/new?template=feature_request.md)。

### 实现功能

1. 在 GitHub Issues 中查看是否有相关讨论
2. 在开始实现前创建一个 Issue 或评论表示您将处理它
3. 遵循本贡献指南中的所有规范
4. 在 PR 中包含相关的测试和文档

## 许可证

通过为 OasisWaker 做出贡献，您同意将您的代码按照 [MIT 许可证](LICENSE) 的条款进行许可。

---

<p align="center">
  <strong>感谢您对 OasisWaker 的支持！</strong>
  <br>
  <em>Your cloud, the network. Contribute. Connect. Decentralize.</em>
</p>
