import { describe, expect, it } from 'vitest';
import { classifyLLMError } from './errors';

describe('classifyLLMError', () => {
  it('detects auth errors', () => {
    expect(classifyLLMError({ message: 'Missing API key', statusCode: 401 }, 'Google').kind).toBe('auth');
  });
  it('detects rate limits', () => {
    const e = classifyLLMError({ message: 'RESOURCE_EXHAUSTED', status: 429 }, 'Google');
    expect(e.kind).toBe('rate_limit');
    expect(e.isRetryable).toBe(true);
  });
  it('gives local hint when local server is down', () => {
    const e = classifyLLMError(new Error('connect ECONNREFUSED 127.0.0.1:11434'), 'Ollama');
    expect(e.kind).toBe('unreachable');
    expect(e.hint).toContain('ollama');
  });
  it('detects context length', () => {
    expect(classifyLLMError(new Error('maximum context length exceeded')).statusCode).toBe(413);
  });
  it('falls back to unknown', () => {
    expect(classifyLLMError(new Error('boom')).kind).toBe('unknown');
  });
});
