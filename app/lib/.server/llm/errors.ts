/**
 * ZOTHOS WebGen — classify LLM/provider failures into actionable, user-facing errors.
 */
export interface ClassifiedLLMError {
  message: string;
  statusCode: number;
  isRetryable: boolean;
  kind: 'auth' | 'rate_limit' | 'timeout' | 'unreachable' | 'context_length' | 'model_not_found' | 'unknown';
  hint?: string;
}

const LOCAL_PROVIDERS = ['ZothLocal', 'Ollama', 'LMStudio', 'OpenAILike'];

export function classifyLLMError(error: any, provider?: string): ClassifiedLLMError {
  const raw = String(error?.message || error || 'An unexpected error occurred');
  const msg = raw.toLowerCase();
  const status = Number(error?.statusCode || error?.status || error?.response?.status) || 0;
  const isLocal = provider ? LOCAL_PROVIDERS.includes(provider) : false;

  if (status === 401 || status === 403 || /api key|unauthorized|invalid x-api-key|permission denied/.test(msg)) {
    return {
      kind: 'auth',
      statusCode: 401,
      isRetryable: false,
      message: 'Invalid or missing API key',
      hint: `Check the ${provider || 'provider'} API key in Settings → Providers or .env.local.`,
    };
  }

  if (status === 429 || /rate limit|too many requests|quota|resource_exhausted/.test(msg)) {
    return {
      kind: 'rate_limit',
      statusCode: 429,
      isRetryable: true,
      message: `${provider || 'Provider'} rate limit or quota reached`,
      hint: 'Wait a moment, or switch engines with the Fast Engine Switcher.',
    };
  }

  if (/context length|maximum context|too many tokens|token limit|prompt is too long/.test(msg)) {
    return {
      kind: 'context_length',
      statusCode: 413,
      isRetryable: false,
      message: 'The conversation is too long for this model',
      hint: 'Enable context optimization, start a new chat, or pick a model with a larger context window.',
    };
  }

  if (/timed out|timeout|etimedout|aborted due to timeout/.test(msg)) {
    return {
      kind: 'timeout',
      statusCode: 504,
      isRetryable: true,
      message: `${provider || 'Provider'} timed out`,
      hint: isLocal ? 'Local models can be slow on first load; try again once the model is warm.' : undefined,
    };
  }

  if (/econnrefused|enotfound|fetch failed|network error|socket hang up|connect econn/.test(msg)) {
    return {
      kind: 'unreachable',
      statusCode: 502,
      isRetryable: true,
      message: `Could not reach ${provider || 'the provider'}`,
      hint: isLocal
        ? 'Start your local model server (e.g. `ollama serve`) and check the base URL in Settings.'
        : 'Check your network connection.',
    };
  }

  if (status === 404 || /model .*not found|no models found|does not exist|unknown model/.test(msg)) {
    return {
      kind: 'model_not_found',
      statusCode: 404,
      isRetryable: false,
      message: raw,
      hint: 'Pick another model from the model selector.',
    };
  }

  return {
    kind: 'unknown',
    statusCode: status >= 400 && status < 600 ? status : 500,
    isRetryable: error?.isRetryable !== false,
    message: raw,
  };
}
