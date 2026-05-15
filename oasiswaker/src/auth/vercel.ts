import axios from 'axios';
import { BaseOAuthClient, type OAuthConfig } from './base.js';
import type { OAuthTokens, PlatformCredentials, VercelTeam } from '../types/index.js';
import { logger } from '../cli/utils/logger.js';

const VERCEL_API = 'https://api.vercel.com';

const vercelOAuthConfig: OAuthConfig = {
  authorizationUrl: 'https://vercel.com/oauth/authorize',
  tokenUrl: 'https://api.vercel.com/v2/oauth/access_token',
  clientId: process.env.VERCEL_CLIENT_ID || 'oasiswaker-cli',
  redirectUri: 'http://localhost:3000/callback',
  scope: 'deployment:read deployment:write edge-function:read edge-function:write',
};

export class VercelOAuth extends BaseOAuthClient {
  protected config = vercelOAuthConfig;

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

  async getTeams(accessToken: string): Promise<VercelTeam[]> {
    try {
      const response = await axios.get(`${VERCEL_API}/v2/teams`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data.teams;
    } catch (error: any) {
      if (error.response?.status === 403) {
        return [];
      }
      logger.error(`Failed to get teams: ${error.message}`);
      throw error;
    }
  }

  async getUser(accessToken: string): Promise<{ id: string; username: string; email: string }> {
    try {
      const response = await axios.get(`${VERCEL_API}/v2/user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data.user;
    } catch (error: any) {
      logger.error(`Failed to get user: ${error.message}`);
      throw error;
    }
  }

  async getTeamId(accessToken: string): Promise<string | null> {
    const teams = await this.getTeams(accessToken);
    if (teams.length === 0) {
      return null;
    }
    if (teams.length === 1) {
      return teams[0].id;
    }
    logger.info('Multiple teams found, using the first one');
    return teams[0].id;
  }

  async verifyCredentials(accessToken: string): Promise<boolean> {
    try {
      await this.getUser(accessToken);
      return true;
    } catch {
      return false;
    }
  }

  async listDeployments(accessToken: string, teamId?: string): Promise<any[]> {
    try {
      const params = teamId ? { teamId } : {};
      const response = await axios.get(`${VERCEL_API}/v13/deployments`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params,
      });
      return response.data.deployments;
    } catch (error: any) {
      logger.error(`Failed to list deployments: ${error.message}`);
      throw error;
    }
  }

  async deleteDeployment(accessToken: string, deploymentId: string, teamId?: string): Promise<boolean> {
    try {
      const url = teamId
        ? `${VERCEL_API}/v13/deployments/${deploymentId}?teamId=${teamId}`
        : `${VERCEL_API}/v13/deployments/${deploymentId}`;

      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return true;
    } catch (error: any) {
      logger.error(`Failed to delete deployment: ${error.message}`);
      return false;
    }
  }

  toPlatformCredentials(tokens: OAuthTokens, teamId?: string): PlatformCredentials {
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt,
      accountId: teamId,
      metadata: {
        scope: tokens.scope,
        tokenType: tokens.tokenType,
      },
    };
  }
}

export const vercelOAuth = new VercelOAuth();
