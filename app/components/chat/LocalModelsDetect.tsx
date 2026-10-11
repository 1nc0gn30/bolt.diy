import { useCallback, useEffect, useState } from 'react';
import { classNames } from '~/utils/classNames';

interface DetectedServer {
  id: string;
  label: string;
  provider: string;
  online: boolean;
  latencyMs?: number;
  models: string[];
}

interface LocalModelsDetectProps {
  activeProvider?: string;
  activeModel?: string;
  onSelect: (providerName: string, modelName: string) => void;
}

/** Auto-detects running local model servers (Ollama, LM Studio, llama.cpp, vLLM, Zoth Local) and offers 1-click selection. */
export function LocalModelsDetect({ activeProvider, activeModel, onSelect }: LocalModelsDetectProps) {
  const [servers, setServers] = useState<DetectedServer[]>([]);
  const [loading, setLoading] = useState(false);

  const scan = useCallback(async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/local-models');
      const data = (await res.json()) as { servers?: DetectedServer[] };
      setServers((data.servers || []).filter((s) => s.online));
    } catch {
      setServers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    scan();
  }, [scan]);

  const pills = servers.flatMap((s) => s.models.slice(0, 6).map((m) => ({ server: s, model: m })));

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 px-0.5 [&::-webkit-scrollbar]:h-1">
      <span className="font-semibold text-bolt-elements-textPrimary tracking-wide uppercase text-[10px] whitespace-nowrap">
        Local detected
      </span>
      <button
        type="button"
        onClick={scan}
        title="Rescan local model servers"
        className="flex items-center px-1.5 py-0.5 rounded-md text-[10px] text-bolt-elements-textTertiary hover:text-bolt-elements-textPrimary border border-bolt-elements-borderColor/60 flex-shrink-0"
      >
        <span className={classNames('i-ph:arrows-clockwise text-xs', loading ? 'animate-spin' : '')} />
      </button>
      {!loading && pills.length === 0 && (
        <span className="text-[10px] text-bolt-elements-textTertiary whitespace-nowrap">
          No local servers found (Ollama :11434, LM Studio :1234, llama.cpp :8080, vLLM :8000)
        </span>
      )}
      {pills.map(({ server, model }) => {
        const active = activeProvider === server.provider && activeModel === model;

        return (
          <button
            key={`${server.id}:${model}`}
            type="button"
            onClick={() => onSelect(server.provider, model)}
            title={`${server.label}${server.latencyMs !== undefined ? ` · ${server.latencyMs}ms` : ''}`}
            className={classNames(
              'flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] whitespace-nowrap flex-shrink-0 border transition-all',
              active
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                : 'bg-bolt-elements-background-depth-3 text-bolt-elements-textSecondary border-bolt-elements-borderColor/60 hover:text-bolt-elements-textPrimary',
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="font-mono">{model}</span>
            <span className="text-[9px] text-bolt-elements-textTertiary">{server.label}</span>
          </button>
        );
      })}
    </div>
  );
}
