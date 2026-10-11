/**
 * ZOTHOS WebGen — auto-detect local model servers (Ollama, LM Studio, llama.cpp, vLLM, Zoth Local).
 */
export interface LocalServerCandidate {
  id: string;
  label: string;
  provider: string;
  baseUrl: string;
  modelsPath: string;
  format: 'ollama' | 'openai';
}

export interface DetectedLocalServer {
  id: string;
  label: string;
  provider: string;
  baseUrl: string;
  online: boolean;
  latencyMs?: number;
  models: string[];
  error?: string;
}

export function getLocalCandidates(env: Record<string, string | undefined> = {}): LocalServerCandidate[] {
  const ollama = (env.OLLAMA_API_BASE_URL || 'http://127.0.0.1:11434').replace(/\/+$/, '');
  const lmstudio = (env.LMSTUDIO_API_BASE_URL || 'http://127.0.0.1:1234').replace(/\/+$/, '');

  const list: LocalServerCandidate[] = [
    { id: 'ollama', label: 'Ollama', provider: 'Ollama', baseUrl: ollama, modelsPath: '/api/tags', format: 'ollama' },
    {
      id: 'lmstudio',
      label: 'LM Studio',
      provider: 'LMStudio',
      baseUrl: lmstudio,
      modelsPath: '/v1/models',
      format: 'openai',
    },
    {
      id: 'llamacpp',
      label: 'llama.cpp server',
      provider: 'OpenAILike',
      baseUrl: 'http://127.0.0.1:8080',
      modelsPath: '/v1/models',
      format: 'openai',
    },
    {
      id: 'vllm',
      label: 'vLLM',
      provider: 'OpenAILike',
      baseUrl: 'http://127.0.0.1:8000',
      modelsPath: '/v1/models',
      format: 'openai',
    },
  ];

  if (env.ZOTH_LOCAL_API_BASE_URL) {
    list.unshift({
      id: 'zoth-local',
      label: 'Zoth Local Engine',
      provider: 'ZothLocal',
      baseUrl: env.ZOTH_LOCAL_API_BASE_URL.replace(/\/+$/, '').replace(/\/v1$/, ''),
      modelsPath: '/v1/models',
      format: 'openai',
    });
  }

  return list;
}

export function parseModelList(format: 'ollama' | 'openai', data: any): string[] {
  if (format === 'ollama') {
    return Array.isArray(data?.models) ? data.models.map((m: any) => String(m?.name || m?.model)).filter(Boolean) : [];
  }

  return Array.isArray(data?.data) ? data.data.map((m: any) => String(m?.id)).filter(Boolean) : [];
}

export async function probeLocalServer(
  candidate: LocalServerCandidate,
  timeoutMs = 1500,
  fetchImpl: typeof fetch = fetch,
): Promise<DetectedLocalServer> {
  const start = Date.now();
  const base = { id: candidate.id, label: candidate.label, provider: candidate.provider, baseUrl: candidate.baseUrl };

  try {
    const res = await fetchImpl(candidate.baseUrl + candidate.modelsPath, { signal: AbortSignal.timeout(timeoutMs) });

    if (!res.ok) {
      return { ...base, online: false, models: [], error: `HTTP ${res.status}` };
    }

    const models = parseModelList(candidate.format, await res.json());

    return { ...base, online: true, latencyMs: Date.now() - start, models };
  } catch (error: any) {
    return { ...base, online: false, models: [], error: error?.name === 'TimeoutError' ? 'timeout' : 'offline' };
  }
}

export async function detectLocalServers(
  env: Record<string, string | undefined> = {},
  fetchImpl: typeof fetch = fetch,
): Promise<DetectedLocalServer[]> {
  return Promise.all(getLocalCandidates(env).map((c) => probeLocalServer(c, 1500, fetchImpl)));
}
