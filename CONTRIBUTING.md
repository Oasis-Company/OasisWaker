# How to Contribute to OasisWaker

Thank you for your interest in the OasisWaker project! We welcome all forms of contribution, whether it's reporting issues, submitting feature requests, or directly contributing code.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Setting Up the Development Environment](#setting-up-the-development-environment)
- [Workflow](#workflow)
- [Commit Guidelines](#commit-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Code Review](#code-review)
- [Reporting Issues](#reporting-issues)
- [Feature Requests](#feature-requests)
- [License](#license)

---

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) and abide by it in all project-related interactions.

## Getting Started

Before starting to contribute, please make sure you:

1. ✅ Have read the [README.md](README.md) to understand the project overview
2. ✅ Have read the [security architecture docs](.trae/specs/oasiswaker-security-architecture/spec.md)
3. ✅ Are familiar with the project's core concepts and architecture
4. ✅ Have a GitHub account

## Setting Up the Development Environment

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 or **yarn** >= 1.22.0 or **pnpm** >= 8.0.0
- **Git** >= 2.30.0

### Clone the Repository

```bash
git clone https://github.com/oasisbio/oasiswaker.git
cd oasiswaker
```

### Install Dependencies

```bash
npm install
```

### Build the Project

```bash
npm run build
```

### Run Tests

```bash
npm test
```

### Watch Mode (Development)

```bash
npm run dev
```

## Workflow

### 1. Fork the Repository

Click the "Fork" button in the top-right corner of the GitHub page to create your own copy of the repository.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/oasiswaker.git
cd oasiswaker
```

### 3. Add the Upstream Repository

```bash
git remote add upstream https://github.com/oasisbio/oasiswaker.git
```

### 4. Create a Branch

Always create a new branch for each feature or fix:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 5. Make Your Changes

Work on your changes in the branch.

### 6. Keep in Sync

Before starting work and regularly during your work, keep your branch in sync with the upstream repository:

```bash
git fetch upstream
git rebase upstream/main
```

### 7. Commit Your Changes

```bash
git add .
git commit -m "Your descriptive commit message"
```

### 8. Push Your Changes

```bash
git push origin feature/your-feature-name
```

### 9. Create a Pull Request

Open your branch on GitHub and create a pull request to the `main` branch.

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Type

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting (does not affect functionality)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Testing-related
- `build`: Build system or dependencies
- `ci`: CI configuration
- `chore`: Other changes

### Scope

Indicates the module being changed, for example:
- `auth`
- `config`
- `crypto`
- `cli`
- `deploy`

### Examples

```
feat(auth): add PKCE support for OAuth flow
fix(cli): handle missing config file gracefully
docs(readme): add architecture diagram
refactor(crypto): improve key generation algorithm
```

## Testing Guidelines

### Running Tests

```bash
# Run all tests
npm test

# Watch mode (during development)
npm run test:watch

# With coverage
npm test -- --coverage
```

### Writing Tests

- All new features must include tests
- All bug fixes must include regression tests
- Use [Vitest](https://vitest.dev/) as the testing framework
- Test file naming: `*.test.ts`
- Follow AAA pattern (Arrange, Act, Assert)

### Example

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

## Code Review

### As a Contributor

- Make sure all tests pass
- Make sure the code follows the project's linting rules
- Clearly describe your pull request
- Respond to review feedback

### As a Reviewer

- Be respectful and polite
- Provide constructive feedback
- Point out problems rather than blaming
- Help contributors improve their code

## Reporting Issues

### Reporting a Bug

When reporting a bug, please include:

1. **Clear title and description**
2. **Steps to reproduce** (1, 2, 3, ...)
3. **Expected behavior vs. actual behavior**
4. **Environment information**:
   - Node.js version
   - Operating system
   - npm/yarn/pnpm version
5. **Relevant logs or error messages**
6. **Possible solutions**

Use the [Bug Report Template](https://github.com/oasisbio/oasiswaker/issues/new?template=bug_report.md).

## Feature Requests

### Proposing a New Feature

When proposing a feature request, please include:

1. **Clear feature description**
2. **Use case** (who will use it? why?)
3. **Expected behavior**
4. **Possible implementation approach** (optional)
5. **Alternative approaches** (if any)

Use the [Feature Request Template](https://github.com/oasisbio/oasiswaker/issues/new?template=feature_request.md).

### Implementing a Feature

1. Check if there's an existing discussion in GitHub Issues
2. Create an issue or comment to let us know you're working on it before you start
3. Follow all the guidelines in this contributing guide
4. Include relevant tests and documentation in your PR

## License

By contributing to OasisWaker, you agree to license your code under the terms of the [MIT License](LICENSE).

---

<p align="center">
  <strong>Thank you for your support of OasisWaker!</strong>
  <br>
  <em>Your cloud, the network. Contribute. Connect. Decentralize.</em>
</p>
