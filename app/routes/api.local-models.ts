import { json, type LoaderFunctionArgs } from '@remix-run/cloudflare';
import { detectLocalServers } from '~/lib/modules/llm/local-detect';

/**
 * GET /api/local-models — auto-detect running local model servers and their models.
 */
export async function loader({ context }: LoaderFunctionArgs) {
  const cfEnv = ((context as any)?.cloudflare?.env || {}) as Record<string, string | undefined>;
  const env = { ...process.env, ...cfEnv };
  const servers = await detectLocalServers(env);
  const online = servers.filter((s) => s.online);

  return json({
    servers,
    online: online.length,
    recommended: online.find((s) => s.models.length > 0) || null,
  });
}
