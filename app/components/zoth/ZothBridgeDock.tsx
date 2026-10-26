import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { pendingPromptAppendAtom } from '~/lib/stores/studioStore';
import { soulPanelOpenAtom } from '~/lib/stores/soul';

interface BridgeStatus {
  studio: boolean;
  civilization: boolean;
  ollama: boolean;
  memory: boolean;
  tools: { name: string; command: string; available: boolean }[];
}

const SNIPPETS: Record<string, string> = {
  studio:
    'Match Zoth Studio chrome: gold #D4AF37, Space Grotesk + Inter, short MotionReveal fades, mono eyebrows. Link a "Open Studio" control to http://localhost:3000.',
  os: 'Add a Zoth OS strip: WebGen foundry, Studio at localhost:3000, civilization at localhost:9393, Memory at localhost:8094, AGY and Grok named as local agents. Honest status only.',
  civ: 'If this app needs a living world, point at Zoth Civilization on http://localhost:9393. Do not invent agents or a treasury number.',
  memory:
    'Link a Memory control to http://127.0.0.1:8094/#everywhere (Zoth Memory). Read-only. Do not invent memories.',
  grok: 'Footer note: local Grok CLI is available on this Zoth OS host. Do not fake a live Grok socket.',
  hermes: 'Footer note: Hermes Agent is a local CLI on this host. Do not fake a live Hermes session.',
  agy: 'Name AGY (Antigravity CLI) as the overnight coding agent on this machine. No fake terminal output.',
};

interface ZothBridgeDockProps {
  onInject?: (text: string) => void;
  onOpenAgy?: () => void;
  onOpenStudio?: () => void;
}

export function ZothBridgeDock({ onInject, onOpenAgy, onOpenStudio }: ZothBridgeDockProps) {
  const [status, setStatus] = useState<BridgeStatus | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/zoth/bridge')
      .then((res) => res.json() as Promise<BridgeStatus>)
      .then((data) => setStatus(data))
      .catch(() => setStatus(null));
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }

    const onDoc = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('[data-zoth-host-menu]')) {
        return;
      }
      setMenuOpen(false);
    };

    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [menuOpen]);

  const pill = (label: string, up?: boolean, href?: string, onClick?: () => void) => (
    <button
      key={label}
      type="button"
      onClick={() => {
        if (onClick) {
          onClick();
          return;
        }

        if (href) {
          window.open(href, '_blank', 'noopener');
        }
      }}
      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full border border-white/10 bg-black/40 text-[10px] font-mono text-white/80 hover:border-accent-500/40 hover:text-accent-200"
      title={up === undefined ? label : up ? `${label} is up` : `${label} is down`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${up ? 'bg-emerald-400' : up === false ? 'bg-white/25' : 'bg-accent-500'}`} />
      {label}
    </button>
  );

  const inject = (key: string) => {
    const text = SNIPPETS[key];

    if (!text) {
      return;
    }

    onInject?.(text);
    pendingPromptAppendAtom.set(text);
    toast.success(`Stacked ${key} into the prompt`);
    setMenuOpen(false);
  };

  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <div className="hidden lg:flex items-center gap-1.5">
        {pill('Studio', status?.studio, 'http://localhost:3000')}
        {pill('Memory', status?.memory, 'http://127.0.0.1:8094/#everywhere')}
        {pill('Civ', status?.civilization, 'http://localhost:9393')}
        {pill('Ollama', status?.ollama, 'http://127.0.0.1:11434')}
      </div>

      <div className="relative" data-zoth-host-menu>
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full border border-accent-500/30 bg-black/40 text-[10px] font-mono text-accent-500 hover:bg-accent-500/10"
          title="Zoth OS host tools"
        >
          <span className="i-ph:squares-four text-sm" />
          <span className="hidden sm:inline">Host</span>
        </button>
        {menuOpen && (
          <div
            className="absolute right-0 top-full mt-1 flex flex-col min-w-[220px] rounded-lg border border-[#D4AF37]/30 p-1 z-50 shadow-xl"
            style={{ backgroundColor: '#08080B', color: '#E8E4D9' }}
          >
            <button
              type="button"
              className="text-left px-2 py-1.5 text-[11px] font-mono rounded bg-transparent border-0"
              style={{ color: '#E8E4D9' }}
              onClick={() => {
                soulPanelOpenAtom.set(true);
                setMenuOpen(false);
              }}
            >
              Soul / Memory
            </button>
            <button
              type="button"
              className="text-left px-2 py-1.5 text-[11px] font-mono rounded bg-transparent border-0"
              style={{ color: '#E8E4D9' }}
              onClick={() => {
                onOpenStudio?.();
                setMenuOpen(false);
              }}
            >
              AI Studio
            </button>
            <button
              type="button"
              className="text-left px-2 py-1.5 text-[11px] font-mono rounded bg-transparent border-0"
              style={{ color: '#E8E4D9' }}
              onClick={() => {
                onOpenAgy?.();
                setMenuOpen(false);
              }}
            >
              AGY Terminal
            </button>
            <a
              href="http://127.0.0.1:8094/#everywhere"
              target="_blank"
              rel="noopener noreferrer"
              className="text-left px-2 py-1.5 text-[11px] font-mono rounded no-underline"
              style={{ color: '#D4AF37' }}
              onClick={() => setMenuOpen(false)}
            >
              Open Zoth Memory
            </a>
            <div className="h-px my-1" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
            <span className="px-2 py-1 text-[9px] font-mono uppercase tracking-wider" style={{ color: '#9A9488' }}>
              Inject into prompt
            </span>
            {Object.keys(SNIPPETS).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => inject(key)}
                className="text-left px-2 py-1 text-[11px] font-mono rounded bg-transparent border-0"
                style={{ color: '#E8E4D9' }}
              >
                {key}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
