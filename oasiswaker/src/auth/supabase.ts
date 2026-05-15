import axios from 'axios';
import { BaseOAuthClient, type OAuthConfig } from './base.js';
import type { OAuthTokens, PlatformCredentials, SupabaseProject } from '../types/index.js';
import { logger } from '../cli/utils/logger.js';

const SUPABASE_API = 'https://api.supabase.com';

const supabaseOAuthConfig: OAuthConfig = {
  authorizationUrl: 'https://app.supabase.com/authorize',
  tokenUrl: 'https://api.supabase.com/v1/token',
  clientId: process.env.SUPABASE_CLIENT_ID || 'oasiswaker-cli',
  redirectUri: 'http://localhost:3000/callback',
  scope: 'storage admin',
};

export class SupabaseOAuth extends BaseOAuthClient {
  protected config = supabaseOAuthConfig;

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
      const response = await axios.post(this.config.tokenUrl, {
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.config.redirectUri,
        client_id: this.config.clientId,
        code_verifier: codeVerifier,
      }, {
        headers: {
          'Content-Type': 'application/json',
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

  async getProjects(accessToken: string): Promise<SupabaseProject[]> {
    try {
      const response = await axios.get(`${SUPABASE_API}/v1/projects`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error: any) {
      logger.error(`Failed to get projects: ${error.message}`);
      throw error;
    }
  }

  async getProjectRef(accessToken: string): Promise<string | null> {
    const projects = await this.getProjects(accessToken);
    if (projects.length === 0) {
      logger.warn('No Supabase projects found');
      return null;
    }
    if (projects.length === 1) {
      return projects[0].ref;
    }
    logger.info('Multiple projects found, using the first one');
    return projects[0].ref;
  }

  async verifyCredentials(accessToken: string): Promise<boolean> {
    try {
      await this.getProjects(accessToken);
      return true;
    } catch {
      return false;
    }
  }

  async getStorageBuckets(accessToken: string, projectRef: string): Promise<any[]> {
    try {
      const response = await axios.get(`${SUPABASE_API}/v1/projects/${projectRef}/storage/buckets`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error: any) {
      logger.error(`Failed to get storage buckets: ${error.message}`);
      throw error;
    }
  }

  async createStorageBucket(accessToken: string, projectRef: string, name: string, isPublic: boolean = true): Promise<boolean> {
    try {
      await axios.post(`${SUPABASE_API}/v1/projects/${projectRef}/storage/buckets`, {
        id: name,
        name: name,
        public: isPublic,
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      return true;
    } catch (error: any) {
      if (error.response?.status === 409) {
        logger.info(`Storage bucket '${name}' already exists`);
        return true;
      }
      logger.error(`Failed to create storage bucket: ${error.message}`);
      return false;
    }
  }

  toPlatformCredentials(tokens: OAuthTokens, projectRef?: string): PlatformCredentials {
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt,
      accountId: projectRef,
      metadata: {
        scope: tokens.scope,
        tokenType: tokens.tokenType,
      },
    };
  }
}

export const supabaseOAuth = new SupabaseOAuth();
