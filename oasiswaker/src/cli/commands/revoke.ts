import inquirer from 'inquirer';
import axios from 'axios';
import { configManager } from '../utils/config.js';
import { logger } from '../utils/logger.js';
import { cloudflareOAuth } from '../../auth/cloudflare.js';
import { vercelOAuth } from '../../auth/vercel.js';
import { supabaseOAuth } from '../../auth/supabase.js';
import { CloudflareDeployer } from '../../deploy/cloudflare.js';
import { VercelDeployer } from '../../deploy/vercel.js';
import { SupabaseDeployer } from '../../deploy/supabase.js';
import type { Platform } from '../../types/index.js';

export async function revokeCommand(platformArg?: string): Promise<void> {
  try {
    logger.header('OasisWaker Revoke');

    const config = await configManager.getConfig();
    const endpoints = await configManager.getEndpoints();

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
      logger.warn('No platforms connected');
      return;
    }

    let platformToRevoke: Platform | undefined = platformArg as Platform;

    if (!platformToRevoke) {
      const platformLabels = connectedPlatforms.map(p => {
        const hasEndpoint = endpoints.some(e => e.platform === p);
        const suffix = hasEndpoint ? ' (with deployed adapter)' : '';
        switch (p) {
          case 'cloudflare':
            return { name: `Cloudflare${suffix}`, value: p };
          case 'vercel':
            return { name: `Vercel${suffix}`, value: p };
          case 'supabase':
            return { name: `Supabase${suffix}`, value: p };
        }
      });

      const { selected } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selected',
          message: 'Select a platform to revoke:',
          choices: platformLabels,
        },
      ]);

      platformToRevoke = selected;
    }

    if (!platformToRevoke || !connectedPlatforms.includes(platformToRevoke)) {
      logger.error(`Invalid platform or not connected: ${platformArg}`);
      process.exit(1);
    }

    const hasEndpoint = endpoints.some(e => e.platform === platformToRevoke);

    logger.blank();
    logger.subHeader(`Revoking ${platformToRevoke}`);
    logger.separator();

    if (hasEndpoint) {
      const { confirmDelete } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirmDelete',
          message: `This will delete the deployed adapter from ${platformToRevoke}. Continue?`,
          default: true,
        },
      ]);

      if (!confirmDelete) {
        logger.info('Revocation cancelled');
        return;
      }
    } else {
      const { confirmRevoke } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirmRevoke',
          message: `This will revoke access to ${platformToRevoke}. Continue?`,
          default: true,
        },
      ]);

      if (!confirmRevoke) {
        logger.info('Revocation cancelled');
        return;
      }
    }

    let success = true;

    if (hasEndpoint) {
      logger.startSpinner(`Deleting ${platformToRevoke} adapter...`);

      const credentials = await configManager.getCredentials(platformToRevoke);

      if (credentials) {
        let deleted = false;

        switch (platformToRevoke) {
          case 'cloudflare': {
            const deployer = new CloudflareDeployer(credentials.accessToken, credentials.accountId || '');
            deleted = await deployer.deleteWorker();
            break;
          }
          case 'vercel': {
            const deployer = new VercelDeployer(credentials.accessToken, credentials.accountId);
            deleted = await deployer.deleteDeployment();
            break;
          }
          case 'supabase': {
            const deployer = new SupabaseDeployer(credentials.accessToken, credentials.accountId || '');
            deleted = await deployer.deleteFunction();
            break;
          }
        }

        if (deleted) {
          await configManager.removeEndpoint(platformToRevoke);
          await notifyBackendRevocation(platformToRevoke);
          logger.succeedSpinner('Adapter deleted');
        } else {
          logger.warn('Failed to delete adapter (may already be deleted)');
        }
      }
    }

    logger.startSpinner(`Revoking ${platformToRevoke} credentials...`);

    const credentials = await configManager.getCredentials(platformToRevoke);

    if (credentials?.accessToken) {
      switch (platformToRevoke) {
        case 'cloudflare':
          await cloudflareOAuth.revokeToken(credentials.accessToken);
          break;
        case 'vercel':
          await vercelOAuth.revokeToken(credentials.accessToken);
          break;
        case 'supabase':
          await supabaseOAuth.revokeToken(credentials.accessToken);
          break;
      }
    }

    await configManager.deleteCredentials(platformToRevoke);
    await configManager.updatePlatform(platformToRevoke, {
      connected: false,
      accountId: undefined,
      teamId: undefined,
      projectRef: undefined,
    } as any);

    logger.succeedSpinner('Credentials revoked');

    logger.blank();
    logger.success(`${platformToRevoke} has been fully revoked`);
    logger.info('Run "oasiswaker login" to reconnect if needed');

    logger.blank();
  } catch (error) {
    logger.failSpinner('Revocation failed');
    logger.error(error as Error);
    process.exit(1);
  }
}

async function notifyBackendRevocation(platform: Platform): Promise<void> {
  try {
    const config = await configManager.getConfig();

    await axios.post(`${config.oasisbio.apiEndpoint}/api/nodes/revoke`, {
      nodeId: config.nodeId,
      platform,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    logger.debug(`Notified backend of ${platform} revocation`);
  } catch (error: any) {
    logger.warn(`Failed to notify backend: ${error.message}`);
  }
}
