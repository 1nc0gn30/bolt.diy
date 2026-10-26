import { atom } from 'nanostores';

export const SOUL_STORAGE_KEY = 'zoth_webgen_soul';
export const MEMORY_STORAGE_KEY = 'zoth_webgen_memory';

export const DEFAULT_WEBGEN_SOUL = `# Soul of Zoth Bolt

I am Zoth Bolt, the primary full-stack AI & motion architect inside ZothOS and Zoth Studio — evolved from the open-source bolt.diy foundation into a sovereign powerhouse.

- Gold #D4AF37 on obsidian #08080B. Space Grotesk for display, Inter for body, unless a stacked preset names another pairing.
- Finish the site. One idea. One accent. Real headlines and verb buttons.
- Stay in the WebContainer. Do not edit the host tree. Do not invent a paywall.
- I can call Studio, AGY, Grok, Hermes, Claude, OpenCode, Cline, and Aider from this workbench, plus 200k+ SVG & pixel-art assets via MCP.
- Manner: quiet and decisive. Say the decision and stop.
`;

export const DEFAULT_WEBGEN_MEMORY = `# Memory of Zoth Bolt

- Engine: Zoth Bolt on 127.0.0.1:5173 (built on open-source bolt.diy, supercharged for Zoth Studio & ZothOS), folder ~/NullAITech/bolt.diy.
- Family: ZothOS site zothos.nullai.tech, Zoth Studio zoth.nullai.tech / :3000, Zoth QuickSite Starter :8092, Zoth Civilization :9393, Zoth Memory :8094/#everywhere.
- Default stack: Vite + React 19, gold foundry, Space Grotesk + Inter, 6 motion edit templates, and 200k+ free vector/pixel-art assets.
- Follow-ups edit the live site. They do not scaffold a second project.

## Recent builds
`;

function readStorage(key: string, fallback: string): string {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

export const soulAtom = atom<string>(DEFAULT_WEBGEN_SOUL);
export const memoryAtom = atom<string>(DEFAULT_WEBGEN_MEMORY);
export const soulPanelOpenAtom = atom<boolean>(false);

export function hydrateSoulStore() {
  if (typeof window === 'undefined') {
    return;
  }

  soulAtom.set(readStorage(SOUL_STORAGE_KEY, DEFAULT_WEBGEN_SOUL));
  memoryAtom.set(readStorage(MEMORY_STORAGE_KEY, DEFAULT_WEBGEN_MEMORY));
}

function writeStorage(key: string, value: string) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(key, value);
  } catch {
    // Quota or private mode — keep the in-memory value.
  }
}

export function setSoul(next: string) {
  soulAtom.set(next);
  writeStorage(SOUL_STORAGE_KEY, next);
}

export function setMemory(next: string) {
  memoryAtom.set(next);
  writeStorage(MEMORY_STORAGE_KEY, next);
}

export function rememberBuild(entry: { prompt: string; model: string; provider: string; files: number }) {
  const stamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
  const line = `- ${stamp} · ${entry.provider}/${entry.model} · ${entry.files} files · ${entry.prompt.replace(/\s+/g, ' ').slice(0, 160)}`;
  const current = memoryAtom.get() || DEFAULT_WEBGEN_MEMORY;
  const marker = '## Recent builds';
  const idx = current.indexOf(marker);
  const head = idx >= 0 ? current.slice(0, idx + marker.length) : `${current.trim()}\n\n${marker}`;
  const tail = idx >= 0 ? current.slice(idx + marker.length) : '';
  const recent = `${line}\n${tail}`.split('\n').filter(Boolean).slice(0, 24).join('\n');
  setMemory(`${head}\n${recent}\n`);
}

if (typeof window !== 'undefined') {
  hydrateSoulStore();
}
