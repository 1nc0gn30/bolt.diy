import { createOpenAI } from '@ai-sdk/openai';
import type { LanguageModelV1, LanguageModelV1CallOptions, LanguageModelV1StreamPart } from 'ai';
import { BaseProvider } from '~/lib/modules/llm/base-provider';
import type { ModelInfo } from '~/lib/modules/llm/types';
import type { IProviderSetting } from '~/types/model';
import { logger } from '~/utils/logger';

async function getSpawn() {
  if (typeof window !== 'undefined') {
    throw new Error('Local CLI execution is only supported server-side.');
  }

  const modName = 'child_process';
  const { spawn } = await import(/* @vite-ignore */ modName);

  return spawn;
}

function formatPromptForCli(prompt: any[]): string {
  let formatted = '';

  for (const msg of prompt) {
    if (msg.role === 'system') {
      formatted += `[SYSTEM INSTRUCTION]\n${msg.content}\n\n`;
    } else if (msg.role === 'user') {
      const text = Array.isArray(msg.content)
        ? msg.content.map((c: any) => c.text || '').join('\n')
        : String(msg.content || '');
      formatted += `[USER]\n${text}\n\n`;
    } else if (msg.role === 'assistant') {
      const text = Array.isArray(msg.content)
        ? msg.content.map((c: any) => c.text || '').join('\n')
        : String(msg.content || '');
      formatted += `[ASSISTANT]\n${text}\n\n`;
    }
  }

  return formatted.trim();
}

function createCliLanguageModel(
  modelId: string,
  command: string,
  argsBuilder: (promptText: string) => string[],
  outputParser: (chunk: string, enqueue: (part: LanguageModelV1StreamPart) => void) => void,
): LanguageModelV1 {
  return {
    specificationVersion: 'v1',
    provider: 'ZothLocal',
    modelId,
    defaultObjectGenerationMode: 'json',
    async doGenerate(options: LanguageModelV1CallOptions) {
      const promptText = formatPromptForCli(options.prompt);

      let output = '';

      const spawn = await getSpawn();

      await new Promise<void>((resolve, reject) => {
        const child = spawn(command, argsBuilder(promptText));

        child.stdout.on('data', (d: any) => {
          output += d.toString();
        });

        child.on('close', (code: number) => {
          if (code === 0 || output.length > 0) {
            resolve();
          } else {
            reject(new Error(`${command} exited with code ${code}`));
          }
        });

        child.on('error', reject);
      });

      return {
        text: output.trim(),
        finishReason: 'stop',
        usage: { promptTokens: 0, completionTokens: 0 },
        rawCall: { rawPrompt: promptText, rawSettings: {} },
      };
    },
    async doStream(options: LanguageModelV1CallOptions) {
      const promptText = formatPromptForCli(options.prompt);
      const spawn = await getSpawn();

      const stream = new ReadableStream<LanguageModelV1StreamPart>({
        start(controller) {
          const child = spawn(command, argsBuilder(promptText));

          let buffer = '';

          child.stdout.on('data', (chunk: any) => {
            buffer += chunk.toString();
            outputParser(buffer, (part) => controller.enqueue(part));
          });

          child.stderr.on('data', (chunk: any) => {
            logger.warn(`[${command} stderr]: ${chunk.toString().slice(0, 100)}`);
          });

          child.on('close', () => {
            controller.enqueue({
              type: 'finish',
              finishReason: 'stop',
              usage: { promptTokens: 0, completionTokens: 0 },
            });
            controller.close();
          });

          child.on('error', (err: any) => {
            controller.error(err);
          });
        },
      });

      return {
        stream,
        rawCall: { rawPrompt: promptText, rawSettings: {} },
      };
    },
  };
}

export default class ZothLocalProvider extends BaseProvider {
  name = 'ZothLocal';
  getApiKeyLink = 'https://nullai.tech';
  labelForGetApiKey = 'ZothOS Local Engines (No API Key Required)';
  icon = 'i-ph:cpu-fill';

  config = {
    baseUrlKey: 'ZOTH_LOCAL_API_BASE_URL',
  };

  staticModels: ModelInfo[] = [
    {
      name: 'agy-engine',
      label: '⚡ Google Antigravity (AGY Local CLI)',
      provider: 'ZothLocal',
      maxTokenAllowed: 128000,
      maxCompletionTokens: 16384,
    },
    {
      name: 'hermes-agent',
      label: '👑 Hermes Agent (Nous Research / Local)',
      provider: 'ZothLocal',
      maxTokenAllowed: 65536,
      maxCompletionTokens: 8192,
    },
    {
      name: 'claude-cli',
      label: '🧠 Claude Code (Anthropic Local CLI)',
      provider: 'ZothLocal',
      maxTokenAllowed: 128000,
      maxCompletionTokens: 16384,
    },
    {
      name: 'qwen2.5-coder:1.5b',
      label: '🛠️ Qwen 2.5 Coder (Ollama Local)',
      provider: 'ZothLocal',
      maxTokenAllowed: 32768,
      maxCompletionTokens: 8192,
    },
    {
      name: 'llama3.2:1b',
      label: '🦙 Llama 3.2 (Ollama Local)',
      provider: 'ZothLocal',
      maxTokenAllowed: 131072,
      maxCompletionTokens: 8192,
    },
    {
      name: 'zoth-model:latest',
      label: '👑 Zoth Sovereign Fine-tune (Ollama Local)',
      provider: 'ZothLocal',
      maxTokenAllowed: 32768,
      maxCompletionTokens: 8192,
    },
  ];

  async getDynamicModels(): Promise<ModelInfo[]> {
    return this.staticModels;
  }

  getModelInstance(options: {
    model: string;
    serverEnv?: any;
    apiKeys?: Record<string, string>;
    providerSettings?: Record<string, IProviderSetting>;
  }): LanguageModelV1 {
    const { model } = options;

    if (model === 'agy-engine') {
      let buffer = '';
      return createCliLanguageModel(
        'agy-engine',
        'agy',
        (promptText) => ['-p', promptText, '--output-format', 'stream-json'],
        (raw, enqueue) => {
          buffer = raw;

          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.trim()) {
              continue;
            }

            try {
              const data = JSON.parse(line);

              if (data.event === 'step_update' && data.step_update?.text_delta) {
                enqueue({
                  type: 'text-delta',
                  textDelta: data.step_update.text_delta,
                });
              }
            } catch {
              // Ignore non-json lines
            }
          }
        },
      );
    }

    if (model === 'claude-cli') {
      let emittedLen = 0;
      return createCliLanguageModel(
        'claude-cli',
        'claude',
        (promptText) => ['-p', promptText],
        (raw, enqueue) => {
          const newChunk = raw.slice(emittedLen);

          if (newChunk) {
            emittedLen = raw.length;
            enqueue({
              type: 'text-delta',
              textDelta: newChunk,
            });
          }
        },
      );
    }

    if (model === 'hermes-agent') {
      let emittedLen = 0;
      return createCliLanguageModel(
        'hermes-agent',
        'hermes',
        (promptText) => ['-z', promptText],
        (raw, enqueue) => {
          const newChunk = raw.slice(emittedLen);

          if (newChunk) {
            emittedLen = raw.length;
            enqueue({
              type: 'text-delta',
              textDelta: newChunk,
            });
          }
        },
      );
    }

    // Default: Local Ollama on 127.0.0.1:11434 via OpenAI-compatible endpoint
    const openai = createOpenAI({
      baseURL: 'http://127.0.0.1:11434/v1',
      apiKey: 'ollama',
    });

    return openai(model);
  }
}
