import { createHash, randomBytes, createCipheriv, createDecipheriv } from 'crypto';
import axios, { type AxiosError } from 'axios';
import open from 'open';
import { listen } from 'http';
import type { OAuthTokens } from '../types/index.js';
import { logger } from '../cli/utils/logger.js';

export interface OAuthConfig {
  authorizationUrl: string;
  tokenUrl: string;
  clientId: string;
  redirectUri: string;
  scope: string;
}

export interface AuthorizationResult {
  code: string;
  state: string;
}

export abstract class BaseOAuthClient {
  protected abstract readonly config: OAuthConfig;
  protected state: string | null = null;
  protected codeVerifier: string | null = null;

  protected generateState(): string {
    return randomBytes(16).toString('hex');
  }

  protected generateCodeVerifier(): string {
    return randomBytes(32).toString('base64url');
  }

  protected async generateCodeChallenge(verifier: string): Promise<string> {
    const hash = createHash('sha256').update(verifier).digest();
    return hash.toString('base64url');
  }

  async getAuthorizationUrl(): Promise<{ url: string; state: string; codeVerifier: string }> {
    this.state = this.generateState();
    this.codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(this.codeVerifier);

    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: this.config.scope,
      state: this.state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    return {
      url: `${this.config.authorizationUrl}?${params.toString()}`,
      state: this.state,
      codeVerifier: this.codeVerifier,
    };
  }

  async waitForCallback(port: number = 3000): Promise<AuthorizationResult> {
    return new Promise((resolve, reject) => {
      const server = listen(port, () => {
        logger.debug(`OAuth callback server listening on port ${port}`);
      });

      const timeout = setTimeout(() => {
        server.close();
        reject(new Error('OAuth callback timeout'));
      }, 10 * 60 * 1000);

      server.on('request', async (req, res) => {
        const url = new URL(req.url || '', `http://localhost:${port}`);
        const code = url.searchParams.get('code');
        const state = url.searchParams.get('state');
        const error = url.searchParams.get('error');

        res.writeHead(200, { 'Content-Type': 'text/html' });

        if (error) {
          res.end('<html><body><h1>Authorization Failed</h1><p>You can close this window.</p></body></html>');
          server.close();
          clearTimeout(timeout);
          reject(new Error(`OAuth error: ${error}`));
          return;
        }

        if (code && state === this.state) {
          res.end('<html><body><h1>Authorization Successful</h1><p>You can close this window.</p></body></html>');
          server.close();
          clearTimeout(timeout);
          resolve({ code, state });
        } else {
          res.end('<html><body><h1>Invalid State</h1><p>Please try again.</p></body></html>');
          server.close();
          clearTimeout(timeout);
          reject(new Error('Invalid state parameter'));
        }
      });
    });
  }

  async authorize(): Promise<AuthorizationResult> {
    const { url } = await this.getAuthorizationUrl();
    logger.info('Opening browser for authorization...');
    await open(url);
    return this.waitForCallback();
  }

  abstract exchangeCode(code: string, codeVerifier: string): Promise<OAuthTokens>;

  async refreshToken(refreshToken: string): Promise<OAuthTokens> {
    try {
      const response = await axios.post(this.config.tokenUrl, new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: this.config.clientId,
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token || refreshToken,
        expiresAt: new Date(Date.now() + response.data.expires_in * 1000),
        tokenType: response.data.token_type,
        scope: response.data.scope,
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      logger.error(`Token refresh failed: ${axiosError.message}`);
      throw error;
    }
  }

  async revokeToken(token: string): Promise<void> {
    try {
      await axios.post(this.config.tokenUrl, new URLSearchParams({
        token,
        client_id: this.config.clientId,
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    } catch (error) {
      logger.warn('Token revocation may have failed (this is often normal)');
    }
  }

  isTokenExpired(tokens: OAuthTokens): boolean {
    if (!tokens.expiresAt) return false;
    return new Date() >= tokens.expiresAt;
  }

  shouldRefreshToken(tokens: OAuthTokens): boolean {
    if (!tokens.expiresAt) return false;
    const buffer = 5 * 60 * 1000;
    return new Date() >= new Date(tokens.expiresAt.getTime() - buffer);
  }
}

export function encryptToken(token: string, key: string): string {
  const iv = randomBytes(16);
  const cipher = createCipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv);
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decryptToken(encrypted: string, key: string): string {
  const [ivHex, authTagHex, encryptedData] = encrypted.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = createDecipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
