#!/usr/bin/env node

import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { loginCommand } from './commands/login.js';
import { deployCommand } from './commands/deploy.js';
import { statusCommand } from './commands/status.js';
import { revokeCommand } from './commands/revoke.js';
import { logger } from './utils/logger.js';
import { OasisWakerError } from '../errors/index.js';

const program = new Command();

function setupErrorHandlers() {
  process.on('uncaughtException', (error) => {
    handleError(error);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    handleError(reason);
    process.exit(1);
  });
}

function handleError(error: unknown) {
  const err = error instanceof Error ? error : new Error(String(error));
  
  if (err instanceof OasisWakerError) {
    logger.error(err.message);
    if (err.suggestions && err.suggestions.length > 0) {
      logger.info('Suggestions:');
      err.suggestions.forEach(suggestion => {
        logger.info(`  - ${suggestion}`);
      });
    }
    if (err.cause) {
      logger.debug('Cause:', err.cause);
    }
  } else {
    logger.error('An unexpected error occurred');
    if (logger.getVerbose()) {
      logger.error(err);
    }
  }
}

function wrapAsyncAction(fn: (...args: any[]) => Promise<void>) {
  return async (...args: any[]) => {
    try {
      await fn(...args);
    } catch (error) {
      handleError(error);
      process.exit(1);
    }
  };
}

program
  .name('oasiswaker')
  .description('CLI tool for contributing Cloudflare, Vercel, and Supabase resources to OasisBio decentralized network')
  .version('1.0.0')
  .option('-v, --verbose', 'Enable verbose logging')
  .hook('preAction', (thisCommand) => {
    const opts = thisCommand.opts();
    if (opts.verbose) {
      logger.setVerbose(true);
    }
  });

program
  .command('init')
  .description('Initialize OasisWaker configuration')
  .option('-e, --endpoint <url>', 'OasisBio API endpoint URL')
  .action(wrapAsyncAction(async (options) => {
    await initCommand(options.endpoint);
  }));

program
  .command('login')
  .description('Connect a cloud platform (Cloudflare, Vercel, or Supabase)')
  .argument('[platform]', 'Platform to connect (cloudflare, vercel, or supabase)')
  .action(wrapAsyncAction(async (platform) => {
    await loginCommand(platform);
  }));

program
  .command('deploy')
  .description('Deploy adapters to connected platforms')
  .argument('[platform]', 'Platform to deploy (cloudflare, vercel, or supabase)')
  .action(wrapAsyncAction(async (platform) => {
    await deployCommand(platform);
  }));

program
  .command('status')
  .description('Display status of connected platforms and deployed adapters')
  .action(wrapAsyncAction(async () => {
    await statusCommand();
  }));

program
  .command('revoke')
  .description('Revoke access and remove deployed adapters from a platform')
  .argument('[platform]', 'Platform to revoke (cloudflare, vercel, or supabase)')
  .action(wrapAsyncAction(async (platform) => {
    await revokeCommand(platform);
  }));

program
  .command('help')
  .description('Display help information')
  .alias('h')
  .action(() => {
    program.help();
  });

program.on('command:*', () => {
  console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
  process.exit(1);
});

setupErrorHandlers();
program.parse(process.argv);

const NO_COMMAND_SPECIFIED = program.args.length === 0;

if (NO_COMMAND_SPECIFIED) {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   ██████╗██╗   ██╗██████╗ ███████╗██████╗ ████████╗      ║
║  ██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔══██╗╚══██╔══╝      ║
║  ██║      ╚████╔╝ ██████╔╝█████╗  ██████╔╝   ██║         ║
║  ██║       ╚██╔╝  ██╔═══╝ ██╔══╝  ██╔══██╗   ██║         ║
║  ╚██████╗   ██║   ██║     ███████╗██║  ██║   ██║         ║
║   ╚═════╝   ╚═╝   ╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝         ║
║                                                           ║
║   Your cloud, the network.                               ║
║   Contribute. Connect. Decentralize.                      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

Welcome to OasisWaker v${program.version()}

Quick Start:
  oasiswaker init         Initialize configuration
  oasiswaker login        Connect a platform
  oasiswaker deploy       Deploy adapters
  oasiswaker status       Check status
  oasiswaker revoke       Remove adapters

For more information, run: oasiswaker --help
`);
}
