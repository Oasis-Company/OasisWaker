import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import axios from 'axios';
import type { DeployResult } from '../types/index.js';
import { logger } from '../cli/utils/logger.js';

const execAsync = promisify(exec);

export class VercelDeployer {
  private accessToken: string;
  private teamId?: string;
  private projectName: string = 'oasiswaker-adapter';

  constructor(accessToken: string, teamId?: string) {
    this.accessToken = accessToken;
    this.teamId = teamId;
  }

  setProjectName(name: string): void {
    this.projectName = name;
  }

  async deploy(): Promise<DeployResult> {
    const tempDir = join(homedir(), '.oasiswaker', 'temp', 'vercel');

    try {
      logger.startSpinner('Preparing Vercel Edge Function adapter...');

      if (existsSync(tempDir)) {
        rmSync(tempDir, { recursive: true, force: true });
      }
      mkdirSync(tempDir, { recursive: true });

      const nowJson = this.generateNowJson();
      writeFileSync(join(tempDir, 'vercel.json'), JSON.stringify(nowJson, null, 2));

      const apiDir = join(tempDir, 'api');
      mkdirSync(apiDir, { recursive: true });

      const edgeFunctionCode = this.generateEdgeFunctionCode();
      writeFileSync(join(apiDir, 'index.ts'), edgeFunctionCode);

      const packageJson = {
        name: 'oasiswaker-vercel',
        version: '1.0.0',
        private: true,
        type: 'module',
        dependencies: {
          '@vercel/blob': '^0.23.0',
        },
        devDependencies: {
          '@vercel/node': '^3.2.0',
          typescript: '^5.4.0',
        }
      };
      writeFileSync(join(tempDir, 'package.json'), JSON.stringify(packageJson, null, 2));

      logger.succeedSpinner('Edge Function code generated');

      logger.startSpinner('Deploying to Vercel...');

      let deployCommand = `npx vercel deploy --token ${this.accessToken} --yes`;
      if (this.teamId) {
        deployCommand += ` --scope ${this.teamId}`;
      }

      const { stdout, stderr } = await execAsync(deployCommand, {
        cwd: tempDir,
        timeout: 300000,
      });

      logger.debug('Vercel output:', stdout);
      if (stderr) {
        logger.debug('Vercel stderr:', stderr);
      }

      const urlMatch = stdout.match(/https:\/\/[^\s]+/);
      const deploymentUrl = urlMatch ? urlMatch[0] : stdout.split('\n').pop()?.trim() || '';

      logger.succeedSpinner('Vercel Edge Function deployed successfully');

      return {
        platform: 'vercel',
        success: true,
        url: deploymentUrl,
      };
    } catch (error: any) {
      logger.failSpinner('Failed to deploy to Vercel');
      logger.error(`Deployment error: ${error.message}`);
      return {
        platform: 'vercel',
        success: false,
        error: error.message,
      };
    } finally {
      if (existsSync(tempDir)) {
        rmSync(tempDir, { recursive: true, force: true });
      }
    }
  }

  async deleteDeployment(): Promise<boolean> {
    try {
      logger.startSpinner('Finding OasisWaker deployment...');

      const params: Record<string, string> = {};
      if (this.teamId) {
        params.teamId = this.teamId;
      }

      const response = await axios.get('https://api.vercel.com/v13/deployments', {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
        params,
      });

      const deployments = response.data.deployments || [];
      const targetDeployment = deployments.find(
        (d: any) => d.name === this.projectName && d.state === 'READY'
      );

      if (!targetDeployment) {
        logger.info('No active OasisWaker deployment found');
        return true;
      }

      logger.succeedSpinner('Found deployment, deleting...');

      const deleteUrl = this.teamId
        ? `https://api.vercel.com/v13/deployments/${targetDeployment.id}?teamId=${this.teamId}`
        : `https://api.vercel.com/v13/deployments/${targetDeployment.id}`;

      await axios.delete(deleteUrl, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      logger.succeedSpinner('Vercel deployment deleted');
      return true;
    } catch (error: any) {
      logger.failSpinner('Failed to delete Vercel deployment');
      logger.error(error.message);
      return false;
    }
  }

  async healthCheck(url: string): Promise<{ status: 'active' | 'inactive' | 'error'; latency?: number }> {
    const startTime = Date.now();
    try {
      const response = await axios.get(`${url}/api/health`, {
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

  private generateNowJson(): any {
    return {
      version: 2,
      builds: [
        {
          src: 'api/**/*.ts',
          use: '@vercel/node',
        },
      ],
      routes: [
        {
          src: '/block',
          dest: '/api/index.ts',
          methods: ['PUT'],
        },
        {
          src: '/block/(.*)',
          dest: '/api/index.ts',
          methods: ['GET', 'DELETE'],
        },
        {
          src: '/report',
          dest: '/api/index.ts',
          methods: ['POST'],
        },
        {
          src: '/health',
          dest: '/api/index.ts',
          methods: ['GET'],
        },
      ],
    };
  }

  private generateEdgeFunctionCode(): string {
    return `import { put, del, head } from '@vercel/blob';

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
  return secret === process.env.OASIS_SECRET;
};

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;

  if (path === '/health' && req.method === 'GET') {
    return Response.json({
      status: 'ok',
      platform: 'vercel',
      timestamp: new Date().toISOString(),
    });
  }

  if (path === '/block' && req.method === 'PUT') {
    if (!verifySecret(req)) {
      return new Response('Unauthorized', { status: 401 });
    }

    try {
      const body: BlockRequest = await req.json();

      if (!body.id || !body.data) {
        return Response.json({ error: 'Missing id or data' }, { status: 400 });
      }

      const blob = await put(body.id, body.data, {
        contentType: 'application/octet-stream',
        access: 'private',
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });

      return Response.json({
        success: true,
        id: body.id,
        url: blob.url,
        size: body.data.length,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Put error:', error);
      return Response.json({ error: 'Failed to store block' }, { status: 500 });
    }
  }

  if (path.startsWith('/block/') && req.method === 'GET') {
    const id = path.split('/').pop()!;

    try {
      const blob = await head(id, { token: process.env.BLOB_READ_WRITE_TOKEN });

      if (!blob) {
        return Response.json({ error: 'Block not found' }, { status: 404 });
      }

      const response = await fetch(blob.url);
      const data = await response.text();

      return Response.json({
        id,
        data,
        metadata: blob.metadata,
        timestamp: blob.uploadedAt?.toISOString(),
      });
    } catch (error) {
      return Response.json({ error: 'Block not found' }, { status: 404 });
    }
  }

  if (path.startsWith('/block/') && req.method === 'DELETE') {
    if (!verifySecret(req)) {
      return new Response('Unauthorized', { status: 401 });
    }

    const id = path.split('/').pop()!;

    try {
      await del(id, { token: process.env.BLOB_READ_WRITE_TOKEN });
      return Response.json({ success: true, id });
    } catch (error) {
      return Response.json({ error: 'Failed to delete block' }, { status: 500 });
    }
  }

  if (path === '/report' && req.method === 'POST') {
    try {
      const body: ReportRequest = await req.json();
      console.log('Health report received:', JSON.stringify(body));
      return Response.json({ received: true, timestamp: new Date().toISOString() });
    } catch (error) {
      return Response.json({ error: 'Failed to process report' }, { status: 500 });
    }
  }

  return Response.json({ error: 'Not found' }, { status: 404 });
}
`;
  }
}
