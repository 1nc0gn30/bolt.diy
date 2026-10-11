import fs from 'node:fs';
import path from 'node:path';
import { createOpenAI } from '@ai-sdk/openai';
import type { LanguageModelV1, LanguageModelV1CallOptions, LanguageModelV1StreamPart } from 'ai';
import { BaseProvider } from '~/lib/modules/llm/base-provider';
import { createGrokParseState, finishGrokChunk, pushGrokChunk } from '~/lib/modules/llm/grok-stream';
import type { ModelInfo } from '~/lib/modules/llm/types';
import type { IProviderSetting } from '~/types/model';
import { logger } from '~/utils/logger';

const SCRATCH_DIR = '/tmp/zoth-webgen-cli';

function scratchDir(): string {
  fs.mkdirSync(SCRATCH_DIR, { recursive: true });
  return SCRATCH_DIR;
}

function writePromptFile(text: string): string {
  const file = path.join(scratchDir(), `prompt-${Date.now()}-${Math.random().toString(36).slice(2)}.txt`);
  fs.writeFileSync(file, text, 'utf8');

  return file;
}

function cleanupPromptArgs(args: string[]) {
  for (const arg of args) {
    if (arg.startsWith(`${SCRATCH_DIR}/prompt-`)) {
      try {
        fs.unlinkSync(arg);
      } catch {
        // The reply was already captured.
      }
    }
  }
}

function stripAnsi(text: string): string {
  return text.replace(/\x1B\[[0-9;?]*[ -/]*[@-~]/g, '').replace(/\x1B\][^\x07]*(?:\x07|\x1B\\)/g, '');
}

function findRealOpenCode(): string | null {
  const homeDir = process.env.HOME || '/home/zoth';

  const candidates = [
    `${homeDir}/.local/bin/opencode`,
    `${homeDir}/.npm-global/bin/opencode`,
    '/opt/zothos-ai-env/bin/opencode',
    '/usr/local/bin/opencode-cli',
    '/usr/bin/opencode',
  ];

  for (const cand of candidates) {
    if (fs.existsSync(cand)) {
      return cand;
    }
  }

  return null;
}

async function getSpawn() {
  if (typeof window !== 'undefined') {
    throw new Error('Local CLI execution is only supported server-side.');
  }

  const modName = 'child_process';
  const { spawn } = await import(/* @vite-ignore */ modName);

  return spawn;
}

const CLI_OUTPUT_CONTRACT = `[OUTPUT CONTRACT]
Print the website in this chat as bolt artifact text. Do not create, edit, or delete files. Do not run commands. Do not switch models. Stay on this job until the artifact is closed and one start action runs the dev server.
`;

function formatPromptForCli(prompt: any[]): string {
  const needsArtifact = prompt.some((msg) => {
    const content = typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content || '');
    return content.includes('boltArtifact') || content.includes('boltAction');
  });

  let formatted = needsArtifact ? `${CLI_OUTPUT_CONTRACT}\n` : '';

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

function missingCliModel(modelId: string, message: string): LanguageModelV1 {
  return {
    specificationVersion: 'v1',
    provider: 'ZothLocal',
    modelId,
    defaultObjectGenerationMode: 'json',
    async doGenerate() {
      throw new Error(message);
    },
    async doStream() {
      throw new Error(message);
    },
  };
}

function createCliLanguageModel(
  modelId: string,
  command: string,
  argsBuilder: (promptText: string) => string[],
  outputHandler?: (chunk: string, enqueue: (part: LanguageModelV1StreamPart) => void) => void,
  runOptions?: { cwd?: string; timeoutMs?: number; binPath?: string; streamFormat?: 'grok-json' },
): LanguageModelV1 {
  const binPath = runOptions?.binPath || resolveExecutable(command);
  const homeDir = process.env.HOME || '/home/zoth';
  const userName = process.env.USER || 'zoth';
  const cwd = runOptions?.cwd || process.cwd();
  const timeoutMs = runOptions?.timeoutMs || 0;

  const cliEnv = {
    ...process.env,
    HOME: homeDir,
    USER: userName,
    LOGNAME: userName,
    PATH: `${homeDir}/.local/bin:/usr/local/bin:${process.env.PATH || ''}`,
    NO_COLOR: '1',
    TERM: 'dumb',
  };

  if (!fs.existsSync(binPath) && binPath === command) {
    return missingCliModel(modelId, `${command} is not on PATH. Install it in Zoth OS, then choose it again.`);
  }

  return {
    specificationVersion: 'v1',
    provider: 'ZothLocal',
    modelId,
    defaultObjectGenerationMode: 'json',
    async doGenerate(options: LanguageModelV1CallOptions) {
      const promptText = formatPromptForCli(options.prompt);
      const spawn = await getSpawn();

      let output = '';

      const args = argsBuilder(promptText);

      await new Promise<void>((resolve, reject) => {
        let settled = false;
        let stopTimer: ReturnType<typeof setTimeout> | null = null;

        const finish = (fn: () => void) => {
          if (settled) {
            return;
          }

          settled = true;

          if (stopTimer) {
            clearTimeout(stopTimer);
          }

          cleanupPromptArgs(args);
          fn();
        };
        const child = spawn(binPath, args, {
          env: cliEnv,
          cwd,
        });
        stopTimer =
          timeoutMs > 0
            ? setTimeout(() => {
                child.kill('SIGTERM');
                finish(() => reject(new Error(`${command} timed out after ${Math.round(timeoutMs / 1000)}s`)));
              }, timeoutMs)
            : null;

        child.stdout.on('data', (d: any) => {
          output += stripAnsi(d.toString());
        });

        child.stderr.on('data', (d: any) => {
          logger.warn(`[${command} stderr]: ${stripAnsi(d.toString()).slice(0, 120)}`);
        });

        child.on('close', (code: number) => {
          if (/is not installed yet/i.test(output)) {
            finish(() => reject(new Error(`${command} launcher is present, but the CLI itself is not installed.`)));
            return;
          }

          if (code === 0 || output.length > 0) {
            finish(() => resolve());
          } else {
            finish(() => reject(new Error(`${command} exited with code ${code}`)));
          }
        });

        child.on('error', (err: any) => {
          finish(() => reject(err));
        });
      });

      let text = output.trim();
      let finishReason: 'stop' | 'length' = 'stop';

      if (runOptions?.streamFormat === 'grok-json' && text) {
        const state = createGrokParseState();
        const rest = pushGrokChunk(state, '', text.endsWith('\n') ? text : `${text}\n`);
        finishGrokChunk(state, rest);

        if (state.text.trim()) {
          text = state.text.trim();
        }

        finishReason = state.finishReason;
      }

      return {
        text,
        finishReason,
        usage: { promptTokens: 0, completionTokens: 0 },
        rawCall: { rawPrompt: promptText, rawSettings: {} },
      };
    },
    async doStream(options: LanguageModelV1CallOptions) {
      const promptText = formatPromptForCli(options.prompt);
      const spawn = await getSpawn();
      const args = argsBuilder(promptText);
      const grokJson = runOptions?.streamFormat === 'grok-json';

      const stream = new ReadableStream<LanguageModelV1StreamPart>({
        start(controller) {
          let settled = false;
          let timedOut = false;
          let emitted = false;
          let raw = '';
          let finishReason: 'stop' | 'length' = 'stop';

          const grokState = createGrokParseState();

          let grokBuffer = '';

          const child = spawn(binPath, args, {
            env: cliEnv,
            cwd,
          });
          const stopTimer =
            timeoutMs > 0
              ? setTimeout(() => {
                  timedOut = true;
                  child.kill('SIGTERM');
                  setTimeout(() => {
                    if (!settled) {
                      child.kill('SIGKILL');
                    }
                  }, 2000);
                }, timeoutMs)
              : null;

          const enqueueText = (text: string) => {
            if (!text) {
              return;
            }

            emitted = true;
            controller.enqueue({
              type: 'text-delta',
              textDelta: text,
            });
          };

          child.stdout.on('data', (chunk: any) => {
            const piece = stripAnsi(chunk.toString());
            raw += piece;

            if (grokJson) {
              const before = grokState.text.length;
              grokBuffer = pushGrokChunk(grokState, grokBuffer, piece);

              if (grokState.text.length > before) {
                enqueueText(grokState.text.slice(before));
              }

              if (grokState.finishReason === 'length') {
                finishReason = 'length';
              }
            } else if (outputHandler) {
              outputHandler(piece, (part) => {
                if (part.type === 'text-delta' && part.textDelta) {
                  emitted = true;
                }

                controller.enqueue(part);
              });
            } else if (piece) {
              enqueueText(piece);
            }
          });

          child.stderr.on('data', (chunk: any) => {
            logger.warn(`[${command} stderr]: ${stripAnsi(chunk.toString()).slice(0, 120)}`);
          });

          child.on('close', () => {
            if (settled) {
              return;
            }

            settled = true;

            if (stopTimer) {
              clearTimeout(stopTimer);
            }

            cleanupPromptArgs(args);

            if (grokJson) {
              const before = grokState.text.length;
              finishGrokChunk(grokState, grokBuffer);

              if (grokState.text.length > before) {
                enqueueText(grokState.text.slice(before));
              }

              if (grokState.finishReason === 'length') {
                finishReason = 'length';
              }

              if (!emitted && raw.trim()) {
                enqueueText(raw.trim());
              }
            }

            if (timedOut) {
              finishReason = 'length';
            }

            if (timedOut && !emitted) {
              controller.error(new Error(`${command} timed out after ${Math.round(timeoutMs / 1000)}s`));
              return;
            }

            controller.enqueue({
              type: 'finish',
              finishReason,
              usage: { promptTokens: 0, completionTokens: 0 },
            });
            controller.close();
          });

          child.on('error', (err: any) => {
            if (settled) {
              return;
            }

            settled = true;

            if (stopTimer) {
              clearTimeout(stopTimer);
            }

            cleanupPromptArgs(args);
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
      label: '👑 Hermes Agent (Nous Research Default / Hermes 3)',
      provider: 'ZothLocal',
      maxTokenAllowed: 65536,
      maxCompletionTokens: 8192,
    },
    {
      name: 'hermes:qwen2.5-coder:1.5b',
      label: '👑 Hermes Agent → Qwen 2.5 Coder (Local Ollama)',
      provider: 'ZothLocal',
      maxTokenAllowed: 65536,
      maxCompletionTokens: 8192,
    },
    {
      name: 'hermes:anthropic/claude-3-7-sonnet-20250219',
      label: '👑 Hermes Agent → Claude 3.7 Sonnet',
      provider: 'ZothLocal',
      maxTokenAllowed: 200000,
      maxCompletionTokens: 64000,
    },
    {
      name: 'hermes:deepseek/deepseek-reasoner',
      label: '👑 Hermes Agent → DeepSeek R1',
      provider: 'ZothLocal',
      maxTokenAllowed: 64000,
      maxCompletionTokens: 8192,
    },
    {
      name: 'hermes:openai/o3-mini',
      label: '👑 Hermes Agent → OpenAI o3-mini',
      provider: 'ZothLocal',
      maxTokenAllowed: 200000,
      maxCompletionTokens: 64000,
    },
    {
      name: 'claude-cli',
      label: '🧠 Claude Code Local Agent CLI',
      provider: 'ZothLocal',
      maxTokenAllowed: 128000,
      maxCompletionTokens: 16384,
    },
    {
      name: 'grok-cli',
      label: 'Grok CLI (Zoth OS agent)',
      provider: 'ZothLocal',
      maxTokenAllowed: 256000,
      maxCompletionTokens: 16384,
    },
    {
      name: 'opencode',
      label: 'OpenCode (Zoth OS agent)',
      provider: 'ZothLocal',
      maxTokenAllowed: 128000,
      maxCompletionTokens: 16384,
    },
    {
      name: 'cline',
      label: 'Cline (Zoth OS agent)',
      provider: 'ZothLocal',
      maxTokenAllowed: 128000,
      maxCompletionTokens: 16384,
    },
    {
      name: 'aider',
      label: 'Aider (Zoth OS agent)',
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

    const bench = scratchDir();

    if (model === 'grok-cli') {
      const homeDir = process.env.HOME || '/home/zoth';

      return createCliLanguageModel(
        'grok-cli',
        'grok',
        (promptText) => {
          const file = writePromptFile(promptText);

          return [
            '--prompt-file',
            file,
            '--reasoning-effort',
            'low',
            '--output-format',
            'streaming-messages-json',
            '--include-partial-messages',
            '--no-alt-screen',
            '--no-plan',
            '--disable-web-search',
            '--permission-mode',
            'dontAsk',
            '--max-turns',
            '1',
            '--no-subagents',
            '--disallowed-tools',
            'read_file,grep,list_dir,search_replace,write,run_terminal_cmd,run_terminal_command,web_search,web_fetch,open_page,Agent,todo_write,monitor,search_tool,use_tool,workflow,enter_plan_mode,exit_plan_mode,ask_user_question,send_feedback,image_gen,image_edit,image_to_video,reference_to_video',
            '--deny',
            'Bash',
            '--deny',
            'Edit',
            '--deny',
            'Write',
            '--deny',
            'MCPTool',
            '--system-prompt-override',
            'You write responses directly as text in this chat. You do not call tools, edit files, or run commands. Follow the instructions and output format in the prompt. Stay on this task until the artifact is closed and one start action runs the dev server.',
            '--leader-socket',
            path.join(homeDir, '.grok', 'leader-webgen.sock'),
            '--cwd',
            bench,
          ];
        },
        undefined,
        { cwd: bench, timeoutMs: 300000, streamFormat: 'grok-json' },
      );
    }

    if (model === 'opencode') {
      const realBin = findRealOpenCode();

      if (!realBin) {
        return missingCliModel(
          'opencode',
          'OpenCode is not installed. The Zoth OS menu is on the machine, and the OpenCode CLI is not. Install it, then choose OpenCode again.',
        );
      }

      return createCliLanguageModel('opencode', 'opencode', (promptText) => ['run', promptText], undefined, {
        cwd: bench,
        timeoutMs: 300000,
        binPath: realBin,
      });
    }

    if (model === 'cline') {
      return createCliLanguageModel(
        'cline',
        'cline',
        (promptText) => ['--cwd', bench, '--timeout', '180', promptText],
        undefined,
        { cwd: bench, timeoutMs: 300000 },
      );
    }

    if (model === 'aider') {
      return createCliLanguageModel(
        'aider',
        'aider',
        (promptText) => {
          const file = writePromptFile(promptText);

          return [
            '--message-file',
            file,
            '--yes-always',
            '--no-git',
            '--no-auto-commits',
            '--no-pretty',
            '--no-stream',
            '--no-show-model-warnings',
          ];
        },
        undefined,
        { cwd: bench, timeoutMs: 300000 },
      );
    }

    if (model.startsWith('hermes:') || model === 'hermes-agent' || model === 'hermes-coder' || model === 'hermes-moa') {
      let targetModel = '';

      if (model.startsWith('hermes:')) {
        targetModel = model.replace('hermes:', '');
      } else if (model === 'hermes-coder') {
        targetModel = 'qwen2.5-coder:1.5b';
      } else if (model === 'hermes-moa') {
        targetModel = 'llama3.2:1b';
      }

      return createCliLanguageModel(
        model,
        'hermes',
        (promptText) => {
          const args = ['-z', promptText, '--ignore-rules', '--yolo'];

          if (targetModel) {
            args.push('-m', targetModel);
          }

          return args;
        },
        undefined,
        { cwd: bench, timeoutMs: 300000 },
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
