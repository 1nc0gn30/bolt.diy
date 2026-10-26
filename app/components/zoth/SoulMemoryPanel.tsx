import { useStore } from '@nanostores/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Dialog, DialogDescription, DialogRoot, DialogTitle } from '~/components/ui/Dialog';
import {
  DEFAULT_WEBGEN_MEMORY,
  DEFAULT_WEBGEN_SOUL,
  memoryAtom,
  setMemory,
  setSoul,
  soulAtom,
  soulPanelOpenAtom,
} from '~/lib/stores/soul';

interface CivMind {
  name: string;
  soul: string;
  memory: string;
}

interface EverywhereItem {
  source?: string;
  title?: string;
  path?: string;
  text?: string;
  scope?: string;
}

interface EverywherePayload {
  sources?: { id: string; label: string; count: number; ok: boolean }[];
  items?: EverywhereItem[];
  error?: string;
}

export function SoulMemoryPanel() {
  const open = useStore(soulPanelOpenAtom);
  const soul = useStore(soulAtom);
  const memory = useStore(memoryAtom);
  const [tab, setTab] = useState<'soul' | 'memory' | 'everywhere' | 'civ'>('soul');
  const [civMinds, setCivMinds] = useState<CivMind[]>([]);
  const [civError, setCivError] = useState<string>('');
  const [activeMind, setActiveMind] = useState<string>('');
  const [everywhere, setEverywhere] = useState<EverywherePayload | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    fetch('/api/zoth/soul')
      .then((res) => res.json() as Promise<{ minds?: CivMind[]; error?: string }>)
      .then((data) => {
        if (Array.isArray(data.minds)) {
          setCivMinds(data.minds);
          setActiveMind(data.minds[0]?.name || '');
          setCivError('');
        } else {
          setCivError(data.error || 'Civilization minds are offline');
        }
      })
      .catch(() => {
        setCivError('Could not read civilization minds');
      });

    fetch('/api/zoth/everywhere?limit=40')
      .then((res) => res.json() as Promise<EverywherePayload>)
      .then((data) => setEverywhere(data))
      .catch(() => setEverywhere({ items: [], error: 'Could not reach Zoth Memory' }));
  }, [open]);

  const active = civMinds.find((mind) => mind.name === activeMind);

  return (
    <DialogRoot open={open} onOpenChange={(next) => soulPanelOpenAtom.set(next)}>
      {open && (
        <Dialog
          className="!max-w-[920px] !w-[94vw] p-5 !bg-gray-950 !text-gray-200 border border-gray-800"
          onClose={() => soulPanelOpenAtom.set(false)}
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <DialogTitle className="!text-white">Soul and memory</DialogTitle>
              <DialogDescription className="!text-gray-400">
                WebGen soul, this foundry's memory, Zoth Memory everywhere, and civilization minds on this host.
              </DialogDescription>
            </div>
          </div>

          <div className="flex gap-1 mb-3">
            {(['soul', 'memory', 'everywhere', 'civ'] as const).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`px-3 py-1 rounded-full text-[11px] font-mono border ${
                  tab === id
                    ? 'border-accent-500 bg-accent-950 text-accent-200'
                    : 'border-gray-800 bg-gray-900 text-gray-400 hover:text-white'
                }`}
              >
                {id === 'soul'
                  ? 'WebGen soul'
                  : id === 'memory'
                    ? 'WebGen memory'
                    : id === 'everywhere'
                      ? 'Everywhere'
                      : 'Civilization minds'}
              </button>
            ))}
          </div>

          {tab === 'soul' && (
            <div className="flex flex-col gap-2">
              <textarea
                value={soul}
                onChange={(event) => setSoul(event.target.value)}
                className="w-full h-72 p-3 rounded-xl bg-black border border-gray-800 text-xs text-gray-200 font-mono resize-y"
                style={{ color: '#E5E5E5', backgroundColor: '#08080B' }}
              />
              <div className="flex justify-between">
                <button
                  type="button"
                  className="px-3 py-1 rounded-lg border border-gray-800 text-[11px] font-mono text-gray-400 hover:text-white"
                  onClick={() => setSoul(DEFAULT_WEBGEN_SOUL)}
                >
                  Restore default soul
                </button>
                <button
                  type="button"
                  className="px-3 py-1 rounded-lg border border-accent-500 text-[11px] font-mono text-accent-500"
                  onClick={() => {
                    toast.success('Soul saved. The next build will carry it.');
                    soulPanelOpenAtom.set(false);
                  }}
                >
                  Keep soul
                </button>
              </div>
            </div>
          )}

          {tab === 'memory' && (
            <div className="flex flex-col gap-2">
              <textarea
                value={memory}
                onChange={(event) => setMemory(event.target.value)}
                className="w-full h-72 p-3 rounded-xl bg-black border border-gray-800 text-xs text-gray-200 font-mono resize-y"
                style={{ color: '#E5E5E5', backgroundColor: '#08080B' }}
              />
              <div className="flex justify-between">
                <button
                  type="button"
                  className="px-3 py-1 rounded-lg border border-gray-800 text-[11px] font-mono text-gray-400 hover:text-white"
                  onClick={() => setMemory(DEFAULT_WEBGEN_MEMORY)}
                >
                  Restore default memory
                </button>
                <button
                  type="button"
                  className="px-3 py-1 rounded-lg border border-accent-500 text-[11px] font-mono text-accent-500"
                  onClick={() => {
                    toast.success('Memory saved.');
                    soulPanelOpenAtom.set(false);
                  }}
                >
                  Keep memory
                </button>
              </div>
            </div>
          )}

          {tab === 'everywhere' && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-mono text-gray-400">
                  Read-only federation from Zoth Memory on 127.0.0.1:8094.
                </p>
                <a
                  href="http://127.0.0.1:8094/#everywhere"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-mono text-accent-500 hover:text-accent-200"
                >
                  Open app
                </a>
              </div>
              {everywhere?.error && <p className="text-[11px] text-rose-300">{everywhere.error}</p>}
              <div className="flex flex-wrap gap-1.5">
                {(everywhere?.sources || []).map((source) => (
                  <span
                    key={source.id}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                      source.ok ? 'border-accent-500/40 text-accent-200' : 'border-gray-800 text-gray-500'
                    }`}
                  >
                    {source.label} · {source.count}
                  </span>
                ))}
              </div>
              <div className="overflow-y-auto max-h-80 rounded-lg border border-gray-800 bg-black divide-y divide-gray-900">
                {(everywhere?.items || []).length === 0 && !everywhere?.error && (
                  <p className="p-3 text-[11px] text-gray-500">No federated notes yet.</p>
                )}
                {(everywhere?.items || []).map((item, index) => (
                  <article key={`${item.path || item.title || 'item'}-${index}`} className="p-3">
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-accent-500">
                        {item.source || 'note'}
                      </span>
                      <span className="text-[10px] font-mono text-gray-500 truncate">{item.path}</span>
                    </div>
                    <h3 className="text-xs text-white mb-1">{item.title || item.scope || 'Memory'}</h3>
                    <p className="text-[11px] font-mono text-gray-300 whitespace-pre-wrap line-clamp-6">
                      {(item.text || '').slice(0, 700)}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          )}

          {tab === 'civ' && (
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-3 min-h-[20rem]">
              <div className="flex flex-col gap-1 overflow-y-auto max-h-80 border border-gray-800 rounded-lg p-1 bg-black">
                {civError && <p className="text-[11px] text-gray-400 p-2">{civError}</p>}
                {civMinds.map((mind) => (
                  <button
                    key={mind.name}
                    type="button"
                    onClick={() => setActiveMind(mind.name)}
                    className={`text-left px-2 py-1.5 rounded-md text-[11px] font-mono ${
                      activeMind === mind.name
                        ? 'bg-accent-950 text-accent-200'
                        : 'bg-transparent text-gray-400 hover:text-white'
                    }`}
                  >
                    {mind.name}
                  </button>
                ))}
              </div>
              <div
                className="overflow-y-auto max-h-80 rounded-lg border border-gray-800 p-3 font-mono text-[11px] whitespace-pre-wrap text-gray-200 bg-black"
                style={{ color: '#E5E5E5', backgroundColor: '#08080B' }}
              >
                {active ? (
                  <>
                    <div className="text-accent-500 mb-2">soul.md</div>
                    {active.soul || 'Empty soul.'}
                    <div className="text-accent-500 mt-4 mb-2">memory.md</div>
                    {active.memory || 'Empty memory.'}
                  </>
                ) : (
                  <span className="text-gray-500">
                    No civilization mind loaded. Start the civilization server on 9393 to refresh later.
                  </span>
                )}
              </div>
            </div>
          )}
        </Dialog>
      )}
    </DialogRoot>
  );
}
