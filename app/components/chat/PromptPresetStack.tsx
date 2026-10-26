import React, { useEffect, useMemo, useState } from 'react';
import {
  PRESET_GROUPS,
  PROMPT_PRESETS,
  applyPresetStack,
  parseStackedIds,
  type PromptPreset,
} from '~/lib/prompt-presets';

const STORAGE_KEY = 'zoth_webgen_preset_stack';

interface PromptPresetStackProps {
  input: string;
  onInput: (next: string) => void;
  compact?: boolean;
}

export const PromptPresetStack: React.FC<PromptPresetStackProps> = ({ input, onInput, compact = false }) => {
  const [selected, setSelected] = useState<string[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }

    return parseStackedIds(localStorage.getItem(STORAGE_KEY));
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
  }, [selected]);

  const stacked = useMemo(
    () => selected.map((id) => PROMPT_PRESETS.find((preset) => preset.id === id)).filter(Boolean) as PromptPreset[],
    [selected],
  );

  const toggle = (preset: PromptPreset) => {
    const nextIds = selected.includes(preset.id)
      ? selected.filter((id) => id !== preset.id)
      : [...selected, preset.id];
    const nextStacked = nextIds
      .map((id) => PROMPT_PRESETS.find((item) => item.id === id))
      .filter(Boolean) as PromptPreset[];
    setSelected(nextIds);
    onInput(applyPresetStack(input, nextStacked));
  };

  const clear = () => {
    setSelected([]);
    onInput(applyPresetStack(input, []));
  };

  return (
    <div className="w-full max-w-chat mx-auto flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-accent-500 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
          Stack onto the prompt
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-white/40">{selected.length} active</span>
          {selected.length > 0 && (
            <button
              type="button"
              onClick={clear}
              className="text-[10px] font-mono text-gray-400 hover:text-white bg-transparent border-0"
            >
              Clear stack
            </button>
          )}
        </div>
      </div>

      {stacked.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {stacked.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => toggle(preset)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-accent-500/40 bg-accent-500/10 text-[10px] font-mono text-accent-200"
              title="Remove from stack"
            >
              <span>{preset.label}</span>
              <span className="i-ph:x text-[9px]" />
            </button>
          ))}
        </div>
      )}

      {PRESET_GROUPS.map((group) => {
        const items = PROMPT_PRESETS.filter((preset) => preset.group === group.id);

        if (compact && group.id !== 'framework' && group.id !== 'zoth' && group.id !== 'visual') {
          return null;
        }

        return (
          <div key={group.id} className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 px-1">{group.label}</span>
            <div className="flex flex-wrap gap-1.5">
              {items.map((preset) => {
                const active = selected.includes(preset.id);
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => toggle(preset)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono border transition-colors ${
                      active
                        ? 'border-accent-500/60 bg-accent-500/15 text-accent-200'
                        : 'border-white/10 bg-white/[0.03] text-white/70 hover:border-white/25 hover:text-white'
                    }`}
                    title={preset.prompt}
                  >
                    <span>{preset.label}</span>
                    {preset.badge && <span className="text-[9px] opacity-70">{preset.badge}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
