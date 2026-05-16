import axios from 'axios';
import { BaseOAuthClient, type OAuthConfig } from './base.js';
import type { OAuthTokens, PlatformCredentials, CloudflareAccount } from '../types/index.js';
import { logger } from '../cli/utils/logger.js';
import { envConfig } from '../config/env.js';

const CLOUDFLARE_API = 'https://api.cloudflare.com';

const cloudflareOAuthConfig: OAuthConfig = {
  authorizationUrl: 'https://dash.cloudflare.com/oauth2/auth',
  tokenUrl: 'https://dash.cloudflare.com/oauth2/token',
  clientId: envConfig.CLOUDFLARE_CLIENT_ID || 'oasiswaker-cli',
  redirectUri: envConfig.CLOUDFLARE_REDIRECT_URI || 'http://localhost:3000/callback',
  scope: 'account:read cloudflare:manage_workers_scripts_edit',
};

export class CloudflareOAuth extends BaseOAuthClient {
  protected config = cloudflareOAuthConfig;

  constructor(clientId?: string, redirectUri?: string) {
    super();
    if (clientId) {
      this.config.clientId = clientId;
    }
    if (redirectUri) {
      this.config.redirectUri = redirectUri;
    }
  }

  async exchangeCode(code: string, codeVerifier: string): Promise<OAuthTokens> {
    try {
      const response = await axios.post(this.config.tokenUrl, new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.config.redirectUri,
        client_id: this.config.clientId,
        code_verifier: codeVerifier,
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresAt: new Date(Date.now() + response.data.expires_in * 1000),
        tokenType: response.data.token_type,
        scope: response.data.scope,
      };
    } catch (error: any) {
      logger.error(`Failed to exchange code: ${error.message}`);
      throw error;
    }
  }

  async getAccounts(accessToken: string): Promise<CloudflareAccount[]> {
    try {
      const response = await axios.get(`${CLOUDFLARE_API}/accounts`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data.result;
    } catch (error: any) {
      logger.error(`Failed to get accounts: ${error.message}`);
      throw error;
    }
  }

  async getAccountId(accessToken: string): Promise<string | null> {
    const accounts = await this.getAccounts(accessToken);
    if (accounts.length === 0) {
      logger.warn('No Cloudflare accounts found');
      return null;
    }
    if (accounts.length === 1) {
      return accounts[0].id;
    }
    logger.info('Multiple accounts found, using the first one');
    return accounts[0].id;
  }

  async verifyCredentials(accessToken: string): Promise<boolean> {
    try {
      await this.getAccounts(accessToken);
      return true;
    } catch {
      return false;
    }
  }

  async getZones(accessToken: string, accountId: string): Promise<any[]> {
    try {
      const response = await axios.get(`${CLOUDFLARE_API}/client/v4/zones`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          account_id: accountId,
        },
      });
      return response.data.result;
    } catch (error: any) {
      logger.error(`Failed to get zones: ${error.message}`);
      throw error;
    }
  }

  toPlatformCredentials(tokens: OAuthTokens, accountId?: string): PlatformCredentials {
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt,
      accountId,
      metadata: {
        scope: tokens.scope,
        tokenType: tokens.tokenType,
      },
    };
  }
}

export const cloudflareOAuth = new CloudflareOAuth();
