import { spawn, execSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import os from 'node:os';
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';

const MAX_OUTPUT_BYTES = 2 * 1024 * 1024;

/**
 * The terminal route executes shell commands, so it must only be reachable from the WebGen UI itself.
 * Reject cross-origin requests (CSRF from other sites) and require a JSON content type, which forces a CORS preflight.
 */
export function isTrustedTerminalRequest(request: Request): { ok: boolean; reason?: string } {
  const url = new URL(request.url);
  const origin = request.headers.get('Origin');
  const secFetchSite = request.headers.get('Sec-Fetch-Site');
  const contentType = request.headers.get('Content-Type') || '';

  if (!contentType.includes('application/json')) {
    return { ok: false, reason: 'Content-Type must be application/json' };
  }

  if (secFetchSite && !['same-origin', 'none'].includes(secFetchSite)) {
    return { ok: false, reason: 'Cross-site requests are not allowed' };
  }

  if (origin && origin !== url.origin) {
    return { ok: false, reason: 'Origin not allowed' };
  }

  return { ok: true };
}

function resolveCwd(input: unknown): string {
  let dir = typeof input === 'string' && input.trim() ? input.trim() : process.cwd();

  if (dir === '~' || dir.startsWith('~/')) {
    dir = os.homedir() + dir.slice(1);
  }

  try {
    if (existsSync(dir) && statSync(dir).isDirectory()) {
      return dir;
    }
  } catch {
    // fall through
  }

  return process.cwd();
}

interface LocalToolStatus {
  name: string;
  command: string;
  isAvailable: boolean;
  path?: string;
  version?: string;
}

function checkTool(name: string, command: string): LocalToolStatus {
  try {
    const toolPath = execSync(`which ${command} 2>/dev/null`, {
      env: {
        ...process.env,
        PATH: `/home/zoth/.local/bin:/usr/local/bin:/usr/bin:/bin:${process.env.PATH || ''}`,
      },
    })
      .toString()
      .trim();

    let version = '';

    const probeEnv = {
      ...process.env,
      PATH: `/home/zoth/.local/bin:/usr/local/bin:/usr/bin:/bin:${process.env.PATH || ''}`,
    };
    const firstLine = (bin: string, timeout: number) =>
      execSync(bin, { timeout, env: probeEnv }).toString().trim().split('\n')[0];

    try {
      if (command === 'claude') {
        version = firstLine('claude --version 2>&1', 4000);
      } else if (command === 'ollama') {
        version = firstLine('ollama --version 2>&1', 4000);
      } else if (command === 'agy') {
        version = 'v2.0 (DeepMind Antigravity CLI)';
      } else if (command === 'hermes') {
        version = firstLine('hermes --version 2>&1', 4000);
      } else if (command === 'grok') {
        version = firstLine('grok --version 2>&1', 4000);
      } else if (command === 'cline') {
        version = firstLine('cline version 2>&1', 4000);
      } else if (command === 'aider') {
        version = firstLine('aider --version 2>&1', 8000);
      } else if (command === 'opencode') {
        const probe = execSync('opencode --version 2>&1', { timeout: 4000, env: probeEnv }).toString();
        version = /not installed/i.test(probe) ? '' : probe.trim().split('\n')[0];
      }
    } catch {
      // Ignore version probe failure
    }

    if (command === 'opencode' && !version) {
      return {
        name,
        command,
        isAvailable: false,
        path: toolPath,
        version: 'Launcher only',
      };
    }

    return {
      name,
      command,
      isAvailable: Boolean(toolPath),
      path: toolPath,
      version: version || 'Installed',
    };
  } catch {
    return {
      name,
      command,
      isAvailable: false,
    };
  }
}

export async function loader({ request: _request }: LoaderFunctionArgs) {
  const tools: LocalToolStatus[] = [
    checkTool('Grok CLI', 'grok'),
    checkTool('Nous Hermes Agent', 'hermes'),
    checkTool('OpenCode', 'opencode'),
    checkTool('Cline', 'cline'),
    checkTool('Aider', 'aider'),
    checkTool('Antigravity CLI (AGY)', 'agy'),
    checkTool('Claude Code', 'claude'),
    checkTool('Ollama Local LLM', 'ollama'),
    checkTool('Git Version Control', 'git'),
    checkTool('Node.js Runtime', 'node'),
    checkTool('PNPM Package Manager', 'pnpm'),
  ];

  const cwd = process.cwd();

  return json({
    status: 'ok',
    cwd,
    host: 'ZothOS / Linux',
    user: process.env.USER || 'zoth',
    tools,
    presets: [
      { label: 'agy --help', cmd: 'agy --help' },
      { label: 'agy models', cmd: 'agy models' },
      { label: 'agy agent', cmd: 'agy agent' },
      { label: 'agy mcp list', cmd: 'agy mcp list' },
      { label: 'grok models', cmd: 'grok models' },
      { label: 'hermes --version', cmd: 'hermes --version' },
      { label: 'cline version', cmd: 'cline version' },
      { label: 'aider --version', cmd: 'aider --version' },
      { label: 'claude --version', cmd: 'claude --version' },
      { label: 'ollama list', cmd: 'ollama list' },
      { label: 'git status', cmd: 'git status' },
    ],
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const trust = isTrustedTerminalRequest(request);

  if (!trust.ok) {
    return json({ error: `Forbidden: ${trust.reason}` }, { status: 403 });
  }

  try {
    const body = await request.json<any>();
    const commandStr = String(body.command || '').trim();
    const workingDir = resolveCwd(body.cwd);
    const isStream = Boolean(body.stream || request.headers.get('Accept')?.includes('text/event-stream'));
    const timeoutMs = Math.min(Number(body.timeout) || 60000, 120000);

    if (!commandStr) {
      return json({ error: 'Command string is required' }, { status: 400 });
    }

    // Extended PATH including local user binaries
    const env = {
      HOME: process.env.HOME || '/home/zoth',
      USER: process.env.USER || 'zoth',
      ...process.env,
      PATH: `/home/zoth/.local/bin:/usr/local/bin:/usr/bin:/bin:${process.env.PATH || ''}`,
      TERM: 'xterm-256color',
      COLORTERM: 'truecolor',
    };

    if (isStream) {
      const stream = new ReadableStream({
        start(controller) {
          const encoder = new TextEncoder();
          const startTime = Date.now();

          const send = (type: string, data: any) => {
            try {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type, ...data })}\n\n`));
            } catch {
              // Client disconnected
            }
          };

          send('start', { command: commandStr, cwd: workingDir, timestamp: startTime });

          const child = spawn('bash', ['-c', commandStr], {
            cwd: workingDir,
            env,
            detached: true,
          });

          let closed = false;
          let bytes = 0;

          const killTree = () => {
            try {
              if (child.pid) {
                process.kill(-child.pid, 'SIGTERM');
              }
            } catch {
              child.kill('SIGTERM');
            }
          };
          const closeOnce = () => {
            if (closed) {
              return;
            }

            closed = true;

            try {
              controller.close();
            } catch {
              // Ignore
            }
          };

          const timer = setTimeout(() => {
            killTree();
            send('error', { message: `Command timed out after ${timeoutMs / 1000}s` });
            send('exit', { code: 124, durationMs: Date.now() - startTime });
            closeOnce();
          }, timeoutMs);

          const proc = child as any;

          const onChunk = (type: 'stdout' | 'stderr') => (chunk: any) => {
            if (closed) {
              return;
            }

            bytes += chunk.length;

            if (bytes > MAX_OUTPUT_BYTES) {
              killTree();
              send('error', { message: 'Output limit (2 MB) exceeded; command stopped' });
              send('exit', { code: 137, durationMs: Date.now() - startTime });
              clearTimeout(timer);
              closeOnce();

              return;
            }

            send(type, { text: chunk.toString('utf-8') });
          };

          proc.stdout.on('data', onChunk('stdout'));
          proc.stderr.on('data', onChunk('stderr'));

          proc.on('error', (err: any) => {
            send('error', { message: err?.message || String(err) });
          });

          proc.on('close', (code: any) => {
            clearTimeout(timer);

            if (!closed) {
              send('exit', {
                code: code ?? 0,
                durationMs: Date.now() - startTime,
              });
            }

            closeOnce();
          });

          request.signal.addEventListener('abort', () => {
            clearTimeout(timer);
            killTree();
            closeOnce();
          });
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    }

    // Non-streaming JSON mode
    return new Promise<Response>((resolve) => {
      const startTime = Date.now();

      let stdout = '';
      let stderr = '';

      const child = spawn('bash', ['-c', commandStr], {
        cwd: workingDir,
        env,
      });

      const timer = setTimeout(() => {
        child.kill('SIGTERM');
        resolve(
          json(
            {
              success: false,
              exitCode: 124,
              stdout,
              stderr: stderr + `\n[Timeout after ${timeoutMs / 1000}s]`,
              output: stdout + stderr + `\n[Timeout after ${timeoutMs / 1000}s]`,
              durationMs: Date.now() - startTime,
            },
            { status: 408 },
          ),
        );
      }, timeoutMs);

      const proc = child as any;

      proc.stdout.on('data', (chunk: any) => {
        if (stdout.length < MAX_OUTPUT_BYTES) {
          stdout += chunk.toString('utf-8');
        }
      });

      proc.stderr.on('data', (chunk: any) => {
        if (stderr.length < MAX_OUTPUT_BYTES) {
          stderr += chunk.toString('utf-8');
        }
      });

      proc.on('close', (code: any) => {
        clearTimeout(timer);

        const exitCode = code ?? 0;
        const output = stdout + (stderr ? (stdout ? '\n' + stderr : stderr) : '');

        resolve(
          json({
            success: exitCode === 0,
            exitCode,
            stdout,
            stderr,
            output,
            durationMs: Date.now() - startTime,
          }),
        );
      });

      proc.on('error', (err: any) => {
        clearTimeout(timer);
        resolve(
          json(
            {
              success: false,
              exitCode: 1,
              stdout,
              stderr: err?.message || String(err),
              output: err?.message || String(err),
              durationMs: Date.now() - startTime,
            },
            { status: 500 },
          ),
        );
      });
    });
  } catch (err: any) {
    return json({ error: err.message || 'Execution error' }, { status: 500 });
  }
}
