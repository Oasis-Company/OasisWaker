import inquirer from 'inquirer';
import { configManager } from '../utils/config.js';
import { logger } from '../utils/logger.js';
import { cloudflareOAuth } from '../../auth/cloudflare.js';
import { vercelOAuth } from '../../auth/vercel.js';
import { supabaseOAuth } from '../../auth/supabase.js';
import type { Platform } from '../../types/index.js';

export async function loginCommand(platformArg?: string): Promise<void> {
  try {
    logger.header('OasisWaker Login');

    const config = await configManager.getConfig();

    let platform: Platform | undefined = platformArg as Platform;

    if (!platform) {
      const availablePlatforms: Platform[] = [];

      if (!config.platforms?.cloudflare?.connected) {
        availablePlatforms.push('cloudflare');
      }
      if (!config.platforms?.vercel?.connected) {
        availablePlatforms.push('vercel');
      }
      if (!config.platforms?.supabase?.connected) {
        availablePlatforms.push('supabase');
      }

      if (availablePlatforms.length === 0) {
        logger.info('All platforms are already connected');
        const { addMore } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'addMore',
            message: 'Do you want to reconnect a platform?',
            default: false,
          },
        ]);

        if (!addMore) {
          return;
        }

        const { selected } = await inquirer.prompt([
          {
            type: 'list',
            name: 'selected',
            message: 'Select a platform to connect:',
            choices: [
              { name: 'Cloudflare', value: 'cloudflare' },
              { name: 'Vercel', value: 'vercel' },
              { name: 'Supabase', value: 'supabase' },
            ],
          },
        ]);
        platform = selected;
      } else {
        const platformLabels = availablePlatforms.map(p => {
          switch (p) {
            case 'cloudflare':
              return { name: 'Cloudflare (Workers + R2)', value: 'cloudflare' as Platform };
            case 'vercel':
              return { name: 'Vercel (Edge Functions + Blob)', value: 'vercel' as Platform };
            case 'supabase':
              return { name: 'Supabase (Database + Storage)', value: 'supabase' as Platform };
          }
        });

        const { selected } = await inquirer.prompt([
          {
            type: 'list',
            name: 'selected',
            message: 'Select a platform to connect:',
            choices: platformLabels,
          },
        ]);
        platform = selected;
      }
    }

    logger.blank();
    logger.subHeader(`Connecting to ${platform}`);
    logger.separator();

    let success = false;

    switch (platform) {
      case 'cloudflare':
        success = await connectCloudflare();
        break;
      case 'vercel':
        success = await connectVercel();
        break;
      case 'supabase':
        success = await connectSupabase();
        break;
    }

    if (success) {
      logger.blank();
      logger.success(`Successfully connected to ${platform}!`);
      logger.info('Run "oasiswaker deploy" to deploy the adapter');
    }
  } catch (error) {
    logger.failSpinner('Login failed');
    logger.error(error as Error);
    process.exit(1);
  }
}

async function connectCloudflare(): Promise<boolean> {
  logger.info('Starting Cloudflare OAuth flow...');

  try {
    const result = await cloudflareOAuth.authorize();
    const tokens = await cloudflareOAuth.exchangeCode(result.code, result.codeVerifier);

    logger.succeedSpinner('Authorization successful');

    logger.startSpinner('Retrieving account information...');

    const accountId = await cloudflareOAuth.getAccountId(tokens.accessToken);

    if (!accountId) {
      logger.error('No Cloudflare account found. Please create a Cloudflare account first.');
      return false;
    }

    const credentials = cloudflareOAuth.toPlatformCredentials(tokens, accountId);
    await configManager.saveCredentials('cloudflare', credentials);

    await configManager.updatePlatform('cloudflare', {
      connected: true,
      accountId,
    });

    logger.succeedSpinner(`Connected to Cloudflare (Account: ${accountId})`);

    return true;
  } catch (error: any) {
    if (error.message?.includes('timeout')) {
      logger.error('OAuth authorization timed out');
    } else {
      logger.error(`Failed to connect to Cloudflare: ${error.message}`);
    }
    return false;
  }
}

async function connectVercel(): Promise<boolean> {
  logger.info('Starting Vercel OAuth flow...');

  try {
    const result = await vercelOAuth.authorize();
    const tokens = await vercelOAuth.exchangeCode(result.code, result.codeVerifier);

    logger.succeedSpinner('Authorization successful');

    logger.startSpinner('Retrieving user information...');

    const user = await vercelOAuth.getUser(tokens.accessToken);
    const teamId = await vercelOAuth.getTeamId(tokens.accessToken);

    const credentials = vercelOAuth.toPlatformCredentials(tokens, teamId || undefined);
    await configManager.saveCredentials('vercel', credentials);

    await configManager.updatePlatform('vercel', {
      connected: true,
      teamId: teamId || undefined,
    });

    const accountLabel = teamId ? `Team: ${teamId}` : `User: ${user.username}`;
    logger.succeedSpinner(`Connected to Vercel (${accountLabel})`);

    return true;
  } catch (error: any) {
    if (error.message?.includes('timeout')) {
      logger.error('OAuth authorization timed out');
    } else {
      logger.error(`Failed to connect to Vercel: ${error.message}`);
    }
    return false;
  }
}

async function connectSupabase(): Promise<boolean> {
  logger.info('Starting Supabase OAuth flow...');

  try {
    const result = await supabaseOAuth.authorize();
    const tokens = await supabaseOAuth.exchangeCode(result.code, result.codeVerifier);

    logger.succeedSpinner('Authorization successful');

    logger.startSpinner('Retrieving project information...');

    const projectRef = await supabaseOAuth.getProjectRef(tokens.accessToken);

    if (!projectRef) {
      logger.error('No Supabase project found. Please create a Supabase project first.');
      return false;
    }

    const credentials = supabaseOAuth.toPlatformCredentials(tokens, projectRef);
    await configManager.saveCredentials('supabase', credentials);

    await configManager.updatePlatform('supabase', {
      connected: true,
      projectRef,
    });

    logger.succeedSpinner(`Connected to Supabase (Project: ${projectRef})`);

    return true;
  } catch (error: any) {
    if (error.message?.includes('timeout')) {
      logger.error('OAuth authorization timed out');
    } else {
      logger.error(`Failed to connect to Supabase: ${error.message}`);
    }
    return false;
  }
}
