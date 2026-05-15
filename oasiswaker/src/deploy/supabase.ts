import axios from 'axios';
import type { DeployResult } from '../types/index.js';
import { logger } from '../cli/utils/logger.js';

const SUPABASE_API = 'https://api.supabase.com/v1';
const SUPABASE_FUNCTIONS_API = 'https://<project-ref>.supabase.co/functions/v1';

export class SupabaseDeployer {
  private accessToken: string;
  private projectRef: string;
  private functionName: string = 'oasiswaker-adapter';

  constructor(accessToken: string, projectRef: string) {
    this.accessToken = accessToken;
    this.projectRef = projectRef;
  }

  setFunctionName(name: string): void {
    this.functionName = name;
  }

  async deploy(): Promise<DeployResult> {
    const tempDir = '/tmp/oasiswaker-supabase';

    try {
      logger.startSpinner('Preparing Supabase Edge Function adapter...');

      const edgeFunctionCode = this.generateEdgeFunctionCode();

      logger.succeedSpinner('Edge Function code generated');

      logger.startSpinner('Deploying to Supabase...');

      const response = await axios.post(
        `${SUPABASE_API}/projects/${this.projectRef}/functions/import`,
        {
          name: this.functionName,
          body: edgeFunctionCode,
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const functionUrl = `https://${this.projectRef}.supabase.co/functions/v1/${this.functionName}`;

      logger.succeedSpinner('Supabase Edge Function deployed successfully');

      return {
        platform: 'supabase',
        success: true,
        url: functionUrl,
      };
    } catch (error: any) {
      logger.failSpinner('Failed to deploy to Supabase');
      logger.error(`Deployment error: ${error.message}`);

      if (error.response?.data) {
        logger.debug('Response data:', error.response.data);
      }

      return {
        platform: 'supabase',
        success: false,
        error: error.message,
      };
    }
  }

  async deleteFunction(): Promise<boolean> {
    try {
      logger.startSpinner('Deleting Supabase Edge Function...');

      await axios.delete(`${SUPABASE_API}/projects/${this.projectRef}/functions/${this.functionName}`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      logger.succeedSpinner('Supabase Edge Function deleted');
      return true;
    } catch (error: any) {
      if (error.response?.status === 404) {
        logger.info('No active OasisWaker function found');
        return true;
      }
      logger.failSpinner('Failed to delete Supabase Edge Function');
      logger.error(error.message);
      return false;
    }
  }

  async healthCheck(url: string): Promise<{ status: 'active' | 'inactive' | 'error'; latency?: number }> {
    const startTime = Date.now();
    try {
      const response = await axios.get(`${url}/health`, {
        timeout: 5000,
      });
      const latency = Date.now() - startTime;
      return {
        status: response.status === 200 ? 'active' : 'error',
        latency,
      };
    } catch {
      return {
        status: 'error',
      };
    }
  }

  private generateEdgeFunctionCode(): string {
    return `import { serve } from 'https://esm.sh/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, X-Oasis-Secret',
};

interface BlockRequest {
  id: string;
  data: string;
  metadata?: Record<string, unknown>;
}

interface ReportRequest {
  nodeId: string;
  platform: string;
  storageUsed: number;
  storageAvailable: number;
  requestsProcessed: number;
  uptime: number;
  timestamp: string;
}

const verifySecret = (request: Request): boolean => {
  const secret = request.headers.get('X-Oasis-Secret');
  return secret === Deno.env.get('OASIS_SECRET');
};

const getStorageClient = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') || '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  );
};

const handleBlockPut = async (request: Request): Promise<Response> => {
  if (!verifySecret(request)) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const body: BlockRequest = await request.json();

    if (!body.id || !body.data) {
      return new Response(JSON.stringify({ error: 'Missing id or data' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = getStorageClient();
    const bucketName = 'oasis-blocks';

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(body.id, body.data, {
        contentType: 'application/octet-stream',
        metadata: body.metadata,
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return new Response(JSON.stringify({ error: 'Failed to store block' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      id: body.id,
      size: body.data.length,
      timestamp: new Date().toISOString(),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Block put error:', error);
    return new Response(JSON.stringify({ error: 'Failed to store block' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

const handleBlockGet = async (request: Request): Promise<Response> => {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();

  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing block id' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const supabase = getStorageClient();
    const bucketName = 'oasis-blocks';

    const { data, error } = await supabase.storage
      .from(bucketName)
      .download(id);

    if (error || !data) {
      return new Response(JSON.stringify({ error: 'Block not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const text = await data.text();
    const metadata = data.metaData;

    return new Response(JSON.stringify({
      id,
      data: text,
      metadata,
      timestamp: metadata?.createdAt || new Date().toISOString(),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Block not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

const handleBlockDelete = async (request: Request): Promise<Response> => {
  if (!verifySecret(request)) {
    return new Response('Unauthorized', { status: 401 });
  }

  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();

  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing block id' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const supabase = getStorageClient();
    const bucketName = 'oasis-blocks';

    const { error } = await supabase.storage
      .from(bucketName)
      .remove([id]);

    if (error) {
      return new Response(JSON.stringify({ error: 'Failed to delete block' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete block' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

const handleReport = async (request: Request): Promise<Response> => {
  try {
    const body: ReportRequest = await request.json();
    console.log('Health report received:', JSON.stringify(body));

    return new Response(JSON.stringify({ received: true, timestamp: new Date().toISOString() }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to process report' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

const handleHealth = (): Response => {
  return new Response(JSON.stringify({
    status: 'ok',
    platform: 'supabase',
    timestamp: new Date().toISOString(),
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
};

serve(async (req) => {
  const url = new URL(req.url);
  const path = url.pathname;

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (path === '/health' && req.method === 'GET') {
    return handleHealth();
  }

  if (path === '/block' && req.method === 'PUT') {
    return handleBlockPut(req);
  }

  if (path.startsWith('/block/') && req.method === 'GET') {
    return handleBlockGet(req);
  }

  if (path.startsWith('/block/') && req.method === 'DELETE') {
    return handleBlockDelete(req);
  }

  if (path === '/report' && req.method === 'POST') {
    return handleReport(req);
  }

  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
`;
  }
}
