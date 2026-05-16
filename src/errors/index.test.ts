import { describe, it, expect } from 'vitest';
import { OasisWakerError, AuthenticationError, ConfigurationError, DeploymentError } from '../errors/index.js';

describe('Errors', () => {
  describe('OasisWakerError', () => {
    it('should create an error with basic properties', () => {
      const error = new OasisWakerError('Test error');
      expect(error.message).toBe('Test error');
      expect(error.name).toBe('OasisWakerError');
      expect(error.code).toBe('UNKNOWN_ERROR');
    });

    it('should accept custom code and suggestions', () => {
      const suggestions = ['Try again', 'Contact support'];
      const error = new OasisWakerError('Test error', {
        code: 'CUSTOM_ERROR',
        suggestions,
      });
      expect(error.code).toBe('CUSTOM_ERROR');
      expect(error.suggestions).toEqual(suggestions);
    });
  });

  describe('AuthenticationError', () => {
    it('should have correct default properties', () => {
      const error = new AuthenticationError('Auth failed');
      expect(error.name).toBe('AuthenticationError');
      expect(error.code).toBe('AUTHENTICATION_ERROR');
      expect(error.suggestions).toEqual(expect.arrayContaining(['Check your credentials']));
    });
  });

  describe('ConfigurationError', () => {
    it('should have correct default properties', () => {
      const error = new ConfigurationError('Config error');
      expect(error.name).toBe('ConfigurationError');
      expect(error.code).toBe('CONFIGURATION_ERROR');
    });
  });

  describe('DeploymentError', () => {
    it('should have correct default properties', () => {
      const error = new DeploymentError('Deployment failed');
      expect(error.name).toBe('DeploymentError');
      expect(error.code).toBe('DEPLOYMENT_ERROR');
    });
  });
});
