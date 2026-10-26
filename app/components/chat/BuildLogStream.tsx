import { useStore } from '@nanostores/react';
import { useEffect, useRef } from 'react';
import { buildLogAtom, buildLogOpenAtom, clearBuildLog, type BuildLogKind } from '~/lib/stores/buildLog';

const KIND_COLOR: Record<BuildLogKind, string> = {
  info: 'text-white/70',
  file: 'text-cyan-300',
  shell: 'text-amber-300',
  start: 'text-emerald-300',
  continue: 'text-accent-200',
  error: 'text-rose-300',
  tokens: 'text-blue-300',
  tool: 'text-purple-300',
  progress: 'text-white/80',
};

const KIND_MARK: Record<BuildLogKind, string> = {
  info: 'INF',
  file: 'FIL',
  shell: 'SHL',
  start: 'RUN',
  continue: 'CNT',
  error: 'ERR',
  tokens: 'TOK',
  tool: 'TOL',
  progress: 'PRG',
};

export function BuildLogStream({ isStreaming }: { isStreaming?: boolean }) {
  const lines = useStore(buildLogAtom);
  const open = useStore(buildLogOpenAtom);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [lines.length, open]);

  if (lines.length === 0 && !isStreaming) {
    return null;
  }

  return (
    <div className="w-full max-w-chat mx-auto rounded-lg border border-white/10 bg-gray-950 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/10">
        <button
          type="button"
          onClick={() => buildLogOpenAtom.set(!open)}
          className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.16em] text-accent-500"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isStreaming ? 'bg-emerald-400 animate-pulse' : 'bg-white/30'}`} />
          Build log
          <span className="text-white/40 normal-case tracking-normal">{lines.length} lines</span>
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => clearBuildLog()}
            className="text-[10px] font-mono text-white/40 hover:text-white"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => buildLogOpenAtom.set(!open)}
            className="text-white/50 hover:text-white"
            aria-label={open ? 'Collapse build log' : 'Expand build log'}
          >
            <span className={open ? 'i-ph:caret-down' : 'i-ph:caret-up'} />
          </button>
        </div>
      </div>
      {open && (
        <div className="max-h-48 overflow-y-auto modern-scrollbar px-3 py-2 font-mono text-[11px] leading-relaxed">
          {lines.length === 0 && isStreaming && (
            <div className="text-white/40">Waiting for the first artifact line…</div>
          )}
          {lines.map((line) => (
            <div key={line.id} className="flex gap-2">
              <span className="text-white/25 shrink-0 tabular-nums">
                {new Date(line.ts).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <span className={`shrink-0 w-8 ${KIND_COLOR[line.kind]}`}>{KIND_MARK[line.kind]}</span>
              <span className={KIND_COLOR[line.kind]}>
                {line.message}
                {line.detail ? <span className="text-white/40"> · {line.detail}</span> : null}
              </span>
            </div>
          ))}
          <div ref={endRef} />
        </div>
      )}
    </div>
  );
}
