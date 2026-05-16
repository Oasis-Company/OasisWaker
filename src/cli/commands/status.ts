import axios from 'axios';
import { configManager } from '../utils/config.js';
import { logger } from '../utils/logger.js';
import { CloudflareDeployer } from '../../deploy/cloudflare.js';
import { VercelDeployer } from '../../deploy/vercel.js';
import { SupabaseDeployer } from '../../deploy/supabase.js';
import type { Platform, Endpoint, HealthCheckResult } from '../../types/index.js';

export async function statusCommand(): Promise<void> {
  try {
    logger.header('OasisWaker Status');

    const config = await configManager.getConfig();
    const endpoints = await configManager.getEndpoints();

    logger.subHeader('Node Information');
    logger.separator();
    logger.item('Node ID', config.nodeId, 'cyan');
    logger.item('API Endpoint', config.oasisbio.apiEndpoint, 'blue');
    logger.item('Config Path', configManager.getConfigPath(), 'gray');

    logger.blank();
    logger.subHeader('Connected Platforms');
    logger.separator();

    const platforms: Platform[] = ['cloudflare', 'vercel', 'supabase'];

    for (const platform of platforms) {
      const platformConfig = config.platforms?.[platform];
      const status = platformConfig?.connected ? 'connected' : 'disconnected';
      logger.statusItem(platform, status);

      if (platformConfig?.connected) {
        const info = getPlatformInfo(platform, platformConfig);
        if (info) {
          logger.item(`  ${platform} ID`, info, 'gray');
        }
      }
    }

    logger.blank();
    logger.subHeader('Deployed Adapters');
    logger.separator();

    if (endpoints.length === 0) {
      logger.warn('No adapters deployed yet');
      logger.info('Run "oasiswaker deploy" to deploy adapters');
    } else {
      const healthResults = await performHealthChecks(endpoints);

      for (const endpoint of endpoints) {
        const health = healthResults.find(h => h.platform === endpoint.platform);

        logger.blank();
        logger.item('Platform', endpoint.platform, 'cyan');
        logger.item('URL', endpoint.url, 'blue');

        if (health) {
          const statusColor = health.status === 'active' ? 'green' : health.status === 'inactive' ? 'yellow' : 'red';
          logger.item('Status', health.status, statusColor);

          if (health.latency !== undefined) {
            logger.item('Latency', `${health.latency}ms`, 'gray');
          }

          if (health.storageUsed !== undefined) {
            const usedGB = (health.storageUsed / (1024 * 1024 * 1024)).toFixed(2);
            const availGB = health.storageAvailable !== undefined
              ? (health.storageAvailable / (1024 * 1024 * 1024)).toFixed(2)
              : 'N/A';
            logger.item('Storage', `${usedGB} GB / ${availGB} GB`, 'gray');
          }

          if (health.requestsProcessed !== undefined) {
            logger.item('Requests Processed', health.requestsProcessed, 'gray');
          }

          if (health.error) {
            logger.item('Error', health.error, 'red');
          }
        } else {
          const configStatus = endpoint.status === 'active' ? 'green' : endpoint.status === 'inactive' ? 'yellow' : 'red';
          logger.item('Status', endpoint.status, configStatus);
        }

        logger.item('Deployed At', new Date(endpoint.deployedAt).toLocaleString(), 'gray');
      }
    }

    logger.blank();
    logger.separator();

    const activeEndpoints = endpoints.filter(e => e.status === 'active');
    if (activeEndpoints.length > 0) {
      logger.success(`${activeEndpoints.length} adapter(s) active`);
    }

    logger.blank();
    logger.subHeader('Available Commands');
    logger.separator();
    logger.item('oasiswaker login', 'Connect a new platform', 'gray');
    logger.item('oasiswaker deploy', 'Deploy adapters', 'gray');
    logger.item('oasiswaker revoke', 'Remove adapters and disconnect', 'gray');

    logger.blank();
  } catch (error) {
    logger.failSpinner('Failed to get status');
    logger.error(error as Error);
    process.exit(1);
  }
}

async function performHealthChecks(endpoints: Endpoint[]): Promise<HealthCheckResult[]> {
  const results: HealthCheckResult[] = [];

  for (const endpoint of endpoints) {
    try {
      let healthCheck: HealthCheckResult;

      switch (endpoint.platform) {
        case 'cloudflare': {
          const credentials = await configManager.getCredentials('cloudflare');
          if (credentials) {
            const deployer = new CloudflareDeployer(credentials.accessToken, credentials.accountId || '');
            healthCheck = {
              platform: endpoint.platform,
              ...await deployer.healthCheck(endpoint.url),
            };
          } else {
            healthCheck = { platform: endpoint.platform, status: 'error', error: 'No credentials' };
          }
          break;
        }
        case 'vercel': {
          const credentials = await configManager.getCredentials('vercel');
          if (credentials) {
            const deployer = new VercelDeployer(credentials.accessToken, credentials.accountId);
            healthCheck = {
              platform: endpoint.platform,
              ...await deployer.healthCheck(endpoint.url),
            };
          } else {
            healthCheck = { platform: endpoint.platform, status: 'error', error: 'No credentials' };
          }
          break;
        }
        case 'supabase': {
          const credentials = await configManager.getCredentials('supabase');
          if (credentials) {
            const deployer = new SupabaseDeployer(credentials.accessToken, credentials.accountId || '');
            healthCheck = {
              platform: endpoint.platform,
              ...await deployer.healthCheck(endpoint.url),
            };
          } else {
            healthCheck = { platform: endpoint.platform, status: 'error', error: 'No credentials' };
          }
          break;
        }
      }

      const healthEndpoint = `${endpoint.url}/health`;
      const startTime = Date.now();

      try {
        const response = await axios.get(healthEndpoint, { timeout: 5000 });
        const latency = Date.now() - startTime;

        results.push({
          platform: endpoint.platform,
          status: response.status === 200 ? 'active' : 'error',
          latency,
          ...(response.data?.storageUsed !== undefined && {
            storageUsed: response.data.storageUsed,
            storageAvailable: response.data.storageAvailable,
            requestsProcessed: response.data.requestsProcessed,
          }),
        });
      } catch {
        results.push({
          platform: endpoint.platform,
          status: 'error',
          error: 'Health check failed',
        });
      }

      await configManager.updateEndpointStatus(endpoint.platform, results[results.length - 1].status);
    } catch (error: any) {
      results.push({
        platform: endpoint.platform,
        status: 'error',
        error: error.message,
      });
    }
  }

  return results;
}

function getPlatformInfo(platform: Platform, config: any): string | undefined {
  switch (platform) {
    case 'cloudflare':
      return config.accountId;
    case 'vercel':
      return config.teamId || 'Personal account';
    case 'supabase':
      return config.projectRef;
  }
}
