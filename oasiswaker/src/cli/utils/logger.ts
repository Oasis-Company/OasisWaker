import chalk from 'chalk';
import ora, { type Ora } from 'ora';

export type LogLevel = 'debug' | 'info' | 'success' | 'warn' | 'error';

class Logger {
  private verbose: boolean = false;
  private spinner: Ora | null = null;

  setVerbose(verbose: boolean): void {
    this.verbose = verbose;
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.verbose) {
      console.log(chalk.gray(`[DEBUG] ${message}`), ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    console.log(chalk.blue(`[INFO] ${message}`), ...args);
  }

  success(message: string, ...args: unknown[]): void {
    console.log(chalk.green(`✓ ${message}`), ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    console.log(chalk.yellow(`⚠ ${message}`), ...args);
  }

  error(message: string | Error, ...args: unknown[]): void {
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
    this.spinner = ora({
      text: message,
      color: 'cyan',
    }).start();
  }

  succeedSpinner(message: string): void {
    if (this.spinner) {
      this.spinner.succeed(chalk.green(message));
      this.spinner = null;
    } else {
      this.success(message);
    }
  }

  failSpinner(message: string): void {
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

  item(label: string, value: string | number | boolean, color: 'green' | 'yellow' | 'red' | 'cyan' | 'blue' = 'white'): void {
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
