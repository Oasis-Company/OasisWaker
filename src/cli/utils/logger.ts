import chalk from 'chalk';
import ora, { type Ora } from 'ora';
import { mkdirSync, appendFileSync, existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const LOG_DIR = join(homedir(), '.oasiswaker', 'logs');

export type LogLevel = 'debug' | 'info' | 'success' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  args?: unknown[];
}

class Logger {
  private verbose: boolean = false;
  private spinner: Ora | null = null;
  private logToFile: boolean = true;
  private logFilePath: string;

  constructor() {
    const date = new Date().toISOString().split('T')[0];
    this.logFilePath = join(LOG_DIR, `oasiswaker-${date}.log`);
    this.ensureLogDir();
  }

  private ensureLogDir(): void {
    try {
      if (!existsSync(LOG_DIR)) {
        mkdirSync(LOG_DIR, { recursive: true, mode: 0o700 });
      }
    } catch (error) {
      this.logToFile = false;
    }
  }

  private writeToLog(entry: LogEntry): void {
    if (!this.logToFile) return;
    
    try {
      const logLine = JSON.stringify(entry) + '\n';
      appendFileSync(this.logFilePath, logLine, { mode: 0o600 });
    } catch (error) {
      this.logToFile = false;
    }
  }

  setVerbose(verbose: boolean): void {
    this.verbose = verbose;
  }

  getVerbose(): boolean {
    return this.verbose;
  }

  debug(message: string, ...args: unknown[]): void {
    this.writeToLog({
      timestamp: new Date().toISOString(),
      level: 'debug',
      message,
      args,
    });
    
    if (this.verbose) {
      console.log(chalk.gray(`[DEBUG] ${message}`), ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    this.writeToLog({
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      args,
    });
    
    console.log(chalk.blue(`[INFO] ${message}`), ...args);
  }

  success(message: string, ...args: unknown[]): void {
    this.writeToLog({
      timestamp: new Date().toISOString(),
      level: 'success',
      message,
      args,
    });
    
    console.log(chalk.green(`✓ ${message}`), ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    this.writeToLog({
      timestamp: new Date().toISOString(),
      level: 'warn',
      message,
      args,
    });
    
    console.log(chalk.yellow(`⚠ ${message}`), ...args);
  }

  error(message: string | Error, ...args: unknown[]): void {
    const errorMessage = message instanceof Error ? message.message : message;
    this.writeToLog({
      timestamp: new Date().toISOString(),
      level: 'error',
      message: errorMessage,
      args,
    });
    
    if (message instanceof Error) {
      console.error(chalk.red(`✗ ${message.message}`), ...args);
      if (this.verbose && message.stack) {
        console.error(chalk.gray(message.stack));
      }
    } else {
      console.error(chalk.red(`✗ ${message}`), ...args);
    }
  }

  startSpinner(message: string): void {
    this.debug(`Starting spinner: ${message}`);
    this.spinner = ora({
      text: message,
      color: 'cyan',
    }).start();
  }

  succeedSpinner(message: string): void {
    this.success(message);
    if (this.spinner) {
      this.spinner.succeed(chalk.green(message));
      this.spinner = null;
    } else {
      this.success(message);
    }
  }

  failSpinner(message: string): void {
    this.error(message);
    if (this.spinner) {
      this.spinner.fail(chalk.red(message));
      this.spinner = null;
    } else {
      this.error(message);
    }
  }

  stopSpinner(): void {
    if (this.spinner) {
      this.spinner.stop();
      this.spinner = null;
    }
  }

  log(message: string): void {
    console.log(message);
  }

  blank(): void {
    console.log();
  }

  separator(): void {
    console.log(chalk.gray('─'.repeat(50)));
  }

  header(text: string): void {
    this.blank();
    console.log(chalk.bold.cyan(`━━━ ${text} ━━━`));
    this.blank();
  }

  subHeader(text: string): void {
    this.blank();
    console.log(chalk.bold(text));
  }

  item(label: string, value: string | number | boolean, color: 'green' | 'yellow' | 'red' | 'cyan' | 'blue' | 'white' = 'white'): void {
    const coloredLabel = chalk.gray(`${label}:`);
    const coloredValue = (chalk as any)[color](String(value));
    console.log(`  ${coloredLabel} ${coloredValue}`);
  }

  statusItem(platform: string, status: 'connected' | 'disconnected' | 'error' | 'deployed'): void {
    const statusColors: Record<string, chalk.Chalk> = {
      connected: chalk.green,
      deployed: chalk.green,
      disconnected: chalk.gray,
      error: chalk.red,
    };
    const statusText: Record<string, string> = {
      connected: '● Connected',
      deployed: '● Deployed',
      disconnected: '○ Not Connected',
      error: '✗ Error',
    };
    const platformColor = chalk.cyan(platform);
    const statusColor = statusColors[status] || chalk.gray;
    console.log(`  ${platformColor}: ${statusColor(statusText[status])}`);
  }
}

export const logger = new Logger();
