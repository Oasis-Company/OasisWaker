export class OasisWakerError extends Error {
  public readonly code: string;
  public readonly suggestions?: string[];
  public readonly cause?: Error;

  constructor(message: string, options: {
    code?: string;
    suggestions?: string[];
    cause?: Error;
  } = {}) {
    super(message);
    this.name = 'OasisWakerError';
    this.code = options.code || 'UNKNOWN_ERROR';
    this.suggestions = options.suggestions;
    this.cause = options.cause;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class AuthenticationError extends OasisWakerError {
  constructor(message: string, options?: { cause?: Error; suggestions?: string[] }) {
    super(message, {
      code: 'AUTHENTICATION_ERROR',
      suggestions: options?.suggestions || ['Check your credentials', 'Try logging in again'],
      cause: options?.cause,
    });
    this.name = 'AuthenticationError';
  }
}

export class ConfigurationError extends OasisWakerError {
  constructor(message: string, options?: { cause?: Error; suggestions?: string[] }) {
    super(message, {
      code: 'CONFIGURATION_ERROR',
      suggestions: options?.suggestions || ['Run `oasiswaker init` to reinitialize configuration'],
      cause: options?.cause,
    });
    this.name = 'ConfigurationError';
  }
}

export class DeploymentError extends OasisWakerError {
  constructor(message: string, options?: { cause?: Error; suggestions?: string[] }) {
    super(message, {
      code: 'DEPLOYMENT_ERROR',
      suggestions: options?.suggestions || ['Check your platform credentials', 'Try again later'],
      cause: options?.cause,
    });
    this.name = 'DeploymentError';
  }
}
