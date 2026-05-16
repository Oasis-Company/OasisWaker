import { homedir } from 'os';
import { join } from 'path';
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync, chmodSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import type { Config, PlatformCredentials, Platform, Endpoint, ValidatedConfig } from '../../types/index.js';
import { ConfigSchema } from '../../types/index.js';
import { encrypt, decrypt, generateMasterKey, isEncryptedData } from '../../crypto/encryption.js';

const CONFIG_DIR = join(homedir(), '.oasiswaker');
const CONFIG_FILE = join(CONFIG_DIR, 'config.json');
const CREDENTIALS_DIR = join(CONFIG_DIR, 'credentials');
const ENDPOINTS_FILE = join(CONFIG_DIR, 'endpoints.json');
const MASTER_KEY_FILE = join(CONFIG_DIR, '.master-key');

export class ConfigManager {
  private config: ValidatedConfig | null = null;
  
  private async getMasterKey(): Promise<string> {
    if (existsSync(MASTER_KEY_FILE)) {
      return readFileSync(MASTER_KEY_FILE, 'utf-8');
    }
    
    const masterKey = generateMasterKey();
    if (!existsSync(CONFIG_DIR)) {
      mkdirSync(CONFIG_DIR, { recursive: true });
    }
    writeFileSync(MASTER_KEY_FILE, masterKey, 'utf-8');
    try {
      chmodSync(MASTER_KEY_FILE, 0o600);
    } catch {
    }
    
    return masterKey;
  }
  
  private async migratePlaintextCredentials(
    platform: Platform,
    content: string
  ): Promise<PlatformCredentials | null> {
    try {
      const credentials = JSON.parse(content) as PlatformCredentials;
      await this.saveCredentials(platform, credentials);
      return credentials;
    } catch {
      return null;
    }
  }

  async initialize(apiEndpoint?: string): Promise<ValidatedConfig> {
    if (!existsSync(CONFIG_DIR)) {
      mkdirSync(CONFIG_DIR, { recursive: true });
      mkdirSync(CREDENTIALS_DIR, { recursive: true });
    }

    const nodeId = uuidv4();
    const defaultConfig: Config = {
      version: '1.0.0',
      nodeId,
      oasisbio: {
        apiEndpoint: apiEndpoint || 'https://oasisbio.com',
      },
      platforms: {},
      endpoints: [],
    };

    this.config = ConfigSchema.parse(defaultConfig);
    await this.saveConfig();
    return this.config;
  }

  async loadConfig(): Promise<ValidatedConfig | null> {
    if (!existsSync(CONFIG_FILE)) {
      return null;
    }

    try {
      const content = readFileSync(CONFIG_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      this.config = ConfigSchema.parse(parsed);
      return this.config;
    } catch (error) {
      console.error('Failed to load config:', error);
      return null;
    }
  }

  async getConfig(): Promise<ValidatedConfig> {
    if (!this.config) {
      const loaded = await this.loadConfig();
      if (!loaded) {
        return await this.initialize();
      }
      this.config = loaded;
    }
    return this.config;
  }

  async saveConfig(): Promise<void> {
    if (!this.config) {
      throw new Error('No configuration to save');
    }
    writeFileSync(CONFIG_FILE, JSON.stringify(this.config, null, 2), 'utf-8');
  }

  async updateConfig(updates: Partial<ValidatedConfig>): Promise<ValidatedConfig> {
    const current = await this.getConfig();
    this.config = ConfigSchema.parse({ ...current, ...updates });
    await this.saveConfig();
    return this.config;
  }

  async updatePlatform(platform: Platform, data: { connected?: boolean; accountId?: string; teamId?: string; projectRef?: string }): Promise<ValidatedConfig> {
    const current = await this.getConfig();
    const platforms = current.platforms || {};
    platforms[platform] = {
      ...(platforms[platform] || {}),
      ...data,
    } as any;
    this.config = ConfigSchema.parse({ ...current, platforms });
    await this.saveConfig();
    return this.config;
  }

  async getCredentials(platform: Platform): Promise<PlatformCredentials | null> {
    const credFile = join(CREDENTIALS_DIR, `${platform}.json`);
    if (!existsSync(credFile)) {
      return null;
    }
    try {
      const content = readFileSync(credFile, 'utf-8');
      
      if (!isEncryptedData(content)) {
        const migrated = await this.migratePlaintextCredentials(platform, content);
        return migrated;
      }
      
      const masterKey = await this.getMasterKey();
      const decrypted = decrypt(content, masterKey);
      return JSON.parse(decrypted);
    } catch {
      return null;
    }
  }

  async saveCredentials(platform: Platform, credentials: PlatformCredentials): Promise<void> {
    if (!existsSync(CREDENTIALS_DIR)) {
      mkdirSync(CREDENTIALS_DIR, { recursive: true });
    }
    
    const masterKey = await this.getMasterKey();
    const encrypted = encrypt(JSON.stringify(credentials), masterKey);
    const credFile = join(CREDENTIALS_DIR, `${platform}.json`);
    writeFileSync(credFile, encrypted, 'utf-8');
  }

  async deleteCredentials(platform: Platform): Promise<void> {
    const credFile = join(CREDENTIALS_DIR, `${platform}.json`);
    if (existsSync(credFile)) {
      rmSync(credFile);
    }
  }

  async getEndpoints(): Promise<Endpoint[]> {
    if (!existsSync(ENDPOINTS_FILE)) {
      return [];
    }
    try {
      const content = readFileSync(ENDPOINTS_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      return parsed as Endpoint[];
    } catch {
      return [];
    }
  }

  async saveEndpoints(endpoints: Endpoint[]): Promise<void> {
    if (!existsSync(CONFIG_DIR)) {
      mkdirSync(CONFIG_DIR, { recursive: true });
    }
    writeFileSync(ENDPOINTS_FILE, JSON.stringify(endpoints, null, 2), 'utf-8');
    await this.updateConfig({ endpoints });
  }

  async addEndpoint(endpoint: Endpoint): Promise<void> {
    const endpoints = await this.getEndpoints();
    const existing = endpoints.findIndex(e => e.platform === endpoint.platform);
    if (existing >= 0) {
      endpoints[existing] = endpoint;
    } else {
      endpoints.push(endpoint);
    }
    await this.saveEndpoints(endpoints);
  }

  async removeEndpoint(platform: Platform): Promise<void> {
    const endpoints = await this.getEndpoints();
    const filtered = endpoints.filter(e => e.platform !== platform);
    await this.saveEndpoints(filtered);
  }

  async updateEndpointStatus(platform: Platform, status: Endpoint['status']): Promise<void> {
    const endpoints = await this.getEndpoints();
    const endpoint = endpoints.find(e => e.platform === platform);
    if (endpoint) {
      endpoint.status = status;
      await this.saveEndpoints(endpoints);
    }
  }

  getConfigPath(): string {
    return CONFIG_DIR;
  }

  isInitialized(): boolean {
    return existsSync(CONFIG_FILE);
  }
}

export const configManager = new ConfigManager();
