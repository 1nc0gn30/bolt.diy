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

function createInstantBoltArchitectModel(): LanguageModelV1 {
  const buildArtifactText = (promptText: string) => {
    const userMatch = promptText.match(/\[USER\]\s*([\s\S]*)$/i);
    const rawUser = (userMatch ? userMatch[1] : promptText).trim();
    const firstLine = rawUser.split('\n').find((l) => l.trim().length > 3) || 'Zoth Bolt Sovereign Studio';
    const title = firstLine.replace(/[#*`]/g, '').trim().slice(0, 56) || 'Zoth Bolt Sovereign Studio';
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'zoth-bolt-app';

    const pkgJson = JSON.stringify(
      {
        name: slug,
        private: true,
        version: '1.0.0',
        type: 'module',
        scripts: {
          dev: 'vite --host 0.0.0.0',
          build: 'vite build',
        },
        devDependencies: {
          vite: '^6.0.0',
        },
      },
      null,
      2,
    );

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — Engineered with Zoth Bolt</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700;800&family=JetBrains+Mono:wght@400;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root { --bg: #08080B; --surface: #11131C; --gold: #D4AF37; --gold-soft: #F5E6AB; --cyan: #38BDF8; --emerald: #10B981; --text: #F8FAFC; --muted: #94A3B8; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    [hidden] { display: none !important; }
    body { background: var(--bg); color: var(--text); font-family: 'Inter', sans-serif; min-height: 100vh; overflow-x: hidden; }
    header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; border-bottom: 1px solid rgba(212,175,55,0.22); background: rgba(11,13,20,0.9); backdrop-filter: blur(12px); position: sticky; top: 0; z-index: 40; flex-wrap: wrap; gap: 0.75rem; }
    .brand { display: flex; align-items: center; gap: 0.75rem; font-family: 'Space Grotesk', sans-serif; font-weight: 800; font-size: 1.15rem; letter-spacing: 0.03em; }
    .pill { font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; padding: 0.25rem 0.65rem; border-radius: 999px; border: 1px solid rgba(212,175,55,0.4); color: var(--gold-soft); background: rgba(212,175,55,0.12); }
    .container { max-width: 1200px; margin: 0 auto; padding: 2.5rem 1.5rem; }
    .hero { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 2rem; align-items: center; margin-bottom: 2.5rem; }
    @media (max-width: 860px) { .hero { grid-template-columns: 1fr; } }
    h1 { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2rem, 4vw, 3.25rem); line-height: 1.08; margin: 0.85rem 0; }
    .subtitle { color: var(--muted); font-size: 1.02rem; line-height: 1.65; max-width: 58ch; margin-bottom: 1.5rem; }
    .btn-row { display: flex; flex-wrap: wrap; gap: 0.75rem; }
    .btn { cursor: pointer; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 0.82rem; padding: 0.75rem 1.25rem; border-radius: 0.75rem; border: 1px solid rgba(212,175,55,0.45); background: linear-gradient(135deg, #D4AF37, #9A7B1C); color: #08080B; transition: transform 0.15s; }
    .btn:hover { transform: translateY(-2px); }
    .btn-ghost { background: rgba(255,255,255,0.04); color: var(--text); border-color: rgba(255,255,255,0.14); }
    .stage-card { background: var(--surface); border: 1px solid rgba(212,175,55,0.28); border-radius: 1.25rem; padding: 1.25rem; position: relative; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.55); }
    canvas#motionCanvas { width: 100%; height: 220px; display: block; border-radius: 0.85rem; background: #05060A; border: 1px solid rgba(255,255,255,0.08); }
    .bento { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-top: 2rem; }
    .card { background: var(--surface); border: 1px solid rgba(255,255,255,0.09); border-radius: 1.1rem; padding: 1.5rem; transition: border-color 0.2s; }
    .card:hover { border-color: var(--gold); }
    .card h3 { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; margin: 0.65rem 0 0.4rem; }
    .card p { color: var(--muted); font-size: 0.9rem; line-height: 1.55; }
  </style>
</head>
<body>
  <header>
    <div class="brand">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="26" height="26" shape-rendering="crispEdges"><path fill="#F5E6AB" d="M9 1h3v2H10v2H9v2h4v2h-2v2H9v2H7v2H5v-3h2V9H4V7h2V5h2V3h1z"/><path fill="#D4AF37" d="M8 2h2v2H8v2H6v2h4v1H8v2H6v3H5v-2h2v-2H3V8h2V6h2V4h1z"/></svg>
      <span>${title}</span>
    </div>
    <div style="display:flex;gap:0.5rem;align-items:center;">
      <span class="pill">⚡ ZOTH BOLT ARCHITECT</span>
      <span class="pill" style="border-color:rgba(16,185,129,0.4);color:#6EE7B7;background:rgba(16,185,129,0.1);">60FPS SHADER READY</span>
    </div>
  </header>
  <main class="container">
    <section class="hero">
      <div>
        <span class="pill">BESPOKE SVG · PIXEL ART · 15S MOTION EDIT</span>
        <h1>${title}</h1>
        <p class="subtitle">Synthesized with Zoth Bolt featuring multi-layered vector SVG emblems, crisp 16x16 pixel-art sprites, and an interactive @teknium Uncommon Web 60fps shader stage.</p>
        <div class="btn-row">
          <button class="btn" id="modeBtn">Switch Shader Mode (Braille / Dither / ASCII)</button>
          <button class="btn btn-ghost" id="pulseBtn">Trigger Telemetry Pulse</button>
        </div>
      </div>
      <div class="stage-card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.65rem;font-family:'JetBrains Mono',monospace;font-size:0.72rem;color:var(--gold-soft);">
          <span id="shaderLabel">MODE // BRAILLE WAVE (U+2800)</span>
          <span>15S SHOWREEL ENGINE</span>
        </div>
        <canvas id="motionCanvas" width="520" height="220"></canvas>
      </div>
    </section>
    <section class="bento">
      <article class="card">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="48" height="48"><circle cx="60" cy="60" r="52" fill="#0B0D14" stroke="#D4AF37" stroke-width="3"/><path d="M66 24 L38 64 H58 L52 96 L84 54 H62 Z" fill="#D4AF37"/></svg>
        <h3>Interactive Architecture</h3>
        <p>100% client-side reactive state, zero blocking modals, and responsive 390px-to-1440px grid choreography.</p>
      </article>
      <article class="card">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="48" height="48"><circle cx="60" cy="60" r="52" fill="#06140E" stroke="#10B981" stroke-width="3"/><path d="M60 22 C88 28 96 58 60 98 C24 58 32 28 60 22 Z" fill="#10B981" opacity="0.85"/></svg>
        <h3>Curated SVG &amp; Pixel Vault</h3>
        <p>Embedded multi-layered vector gradients, crisp 16-bit pixel sprites, and Iconify 200k+ icon integration.</p>
      </article>
      <article class="card">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="48" height="48"><circle cx="60" cy="60" r="48" fill="none" stroke="#38BDF8" stroke-width="3" stroke-dasharray="10 6"/><circle cx="60" cy="60" r="10" fill="#38BDF8"/></svg>
        <h3>Live Motion Choreography</h3>
        <p>Deterministic 60fps HTML5 canvas shader with Braille, Ordered Bayer Dither, and Constellation modes.</p>
      </article>
    </section>
  </main>
  <script type="module" src="/src/main.js"></script>
</body>
</html>`;

    const mainJs = `const canvas = document.getElementById('motionCanvas');
const ctx = canvas.getContext('2d');
const modes = ['BRAILLE WAVE (U+2800)', 'BAYER 4X4 ORDERED DITHER', 'KINETIC ASCII MATRIX'];
let modeIdx = 0;
let t = 0;

document.getElementById('modeBtn')?.addEventListener('click', () => {
  modeIdx = (modeIdx + 1) % modes.length;
  const lbl = document.getElementById('shaderLabel');
  if (lbl) lbl.textContent = 'MODE // ' + modes[modeIdx];
});

document.getElementById('pulseBtn')?.addEventListener('click', () => {
  t += 2.5;
});

function render() {
  t += 0.035;
  ctx.fillStyle = '#05060A';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = '12px "JetBrains Mono", monospace';
  const cols = Math.floor(canvas.width / 14);
  const rows = Math.floor(canvas.height / 16);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const v = Math.sin(c * 0.22 + t) * Math.cos(r * 0.28 - t * 0.8);
      if (v > -0.2) {
        ctx.fillStyle = v > 0.45 ? '#D4AF37' : v > 0.1 ? '#38BDF8' : 'rgba(148,163,184,0.35)';
        const ch = modeIdx === 0 ? String.fromCharCode(0x2800 + ((Math.floor((v + 1) * 127)) & 0xff)) : modeIdx === 1 ? (v > 0.3 ? '▓' : '▒') : (v > 0.3 ? '#' : '+');
        ctx.fillText(ch, c * 14 + 6, r * 16 + 14);
      }
    }
  }
  requestAnimationFrame(render);
}
render();
`;

    return ` Synthesizing **${title}** with bespoke SVG artwork, 16-bit Pixel Art badges, and a 60fps Motion Edit Shader stage:

<boltArtifact id="${slug}" title="${title}">
<boltAction type="file" filePath="package.json">
${pkgJson}
</boltAction>
<boltAction type="file" filePath="index.html">
${htmlContent}
</boltAction>
<boltAction type="file" filePath="src/main.js">
${mainJs}
</boltAction>
<boltAction type="shell">
npm install
</boltAction>
<boltAction type="start">
npm run dev
</boltAction>
</boltArtifact>`;
  };

  return {
    specificationVersion: 'v1',
    provider: 'ZothLocal',
    modelId: 'zoth-bolt-instant',
    defaultObjectGenerationMode: 'json',
    async doGenerate(options: LanguageModelV1CallOptions) {
      const promptText = formatPromptForCli(options.prompt);
      const text = buildArtifactText(promptText);
      return {
        text,
        finishReason: 'stop',
        usage: { promptTokens: 120, completionTokens: 850 },
        rawCall: { rawPrompt: promptText, rawSettings: {} },
      };
    },
    async doStream(options: LanguageModelV1CallOptions) {
      const promptText = formatPromptForCli(options.prompt);
      const text = buildArtifactText(promptText);
      const stream = new ReadableStream<LanguageModelV1StreamPart>({
        start(controller) {
          controller.enqueue({ type: 'text-delta', textDelta: text });
          controller.enqueue({
            type: 'finish',
            finishReason: 'stop',
            usage: { promptTokens: 120, completionTokens: 850 },
          });
          controller.close();
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
      name: 'zoth-bolt-instant',
      label: '⚡ Zoth Bolt Instant Architect (Deterministic High-Craft + Motion Edit)',
      provider: 'ZothLocal',
      maxTokenAllowed: 256000,
      maxCompletionTokens: 32768,
    },
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
      name: 'codex-cli',
      label: '🤖 OpenAI Codex Local CLI Agent',
      provider: 'ZothLocal',
      maxTokenAllowed: 200000,
      maxCompletionTokens: 32768,
    },
    {
      name: 'gemini-cli',
      label: '♊ Google Gemini Local CLI Agent',
      provider: 'ZothLocal',
      maxTokenAllowed: 1000000,
      maxCompletionTokens: 32768,
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

    if (model === 'zoth-bolt-instant') {
      return createInstantBoltArchitectModel();
    }

    if (model === 'agy-engine') {
      return createCliLanguageModel('agy-engine', 'agy', (promptText) => ['-p', promptText]);
    }

    if (model === 'codex-cli') {
      return createCliLanguageModel('codex-cli', 'codex', (promptText) => ['--quiet', promptText]);
    }

    if (model === 'gemini-cli') {
      return createCliLanguageModel('gemini-cli', 'gemini', (promptText) => ['-p', promptText]);
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
