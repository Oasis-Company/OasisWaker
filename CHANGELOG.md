# Changelog

All notable changes to OasisWaker will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### 🆕 v2.0 Preparation (In Progress)

#### Documentation Updates
- ✅ **README.md** - Updated to v2.0 vision (Universal Infrastructure Kernel)
- ✅ **DOCUMENTATION.md** - Created comprehensive documentation index
- ✅ **.trae/archive/** - Created archive folder for old docs
- ✅ **CODE_CLEANUP.md** - Documented all known code issues from v1.0
- [ ] Archive old MVP planning documents
- [ ] Set up monorepo structure

#### Architecture Changes
- 🔄 **Vision Changed** - From "CLI tool" to "Universal Infrastructure Kernel"
- 🔄 **New Direction** - P2P decentralized network (not centralized)
- 🔄 **New Workflow** - Users own their GitHub projects, CLI for maintenance

### Planned
- [ ] Multi-account support
- [ ] More cloud platforms (AWS Lambda, GCP Cloud Functions)
- [ ] Web dashboard
- [ ] Advanced health monitoring
- [ ] Node reputation system
- [ ] P2P network implementation

---

## [0.1.0] - 2024-XX-XX

### Added

#### Core Features
- ✅ **CLI interface** with 5 main commands
  - `oasiswaker init` - Initialize configuration
  - `oasiswaker login` - Connect cloud platforms via OAuth
  - `oasiswaker deploy` - Deploy adapters to cloud platforms
  - `oasiswaker status` - Check connection and deployment status
  - `oasiswaker revoke` - Revoke access and remove adapters

- ✅ **Cloudflare Support**
  - OAuth 2.0 authentication with PKCE
  - Cloudflare Workers deployment
  - R2 object storage integration
  - Health check and block storage endpoints

- ✅ **Vercel Support**
  - OAuth 2.0 authentication
  - Vercel Edge Functions deployment
  - Vercel Blob storage integration

- ✅ **Supabase Support**
  - OAuth 2.0 authentication
  - Supabase Edge Functions deployment
  - Supabase Storage integration

#### Security
- ✅ **AES-256-GCM encryption** for all stored credentials
- ✅ Automatic master key generation with proper file permissions
- ✅ PKCE (Proof Key for Code Exchange) for secure OAuth flows
- ✅ Environment variable configuration for sensitive values
- ✅ Secure storage of access tokens with auto-encryption

#### Developer Experience
- ✅ **TypeScript** with full type definitions
- ✅ Comprehensive test suite using Vitest
- ✅ Colored output with progress spinners
- ✅ Interactive prompts for user decisions
- ✅ Detailed error handling and recovery
- ✅ Project structure follows modern JavaScript standards

#### Documentation
- ✅ Comprehensive README with installation and usage guide
- ✅ CONTRIBUTING.md for contributors
- ✅ CODE_OF_CONDUCT.md
- ✅ Pre-mortem analysis for risk identification
- ✅ Logo design specifications
- ✅ Release checklist

### Fixed
- N/A (First release)

### Changed
- N/A (First release)

### Deprecated
- N/A (First release)

### Security
- N/A (First release)

---

## [0.0.1] - 2024-XX-XX (Internal Alpha)

### Added
- Initial project structure
- Basic CLI framework
- OAuth 2.0 integration with Cloudflare
- Initial Worker adapter prototype

---

[0.1.0]: https://github.com/oasisbio/oasiswaker/compare/v0.0.1...v0.1.0
[0.0.1]: https://github.com/oasisbio/oasiswaker/releases/tag/v0.0.1

