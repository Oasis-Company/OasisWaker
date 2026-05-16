import inquirer from 'inquirer';
import { configManager } from '../utils/config.js';
import { logger } from '../utils/logger.js';

export async function initCommand(apiEndpoint?: string): Promise<void> {
  try {
    logger.header('OasisWaker Initialization');

    const existingConfig = await configManager.loadConfig();

    if (existingConfig) {
      logger.warn('OasisWaker is already initialized');
      logger.item('Node ID', existingConfig.nodeId, 'cyan');
      logger.item('API Endpoint', existingConfig.oasisbio.apiEndpoint, 'blue');
      logger.blank();

      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: 'Do you want to reinitialize? This will generate a new Node ID.',
          default: false,
        },
      ]);

      if (!overwrite) {
        logger.info('Initialization cancelled');
        return;
      }
    }

    let endpoint = apiEndpoint;

    if (!endpoint) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'apiEndpoint',
          message: 'Enter OasisBio API endpoint:',
          default: 'https://oasisbio.com',
          validate: (input: string) => {
            try {
              new URL(input);
              return true;
            } catch {
              return 'Please enter a valid URL';
            }
          },
        },
      ]);
      endpoint = answers.apiEndpoint;
    }

    logger.startSpinner('Initializing OasisWaker...');

    const config = await configManager.initialize(endpoint);

    logger.succeedSpinner('OasisWaker initialized successfully');

    logger.blank();
    logger.subHeader('Configuration');
    logger.separator();
    logger.item('Version', config.version, 'cyan');
    logger.item('Node ID', config.nodeId, 'cyan');
    logger.item('Config Path', configManager.getConfigPath(), 'gray');
    logger.item('API Endpoint', config.oasisbio.apiEndpoint, 'blue');

    logger.blank();
    logger.success('OasisWaker is ready to use!');
    logger.info('Run "oasiswaker login" to connect your first platform');
  } catch (error) {
    logger.failSpinner('Initialization failed');
    logger.error(error as Error);
    process.exit(1);
  }
}
