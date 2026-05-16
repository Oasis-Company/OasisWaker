import { homedir } from 'os';
import { join } from 'path';
import { config } from 'dotenv';

export interface EnvConfig {
  CLOUDFLARE_CLIENT_ID?: string;
  CLOUDFLARE_REDIRECT_URI?: string;
  VERCELL_CLIENT_ID?: string;
  VERCELL_REDIRECT_URI?: string;
  SUPABASE_CLIENT_ID?: string;
  SUPABASE_REDIRECT_URI?: string;
  OASISBIO_API_ENDPOINT?: string;
}

export function loadEnvConfig(): EnvConfig {
  const projectRoot = process.cwd();
  const userConfigDir = join(homedir(), '.oasiswaker');
  
  config({ path: join(projectRoot, '.env'), override: true });
  config({ path: join(userConfigDir, '.env'), override: true });
  
  return {
    CLOUDFLARE_CLIENT_ID: process.env.CLOUDFLARE_CLIENT_ID,
    CLOUDFLARE_REDIRECT_URI: process.env.CLOUDFLARE_REDIRECT_URI,
    VERCELL_CLIENT_ID: process.env.VERCELL_CLIENT_ID,
    VERCELL_REDIRECT_URI: process.env.VERCELL_REDIRECT_URI,
    SUPABASE_CLIENT_ID: process.env.SUPABASE_CLIENT_ID,
    SUPABASE_REDIRECT_URI: process.env.SUPABASE_REDIRECT_URI,
    OASISBIO_API_ENDPOINT: process.env.OASISBIO_API_ENDPOINT,
  };
}

export const envConfig = loadEnvConfig();
