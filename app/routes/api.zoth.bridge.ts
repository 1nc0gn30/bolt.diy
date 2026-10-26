import { execSync } from 'node:child_process';
import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';

async function ping(url: string, timeoutMs = 800): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    return response.status < 500;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

function which(command: string): boolean {
  try {
    execSync(`command -v ${command}`, {
      stdio: 'ignore',
      env: {
        ...process.env,
        PATH: `/home/zoth/.local/bin:/usr/local/bin:/usr/bin:/bin:${process.env.PATH || ''}`,
      },
    });
    return true;
  } catch {
    return false;
  }
}

export async function loader(_args: LoaderFunctionArgs) {
  const [studio, civilization, ollama, memory] = await Promise.all([
    ping('http://127.0.0.1:3000'),
    ping('http://127.0.0.1:9393/api/lineage'),
    ping('http://127.0.0.1:11434/api/tags'),
    ping('http://127.0.0.1:8094/api/health'),
  ]);

  return json({
    studio,
    civilization,
    ollama,
    memory,
    tools: [
      { name: 'Grok CLI', command: 'grok', available: which('grok') },
      { name: 'Hermes', command: 'hermes', available: which('hermes') },
      { name: 'AGY', command: 'agy', available: which('agy') },
      { name: 'Cline', command: 'cline', available: which('cline') },
      { name: 'Aider', command: 'aider', available: which('aider') },
    ],
  });
}
