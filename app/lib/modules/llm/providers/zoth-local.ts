import fs from 'node:fs';
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

function resolveExecutable(cmd: string): string {
  const homeDir = process.env.HOME || '/home/zoth';

  const candidates = [`${homeDir}/.local/bin/${cmd}`, `/usr/local/bin/${cmd}`, `/usr/bin/${cmd}`];

  try {
    for (const cand of candidates) {
      if (fs.existsSync(cand)) {
        return cand;
      }
    }
  } catch {
    // ignore
  }

  return cmd;
}

function createCliLanguageModel(
  modelId: string,
  command: string,
  argsBuilder: (promptText: string) => string[],
  outputHandler?: (chunk: string, enqueue: (part: LanguageModelV1StreamPart) => void) => void,
): LanguageModelV1 {
  const binPath = resolveExecutable(command);
  const homeDir = process.env.HOME || '/home/zoth';
  const userName = process.env.USER || 'zoth';

  const cliEnv = {
    ...process.env,
    HOME: homeDir,
    USER: userName,
    LOGNAME: userName,
    PATH: `${homeDir}/.local/bin:/usr/local/bin:${process.env.PATH || ''}`,
    NO_COLOR: '1',
    TERM: 'dumb',
  };

  return {
    specificationVersion: 'v1',
    provider: 'ZothLocal',
    modelId,
    defaultObjectGenerationMode: 'json',
    async doGenerate(options: LanguageModelV1CallOptions) {
      const promptText = formatPromptForCli(options.prompt);
      const spawn = await getSpawn();

      let output = '';

      await new Promise<void>((resolve, reject) => {
        const child = spawn(binPath, argsBuilder(promptText), {
          env: cliEnv,
        });

        child.stdout.on('data', (d: any) => {
          output += d.toString();
        });

        child.stderr.on('data', (d: any) => {
          logger.warn(`[${command} stderr]: ${d.toString().slice(0, 120)}`);
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
          const child = spawn(binPath, argsBuilder(promptText), {
            env: cliEnv,
          });

          child.stdout.on('data', (chunk: any) => {
            const raw = chunk.toString();

            if (outputHandler) {
              outputHandler(raw, (part) => controller.enqueue(part));
            } else if (raw) {
              controller.enqueue({
                type: 'text-delta',
                textDelta: raw,
              });
            }
          });

          child.stderr.on('data', (chunk: any) => {
            logger.warn(`[${command} stderr]: ${chunk.toString().slice(0, 120)}`);
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
      label: '⚡ Google Antigravity (AGY Local CLI - Coding Agent)',
      provider: 'ZothLocal',
      maxTokenAllowed: 128000,
      maxCompletionTokens: 16384,
    },
    {
      name: 'agy-architect',
      label: '🏗️ AGY Fullstack System Architect',
      provider: 'ZothLocal',
      maxTokenAllowed: 128000,
      maxCompletionTokens: 16384,
    },
    {
      name: 'agy-linter',
      label: '🛡️ AGY Code Review & Security Auditor',
      provider: 'ZothLocal',
      maxTokenAllowed: 128000,
      maxCompletionTokens: 16384,
    },
    {
      name: 'hermes-agent',
      label: '👑 Nous Research Hermes 3 Agent (OneShot Fast)',
      provider: 'ZothLocal',
      maxTokenAllowed: 65536,
      maxCompletionTokens: 8192,
    },
    {
      name: 'hermes-coder',
      label: '💻 Hermes 3 Coder Specialist',
      provider: 'ZothLocal',
      maxTokenAllowed: 65536,
      maxCompletionTokens: 8192,
    },
    {
      name: 'hermes-moa',
      label: '🤝 Hermes Mixture-of-Agents Coordinator',
      provider: 'ZothLocal',
      maxTokenAllowed: 65536,
      maxCompletionTokens: 8192,
    },
    {
      name: 'claude-cli',
      label: '🧠 Claude Code Local Agent CLI',
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
    {
      name: 'qwen2.5:1.5b',
      label: '⚡ Qwen 2.5 1.5B (Ollama Local)',
      provider: 'ZothLocal',
      maxTokenAllowed: 32768,
      maxCompletionTokens: 8192,
    },
    {
      name: 'qwen2.5:0.5b',
      label: '🚀 Qwen 2.5 0.5B Ultra-Fast (Ollama Local)',
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
      return createCliLanguageModel('agy-engine', 'agy', (promptText) => ['-p', promptText]);
    }

    if (model === 'agy-architect') {
      return createCliLanguageModel('agy-architect', 'agy', (promptText) => [
        '-p',
        `[ROLE: Senior System Architect & Fullstack Engineer]\n${promptText}`,
      ]);
    }

    if (model === 'agy-linter') {
      return createCliLanguageModel('agy-linter', 'agy', (promptText) => [
        '-p',
        `[ROLE: Code Reviewer & Security Auditor]\n${promptText}`,
      ]);
    }

    if (model === 'claude-cli') {
      return createCliLanguageModel('claude-cli', 'claude', (promptText) => ['-p', promptText]);
    }

    if (model === 'hermes-agent') {
      return createCliLanguageModel('hermes-agent', 'hermes', (promptText) => [
        '-z',
        promptText,
        '--ignore-rules',
        '--yolo',
      ]);
    }

    if (model === 'hermes-coder') {
      return createCliLanguageModel('hermes-coder', 'hermes', (promptText) => [
        '-z',
        promptText,
        '--ignore-rules',
        '--yolo',
        '-m',
        'qwen2.5-coder:1.5b',
      ]);
    }

    if (model === 'hermes-moa') {
      return createCliLanguageModel('hermes-moa', 'hermes', (promptText) => [
        '-z',
        promptText,
        '--ignore-rules',
        '--yolo',
        '-m',
        'llama3.2:1b',
      ]);
    }

    // Default: Local Ollama on 127.0.0.1:11434 via OpenAI-compatible endpoint
    const openai = createOpenAI({
      baseURL: 'http://127.0.0.1:11434/v1',
      apiKey: 'ollama',
    });

    return openai(model);
  }
}
