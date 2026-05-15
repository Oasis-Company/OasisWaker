import inquirer from 'inquirer';
import axios from 'axios';
import { configManager } from '../utils/config.js';
import { logger } from '../utils/logger.js';
import { CloudflareDeployer } from '../../deploy/cloudflare.js';
import { VercelDeployer } from '../../deploy/vercel.js';
import { SupabaseDeployer } from '../../deploy/supabase.js';
import type { Platform, Endpoint } from '../../types/index.js';

export async function deployCommand(platformArg?: string): Promise<void> {
  try {
    logger.header('OasisWaker Deploy');

    const config = await configManager.getConfig();
    const endpoints = await configManager.getEndpoints();

    const platformsToDeploy: Platform[] = [];

    if (platformArg) {
      if (!['cloudflare', 'vercel', 'supabase'].includes(platformArg)) {
        logger.error(`Invalid platform: ${platformArg}`);
        logger.info('Valid platforms: cloudflare, vercel, supabase');
        process.exit(1);
      }
      platformsToDeploy.push(platformArg as Platform);
    } else {
      const connectedPlatforms: Platform[] = [];

      if (config.platforms?.cloudflare?.connected) {
        connectedPlatforms.push('cloudflare');
      }
      if (config.platforms?.vercel?.connected) {
        connectedPlatforms.push('vercel');
      }
      if (config.platforms?.supabase?.connected) {
        connectedPlatforms.push('supabase');
      }

      if (connectedPlatforms.length === 0) {
        logger.error('No platforms connected. Run "oasiswaker login" first.');
        process.exit(1);
      }

      const platformLabels = connectedPlatforms.map(p => {
        const alreadyDeployed = endpoints.some(e => e.platform === p);
        const suffix = alreadyDeployed ? ' (already deployed)' : '';
        switch (p) {
          case 'cloudflare':
            return { name: `Cloudflare${suffix}`, value: p };
          case 'vercel':
            return { name: `Vercel${suffix}`, value: p };
          case 'supabase':
            return { name: `Supabase${suffix}`, value: p };
        }
      });

      const { selectedPlatforms } = await inquirer.prompt([
        {
          type: 'checkbox',
          name: 'selectedPlatforms',
          message: 'Select platforms to deploy:',
          choices: platformLabels,
          default: connectedPlatforms,
        },
      ]);

      if (selectedPlatforms.length === 0) {
        logger.info('No platforms selected for deployment');
        return;
      }

      platformsToDeploy.push(...selectedPlatforms);
    }

    logger.blank();
    logger.subHeader('Deploying to selected platforms');
    logger.separator();

    const results: { platform: Platform; success: boolean; url?: string; error?: string }[] = [];

    for (const platform of platformsToDeploy) {
      logger.blank();
      logger.item('Platform', platform, 'cyan');

      const result = await deployToPlatform(platform);
      results.push(result);

      if (result.success) {
        logger.success(`Deployed to ${platform}: ${result.url}`);
      } else {
        logger.error(`Failed to deploy to ${platform}: ${result.error}`);
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    logger.blank();
    logger.separator();
    logger.subHeader('Deployment Summary');
    logger.separator();
    logger.item('Successful', successCount, 'green');
    logger.item('Failed', failCount, failCount > 0 ? 'red' : 'white');

    if (successCount > 0) {
      logger.blank();
      logger.success('Deployment completed!');
      logger.info('Run "oasiswaker status" to check the status of your nodes');
    }

    if (failCount > 0) {
      process.exit(1);
    }
  } catch (error) {
    logger.failSpinner('Deployment failed');
    logger.error(error as Error);
    process.exit(1);
  }
}

async function deployToPlatform(platform: Platform): Promise<{ platform: Platform; success: boolean; url?: string; error?: string }> {
  try {
    const credentials = await configManager.getCredentials(platform);

    if (!credentials) {
      return { platform, success: false, error: 'No credentials found' };
    }

    let url: string | undefined;

    switch (platform) {
      case 'cloudflare': {
        if (!credentials.accountId) {
          return { platform, success: false, error: 'No account ID found' };
        }
        const deployer = new CloudflareDeployer(credentials.accessToken, credentials.accountId);
        const result = await deployer.deploy();
        url = result.url;
        if (result.success && url) {
          const endpoint: Endpoint = {
            platform,
            url,
            deployedAt: new Date(),
            status: 'active',
          };
          await configManager.addEndpoint(endpoint);
          await registerNodeWithBackend(endpoint);
        }
        return { platform, success: result.success, url, error: result.error };
      }

      case 'vercel': {
        const deployer = new VercelDeployer(credentials.accessToken, credentials.accountId);
        const result = await deployer.deploy();
        url = result.url;
        if (result.success && url) {
          const endpoint: Endpoint = {
            platform,
            url,
            deployedAt: new Date(),
            status: 'active',
          };
          await configManager.addEndpoint(endpoint);
          await registerNodeWithBackend(endpoint);
        }
        return { platform, success: result.success, url, error: result.error };
      }

      case 'supabase': {
        if (!credentials.accountId) {
          return { platform, success: false, error: 'No project ref found' };
        }
        const deployer = new SupabaseDeployer(credentials.accessToken, credentials.accountId);
        const result = await deployer.deploy();
        url = result.url;
        if (result.success && url) {
          const endpoint: Endpoint = {
            platform,
            url,
            deployedAt: new Date(),
            status: 'active',
          };
          await configManager.addEndpoint(endpoint);
          await registerNodeWithBackend(endpoint);
        }
        return { platform, success: result.success, url, error: result.error };
      }
    }
  } catch (error: any) {
    return { platform, success: false, error: error.message };
  }
}

async function registerNodeWithBackend(endpoint: Endpoint): Promise<void> {
  try {
    const config = await configManager.getConfig();

    await axios.post(`${config.oasisbio.apiEndpoint}/api/nodes/register`, {
      nodeId: config.nodeId,
      platform: endpoint.platform,
      endpointUrl: endpoint.url,
      storageQuota: getStorageQuota(endpoint.platform),
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    logger.debug(`Registered ${endpoint.platform} node with OasisBio backend`);
  } catch (error: any) {
    logger.warn(`Failed to register node with backend: ${error.message}`);
  }
}

function getStorageQuota(platform: Platform): number {
  switch (platform) {
    case 'cloudflare':
      return 1 * 1024 * 1024 * 1024;
    case 'vercel':
      return 1 * 1024 * 1024 * 1024;
    case 'supabase':
      return 1 * 1024 * 1024 * 1024;
  }
}
