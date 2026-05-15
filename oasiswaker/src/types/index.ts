import { z } from 'zod';

export type Platform = 'cloudflare' | 'vercel' | 'supabase';

export type EndpointStatus = 'active' | 'inactive' | 'error';

export type NodeStatus = 'pending' | 'connecting' | 'connected' | 'deploying' | 'deployed' | 'error' | 'revoked';

export interface PlatformCredentials {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  accountId?: string;
  metadata?: Record<string, unknown>;
}

export interface Endpoint {
  platform: Platform;
  url: string;
  deployedAt: Date;
  status: EndpointStatus;
}

export interface HealthReport {
  nodeId: string;
  platform: Platform;
  storageUsed: number;
  storageAvailable: number;
  requestsProcessed: number;
  uptime: number;
  timestamp: Date;
}

export interface BlockData {
  id: string;
  data: string;
  metadata: {
    type: string;
    shard?: number;
    [key: string]: unknown;
  };
}

export interface BlockResponse {
  success: boolean;
  id: string;
  size?: number;
  timestamp?: string;
  data?: string;
  metadata?: Record<string, unknown>;
}

export interface NodeRegistration {
  nodeId: string;
  platform: Platform;
  endpointUrl: string;
  storageQuota: number;
}

export interface OasisBioConfig {
  apiEndpoint: string;
  apiKey?: string;
}

export interface Config {
  version: string;
  nodeId: string;
  oasisbio: OasisBioConfig;
  platforms: {
    cloudflare?: {
      connected: boolean;
      accountId?: string;
    };
    vercel?: {
      connected: boolean;
      teamId?: string;
    };
    supabase?: {
      connected: boolean;
      projectRef?: string;
    };
  };
  endpoints?: Endpoint[];
}

export const ConfigSchema = z.object({
  version: z.string().default('1.0.0'),
  nodeId: z.string().uuid(),
  oasisbio: z.object({
    apiEndpoint: z.string().url().default('https://oasisbio.com'),
    apiKey: z.string().optional(),
  }),
  platforms: z.object({
    cloudflare: z.object({
      connected: z.boolean(),
      accountId: z.string().optional(),
    }).optional(),
    vercel: z.object({
      connected: z.boolean(),
      teamId: z.string().optional(),
    }).optional(),
    supabase: z.object({
      connected: z.boolean(),
      projectRef: z.string().optional(),
    }).optional(),
  }).optional(),
  endpoints: z.array(z.object({
    platform: z.enum(['cloudflare', 'vercel', 'supabase']),
    url: z.string().url(),
    deployedAt: z.string().datetime(),
    status: z.enum(['active', 'inactive', 'error']),
  })).optional(),
});

export type ValidatedConfig = z.infer<typeof ConfigSchema>;

export interface OAuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
  tokenType?: string;
  scope?: string;
}

export interface CloudflareAccount {
  id: string;
  name: string;
  created_on: string;
}

export interface VercelTeam {
  id: string;
  name: string;
  slug: string;
}

export interface SupabaseProject {
  id: string;
  name: string;
  ref: string;
}

export interface DeployResult {
  platform: Platform;
  success: boolean;
  url?: string;
  error?: string;
}

export interface HealthCheckResult {
  platform: Platform;
  status: EndpointStatus;
  latency?: number;
  error?: string;
  storageUsed?: number;
  storageAvailable?: number;
  requestsProcessed?: number;
}
