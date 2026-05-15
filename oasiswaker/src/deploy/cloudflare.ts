import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import axios from 'axios';
import type { PlatformCredentials, DeployResult } from '../types/index.js';
import { logger } from '../cli/utils/logger.js';

const execAsync = promisify(exec);

const CLOUDFLARE_API = 'https://api.cloudflare.com';

export class CloudflareDeployer {
  private accessToken: string;
  private accountId: string;
  private workerName: string = 'oasiswaker-adapter';

  constructor(accessToken: string, accountId: string) {
    this.accessToken = accessToken;
    this.accountId = accountId;
  }

  setWorkerName(name: string): void {
    this.workerName = name;
  }

  async deploy(): Promise<DeployResult> {
    const tempDir = join(homedir(), '.oasiswaker', 'temp', 'cloudflare');

    try {
      logger.startSpinner('Preparing Cloudflare Worker adapter...');

      if (existsSync(tempDir)) {
        rmSync(tempDir, { recursive: true, force: true });
      }
      mkdirSync(tempDir, { recursive: true });

      const workerCode = this.generateWorkerCode();
      writeFileSync(join(tempDir, 'src', 'index.ts'), workerCode);
      mkdirSync(join(tempDir, 'src'), { recursive: true });
      writeFileSync(join(tempDir, 'src', 'index.ts'), workerCode);

      const wranglerToml = this.generateWranglerToml();
      writeFileSync(join(tempDir, 'wrangler.toml'), wranglerToml);

      const packageJson = {
        name: 'oasiswaker-cloudflare',
        version: '1.0.0',
        private: true,
        type: 'module',
        dependencies: {},
        devDependencies: {
          wrangler: '^3.80.0',
          typescript: '^5.4.0',
          '@cloudflare/workers-types': '^4.20241127.0'
        }
      };
      writeFileSync(join(tempDir, 'package.json'), JSON.stringify(packageJson, null, 2));

      const tsconfig = {
        compilerOptions: {
          target: 'ES2022',
          module: 'ES2022',
          lib: ['ES2022'],
          types: ['@cloudflare/workers-types'],
          moduleResolution: 'bundler',
          strict: true,
        }
      };
      writeFileSync(join(tempDir, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2));

      logger.succeedSpinner('Worker code generated');

      logger.startSpinner('Deploying Cloudflare Worker...');

      const { stdout, stderr } = await execAsync('npx wrangler deploy', {
        cwd: tempDir,
        timeout: 300000,
      });

      logger.debug('Wrangler output:', stdout);
      if (stderr) {
        logger.debug('Wrangler stderr:', stderr);
      }

      const workerUrl = `https://${this.workerName}.${this.accountId}.workers.dev`;

      logger.succeedSpinner('Cloudflare Worker deployed successfully');

      return {
        platform: 'cloudflare',
        success: true,
        url: workerUrl,
      };
    } catch (error: any) {
      logger.failSpinner('Failed to deploy Cloudflare Worker');
      logger.error(`Deployment error: ${error.message}`);
      return {
        platform: 'cloudflare',
        success: false,
        error: error.message,
      };
    } finally {
      if (existsSync(tempDir)) {
        rmSync(tempDir, { recursive: true, force: true });
      }
    }
  }

  async deleteWorker(): Promise<boolean> {
    try {
      logger.startSpinner('Deleting Cloudflare Worker...');

      await axios.delete(`${CLOUDFLARE_API}/client/v4/accounts/${this.accountId}/workers/scripts/${this.workerName}`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      logger.succeedSpinner('Cloudflare Worker deleted');
      return true;
    } catch (error: any) {
      logger.failSpinner('Failed to delete Cloudflare Worker');
      logger.error(error.message);
      return false;
    }
  }

  async healthCheck(url: string): Promise<{ status: 'active' | 'inactive' | 'error'; latency?: number }> {
    const startTime = Date.now();
    try {
      const response = await axios.get(`${url}/health`, {
        timeout: 5000,
      });
      const latency = Date.now() - startTime;
      return {
        status: response.status === 200 ? 'active' : 'error',
        latency,
      };
    } catch {
      return {
        status: 'error',
      };
    }
  }

  private generateWorkerCode(): string {
    return `export interface Env {
  OASIS_BLOCKS: R2Bucket;
  OASIS_SECRET: string;
}

interface BlockRequest {
  id: string;
  data: string;
  metadata?: Record<string, unknown>;
}

interface ReportRequest {
  nodeId: string;
  platform: string;
  storageUsed: number;
  storageAvailable: number;
  requestsProcessed: number;
  uptime: number;
  timestamp: string;
}

const verifySecret = (request: Request): boolean => {
  const secret = request.headers.get('X-Oasis-Secret');
  return secret === (globalThis as any).OASIS_SECRET;
};

const handleBlockPut = async (request: Request, env: Env): Promise<Response> => {
  if (!verifySecret(request)) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const body: BlockRequest = await request.json();
    
    if (!body.id || !body.data) {
      return Response.json({ error: 'Missing id or data' }, { status: 400 });
    }

    await env.OASIS_BLOCKS.put(body.id, body.data, {
      httpMetadata: {
        contentType: 'application/octet-stream',
      },
      metadata: body.metadata || {},
    });

    return Response.json({
      success: true,
      id: body.id,
      size: body.data.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json({ error: 'Failed to store block' }, { status: 500 });
  }
};

const handleBlockGet = async (request: Request, env: Env): Promise<Response> => {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();

  if (!id) {
    return Response.json({ error: 'Missing block id' }, { status: 400 });
  }

  try {
    const block = await env.OASIS_BLOCKS.get(id);

    if (!block) {
      return Response.json({ error: 'Block not found' }, { status: 404 });
    }

    return Response.json({
      id,
      data: await block.text(),
      metadata: block.metadata,
      timestamp: block.uploaded?.toISOString(),
    });
  } catch (error) {
    return Response.json({ error: 'Failed to retrieve block' }, { status: 500 });
  }
};

const handleBlockDelete = async (request: Request, env: Env): Promise<Response> => {
  if (!verifySecret(request)) {
    return new Response('Unauthorized', { status: 401 });
  }

  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();

  if (!id) {
    return Response.json({ error: 'Missing block id' }, { status: 400 });
  }

  try {
    await env.OASIS_BLOCKS.delete(id);
    return Response.json({ success: true, id });
  } catch (error) {
    return Response.json({ error: 'Failed to delete block' }, { status: 500 });
  }
};

const handleReport = async (request: Request): Promise<Response> => {
  try {
    const body: ReportRequest = await request.json();
    console.log('Health report received:', JSON.stringify(body));
    return Response.json({ received: true, timestamp: new Date().toISOString() });
  } catch (error) {
    return Response.json({ error: 'Failed to process report' }, { status: 500 });
  }
};

const handleHealth = async (): Promise<Response> => {
  return Response.json({
    status: 'ok',
    platform: 'cloudflare',
    timestamp: new Date().toISOString(),
  });
};

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    (globalThis as any).OASIS_SECRET = env.OASIS_SECRET || 'oasiswaker-default-secret';

    if (path === '/block' && request.method === 'PUT') {
      return handleBlockPut(request, env);
    }

    if (path.startsWith('/block/') && request.method === 'GET') {
      return handleBlockGet(request, env);
    }

    if (path.startsWith('/block/') && request.method === 'DELETE') {
      return handleBlockDelete(request, env);
    }

    if (path === '/report' && request.method === 'POST') {
      return handleReport(request);
    }

    if (path === '/health' && request.method === 'GET') {
      return handleHealth();
    }

    return Response.json({ error: 'Not found' }, { status: 404 });
  },
};
`;
  }

  private generateWranglerToml(): string {
    return `name = "${this.workerName}"
main = "src/index.ts"
compatibility_date = "2024-01-01"
account_id = "${this.accountId}"

[[r2_buckets]]
binding = "OASIS_BLOCKS"
bucket_name = "oasis-blocks"

[vars]
OASIS_SECRET = "change-this-in-production"
`;
  }
}
