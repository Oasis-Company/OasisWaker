import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ConfigManager } from '../../cli/utils/config.js';
import { existsSync, readFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { rmSync, mkdirSync } from 'fs';

const TEST_CONFIG_DIR = join(homedir(), '.oasiswaker-test');
const CONFIG_PATH = join(TEST_CONFIG_DIR, 'config.json');

describe('ConfigManager', () => {
  let configManager: ConfigManager;

  beforeEach(() => {
    if (existsSync(TEST_CONFIG_DIR)) {
      rmSync(TEST_CONFIG_DIR, { recursive: true, force: true });
    }
    mkdirSync(TEST_CONFIG_DIR, { recursive: true });
    
    configManager = new ConfigManager(TEST_CONFIG_DIR);
  });

  afterEach(() => {
    if (existsSync(TEST_CONFIG_DIR)) {
      rmSync(TEST_CONFIG_DIR, { recursive: true, force: true });
    }
  });

  describe('initConfig', () => {
    it('should initialize config with default values', async () => {
      await configManager.initConfig('https://api.oasisbio.com');
      
      const config = await configManager.getConfig();
      expect(config.version).toBe('1.0.0');
      expect(config.oasisbio.apiEndpoint).toBe('https://api.oasisbio.com');
      expect(config.nodeId).toBeDefined();
      expect(typeof config.nodeId).toBe('string');
    });

    it('should generate valid UUID for nodeId', async () => {
      await configManager.initConfig('https://api.oasisbio.com');
      
      const config = await configManager.getConfig();
      expect(config.nodeId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      );
    });
  });

  describe('platform connection', () => {
    it('should set platform as connected', async () => {
      await configManager.initConfig('https://api.oasisbio.com');
      
      await configManager.setPlatformConnection('cloudflare', true, {
        accessToken: 'test-token',
        accountId: 'test-account-id',
      });

      const config = await configManager.getConfig();
      expect(config.platforms?.cloudflare?.connected).toBe(true);
      expect(config.platforms?.cloudflare?.accountId).toBe('test-account-id');
    });

    it('should get and set credentials', async () => {
      await configManager.initConfig('https://api.oasisbio.com');
      
      const testCredentials = {
        accessToken: 'test-token',
        refreshToken: 'test-refresh-token',
        tokenType: 'bearer',
        accountId: 'test-account-id',
        expiresAt: Date.now() + 3600000,
      };

      await configManager.setCredentials('cloudflare', testCredentials);
      
      const credentials = await configManager.getCredentials('cloudflare');
      expect(credentials).toEqual(testCredentials);
    });
  });

  describe('endpoints', () => {
    it('should add and retrieve endpoints', async () => {
      await configManager.initConfig('https://api.oasisbio.com');
      
      const endpoint = {
        platform: 'cloudflare',
        url: 'https://test.worker.dev',
        deployedAt: new Date(),
        status: 'active' as const,
      };

      await configManager.addEndpoint(endpoint);
      
      const endpoints = await configManager.getEndpoints();
      expect(endpoints.length).toBe(1);
      expect(endpoints[0].url).toBe('https://test.worker.dev');
    });

    it('should remove platform endpoint', async () => {
      await configManager.initConfig('https://api.oasisbio.com');
      
      const endpoint = {
        platform: 'cloudflare',
        url: 'https://test.worker.dev',
        deployedAt: new Date(),
        status: 'active' as const,
      };

      await configManager.addEndpoint(endpoint);
      await configManager.removeEndpoint('cloudflare');
      
      const endpoints = await configManager.getEndpoints();
      expect(endpoints.length).toBe(0);
    });
  });
});

