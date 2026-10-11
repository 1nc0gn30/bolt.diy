import { describe, expect, it } from 'vitest';
import { detectLocalServers, getLocalCandidates, parseModelList } from './local-detect';

describe('local-detect', () => {
  it('parses ollama and openai model lists', () => {
    expect(parseModelList('ollama', { models: [{ name: 'qwen2.5-coder:7b' }] })).toEqual(['qwen2.5-coder:7b']);
    expect(parseModelList('openai', { data: [{ id: 'local-model' }] })).toEqual(['local-model']);
    expect(parseModelList('openai', null)).toEqual([]);
  });

  it('adds zoth-local when configured', () => {
    expect(getLocalCandidates({ ZOTH_LOCAL_API_BASE_URL: 'http://127.0.0.1:9000/v1' })[0].baseUrl).toBe(
      'http://127.0.0.1:9000',
    );
  });

  it('reports online and offline servers', async () => {
    const fakeFetch = (async (url: string) => {
      if (url.includes('11434')) {
        return new Response(JSON.stringify({ models: [{ name: 'llama3' }] }), { status: 200 });
      }

      throw new Error('ECONNREFUSED');
    }) as unknown as typeof fetch;

    const result = await detectLocalServers({}, fakeFetch);
    expect(result.find((r) => r.id === 'ollama')).toMatchObject({ online: true, models: ['llama3'] });
    expect(result.find((r) => r.id === 'vllm')?.online).toBe(false);
  });
});
