import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';

const MEMORY_URL = 'http://127.0.0.1:8094/api/everywhere';

export async function loader({ request }: LoaderFunctionArgs) {
  const incoming = new URL(request.url);
  const target = new URL(MEMORY_URL);
  const source = incoming.searchParams.get('source') || '';
  const q = incoming.searchParams.get('q') || incoming.searchParams.get('query') || '';
  const limit = incoming.searchParams.get('limit') || '40';

  if (source) {
    target.searchParams.set('source', source);
  }

  if (q) {
    target.searchParams.set('q', q);
  }

  target.searchParams.set('limit', limit);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2500);

  try {
    const response = await fetch(target.toString(), { signal: controller.signal });
    const payload = await response.json();
    return json(payload);
  } catch (error: any) {
    return json({
      sources: [],
      items: [],
      total: 0,
      shown: 0,
      error: 'Zoth Memory is offline on 127.0.0.1:8094',
      detail: error?.message || String(error),
    });
  } finally {
    clearTimeout(timer);
  }
}
