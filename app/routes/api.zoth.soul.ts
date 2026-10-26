import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';

const MINDS_DIR = '/home/zoth/NullAITech/zoth-civilization/data/minds';
const SKIP = /^(SUB_|KEEPER_|daemon|graph|spool|active_)/;
const MAX_CHARS = 6000;

function readCapped(filePath: string): string {
  try {
    if (!existsSync(filePath)) {
      return '';
    }

    const text = readFileSync(filePath, 'utf8');
    return text.length > MAX_CHARS ? `${text.slice(0, MAX_CHARS)}\n…` : text;
  } catch {
    return '';
  }
}

export async function loader(_args: LoaderFunctionArgs) {
  if (!existsSync(MINDS_DIR)) {
    return json({ minds: [], error: 'Civilization minds folder is not on this host' });
  }

  const names = readdirSync(MINDS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !SKIP.test(entry.name))
    .map((entry) => entry.name)
    .sort();

  const minds = names.map((name) => ({
    name,
    soul: readCapped(join(MINDS_DIR, name, 'soul.md')),
    memory: readCapped(join(MINDS_DIR, name, 'memory.md')),
  }));

  return json({ minds });
}
