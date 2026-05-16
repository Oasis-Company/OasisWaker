# OasisWaker

Your cloud, the network. Contribute. Connect. Decentralize.

OasisWaker is a CLI tool that enables OasisBio users to voluntarily contribute their Cloudflare, Vercel, and Supabase accounts as edge nodes, forming a distributed serverless infrastructure for data sharding and edge computing.

## Features

- **Multi-Platform Support**: Connect Cloudflare (Workers + R2), Vercel (Edge Functions + Blob), or Supabase (Storage)
- **One-Command Deployment**: Automatically deploy lightweight adapters to your cloud accounts
- **Unified API**: All adapters expose the same HTTP API for seamless integration
- **Health Monitoring**: Built-in health checks and metrics reporting
- **Secure**: OAuth 2.0 with PKCE, encrypted credential storage
- **Points System**: Earn points for contributing resources

## Installation

### From npm

```bash
npm install -g @oasisbio/oasiswaker
```

### From Source

```bash
git clone https://github.com/oasisbio/oasiswaker.git
cd oasiswaker
npm install
npm run build
npm link
```

## Quick Start

```bash
# Initialize OasisWaker
oasiswaker init

# Connect a platform
oasiswaker login

# Deploy adapters
oasiswaker deploy

# Check status
oasiswaker status

# When you're done
oasiswaker revoke
```

## Commands

### `oasiswaker init`

Initialize OasisWaker configuration. Creates `~/.oasiswaker/` directory with configuration files.

```bash
oasiswaker init [--endpoint <url>]
```

Options:
- `--endpoint, -e <url>`: OasisBio API endpoint (default: https://oasisbio.com)

### `oasiswaker login`

Connect a cloud platform using OAuth.

```bash
oasiswaker login [platform]
```

Arguments:
- `platform`: `cloudflare`, `vercel`, or `supabase` (interactive if not specified)

### `oasiswaker deploy`

Deploy adapters to connected platforms.

```bash
oasiswaker deploy [platform]
```

Arguments:
- `platform`: Deploy to specific platform only (optional)

### `oasiswaker status`

Display status of connected platforms and deployed adapters.

```bash
oasiswaker status
```

Shows:
- Connected platforms and authentication status
- Deployed adapters with URLs and health status
- Storage usage and request counts
- Points balance

### `oasiswaker revoke`

Revoke access and remove deployed adapters.

```bash
oasiswaker revoke [platform]
```

Arguments:
- `platform`: Revoke specific platform (interactive if not specified)

## Adapter API

Each deployed adapter exposes a unified HTTP API:

### `PUT /block`

Store a data block.

```bash
curl -X PUT https://your-adapter.com/block \
  -H "Content-Type: application/json" \
  -H "X-Oasis-Secret: your-secret" \
  -d '{"id": "block-1", "data": "base64-encoded-data", "metadata": {"type": "encrypted-chunk"}}'
```

### `GET /block/:id`

Retrieve a data block.

```bash
curl https://your-adapter.com/block/block-1
```

### `DELETE /block/:id`

Delete a data block.

```bash
curl -X DELETE https://your-adapter.com/block/block-1 \
  -H "X-Oasis-Secret: your-secret"
```

### `POST /report`

Report health metrics (called automatically by the CLI).

```bash
curl -X POST https://your-adapter.com/report \
  -H "Content-Type: application/json" \
  -d '{"nodeId": "uuid", "storageUsed": 104857600, "requestsProcessed": 1523}'
```

### `GET /health`

Health check endpoint.

```bash
curl https://your-adapter.com/health
```

## Configuration

Configuration is stored in `~/.oasiswaker/`:

```
~/.oasiswaker/
├── config.json       # Main configuration
├── credentials/      # Platform credentials (encrypted)
│   ├── cloudflare.json
│   ├── vercel.json
│   └── supabase.json
└── endpoints.json    # Deployed endpoint URLs
```

## Security

- **OAuth 2.0 with PKCE**: All platform connections use secure authorization code flow
- **Encrypted Storage**: Credentials are encrypted using AES-256-GCM
- **Token Refresh**: Automatic token refresh with exponential backoff
- **HTTPS Only**: All API communications use HTTPS

## Platform Requirements

### Cloudflare

- Cloudflare account with Workers and R2 enabled
- R2 bucket named `oasis-blocks` (created automatically)

### Vercel

- Vercel account (free tier supported)
- Blob storage (created automatically)

### Supabase

- Supabase project
- Storage bucket named `oasis-blocks` (created automatically)

## Development

```bash
# Build
npm run build

# Watch mode
npm run dev

# Run tests
npm test

# Lint
npm run lint
```

## License

MIT

## Links

- [OasisBio](https://oasisbio.com)
- [Documentation](https://docs.oasisbio.com)
- [GitHub](https://github.com/oasisbio/oasiswaker)
