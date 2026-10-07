import { spawn, execSync } from 'node:child_process';
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';

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

    try {
      if (command === 'claude') {
        version = execSync('claude --version 2>&1', { timeout: 2000 }).toString().trim();
      } else if (command === 'ollama') {
        version = execSync('ollama --version 2>&1', { timeout: 2000 }).toString().trim();
      } else if (command === 'agy') {
        version = 'v2.0 (DeepMind Antigravity CLI)';
      } else if (command === 'hermes') {
        version = 'Nous Hermes Agent v0.1';
      }
    } catch {
      // Ignore version probe failure
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
    checkTool('Antigravity CLI (AGY)', 'agy'),
    checkTool('Nous Hermes Agent', 'hermes'),
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
      { label: 'hermes --help', cmd: 'hermes --help' },
      { label: 'claude --version', cmd: 'claude --version' },
      { label: 'ollama list', cmd: 'ollama list' },
      { label: 'git status', cmd: 'git status' },
    ],
  });
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    const body = await request.json<any>();
    const commandStr = (body.command || '').trim();
    const workingDir = body.cwd || process.cwd();
    const isStream = Boolean(body.stream || request.headers.get('Accept')?.includes('text/event-stream'));
    const timeoutMs = Math.min(Number(body.timeout) || 60000, 120000);

    if (!commandStr) {
      return json({ error: 'Command string is required' }, { status: 400 });
    }

    // Extended PATH including local user binaries
    const env = {
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
          });

          const timer = setTimeout(() => {
            child.kill('SIGTERM');
            send('error', { message: `Command timed out after ${timeoutMs / 1000}s` });
            send('exit', { code: 124, durationMs: Date.now() - startTime });

            try {
              controller.close();
            } catch {
              // Ignore
            }
          }, timeoutMs);

          const proc = child as any;

          proc.stdout.on('data', (chunk: any) => {
            send('stdout', { text: chunk.toString('utf-8') });
          });

          proc.stderr.on('data', (chunk: any) => {
            send('stderr', { text: chunk.toString('utf-8') });
          });

          proc.on('error', (err: any) => {
            send('error', { message: err?.message || String(err) });
          });

          proc.on('close', (code: any) => {
            clearTimeout(timer);
            send('exit', {
              code: code ?? 0,
              durationMs: Date.now() - startTime,
            });

            try {
              controller.close();
            } catch {
              // Ignore
            }
          });

          request.signal.addEventListener('abort', () => {
            clearTimeout(timer);
            child.kill('SIGTERM');

            try {
              controller.close();
            } catch {
              // Ignore
            }
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
        stdout += chunk.toString('utf-8');
      });

      proc.stderr.on('data', (chunk: any) => {
        stderr += chunk.toString('utf-8');
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
