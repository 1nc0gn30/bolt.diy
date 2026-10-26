import { useStore } from '@nanostores/react';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { playTactileClick, playSuccessChime } from '~/lib/modules/design-libraries/media-packs';
import { STUDIO_SYSTEM_PRESETS } from '~/lib/studio-system-presets';
import { studioTelemetryAtom } from '~/lib/stores/studioStore';

export interface AIStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeModel?: string;
  activeProvider?: string;
}

export type { StudioSystemPreset } from '~/lib/studio-system-presets';
export { STUDIO_SYSTEM_PRESETS } from '~/lib/studio-system-presets';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const AIStudioModal: React.FC<AIStudioModalProps> = ({
  isOpen,
  onClose,
  activeModel = 'gemini-2.5-flash',
  activeProvider = 'Google',
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('zoth-foundry');
  const [customInstructions, setCustomInstructions] = useState<string>('');
  const [temperature, setTemperature] = useState<number>(0.7);
  const [topP, setTopP] = useState<number>(0.95);
  const [maxTokens, setMaxTokens] = useState<number>(8192);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const telemetry = useStore(studioTelemetryAtom);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPreset = localStorage.getItem('zoth_studio_system_preset');

      if (savedPreset) {
        setSelectedPreset(savedPreset);
      }

      const savedTemp = localStorage.getItem('zoth_studio_temperature');

      if (savedTemp) {
        setTemperature(parseFloat(savedTemp));
      }

      const savedCustom = localStorage.getItem('zoth_studio_custom_instructions');

      if (savedCustom) {
        setCustomInstructions(savedCustom);
      }
    }
  }, []);

  const handlePresetSelect = (presetId: string) => {
    setSelectedPreset(presetId);

    if (soundEnabled) {
      playTactileClick();
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('zoth_studio_system_preset', presetId);
    }
  };

  const handleSaveSettings = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('zoth_studio_system_preset', selectedPreset);
      localStorage.setItem('zoth_studio_temperature', temperature.toString());
      localStorage.setItem('zoth_studio_custom_instructions', customInstructions);
    }

    if (soundEnabled) {
      playSuccessChime();
    }

    toast.success('⚡ Google AI Studio developer parameters saved!');
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0B0F17] text-white shadow-2xl p-5 sm:p-7 flex flex-col gap-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)] border border-blue-400/30">
                <span className="i-ph:cpu-duotone text-xl text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold tracking-tight text-white font-syne">
                    Google AI Studio Developer Console
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border border-blue-500/40 bg-blue-500/10 text-blue-400">
                    STUDIO HUD
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  Precision system instructions, temperature dials, and telemetry for WebGen
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <div className="i-ph:x text-lg" />
            </button>
          </div>

          {/* Model Telemetry Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/5 font-mono text-xs">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Active Model</span>
              <span className="font-bold text-[#D4AF37] truncate">{activeModel}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Provider</span>
              <span className="font-bold text-blue-400">{activeProvider}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Context Limit</span>
              <span className="font-bold text-emerald-400">1,000,000 Tokens</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Runtime</span>
              <span className="font-bold text-purple-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                WebContainer
              </span>
            </div>
          </div>

          {/* System Instructions Section */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="i-ph:chats-teardrop-fill text-blue-400" />
                <span>System Instructions (Persona & Architecture Rules)</span>
              </label>
              <span className="text-[11px] text-neutral-400">Google AI Studio Style</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {STUDIO_SYSTEM_PRESETS.map((preset) => {
                const isSelected = selectedPreset === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                      isSelected
                        ? 'border-blue-500/60 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                        : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{preset.name}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border border-white/10 text-neutral-400">
                        {preset.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-snug line-clamp-2">{preset.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Custom Directive Input */}
            <div className="flex flex-col gap-1.5 mt-1">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>Custom Directives (Appended to Persona)</span>
                <span>Optional</span>
              </div>
              <textarea
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="e.g. Always generate a dark mode toggle in the navbar, enforce mobile bottom-navigation, and use 3-column pricing tables..."
                className="w-full h-20 p-3 rounded-xl bg-black/50 border border-white/10 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-blue-500/50 resize-none font-mono"
              />
            </div>
          </div>

          {/* Model Tuning Dials */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/10 pt-4">
            {/* Temperature */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <span className="i-ph:thermometer-simple text-amber-400" />
                  Temperature
                </span>
                <span className="font-mono text-amber-400">{temperature.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={temperature}
                onChange={(e) => {
                  setTemperature(parseFloat(e.target.value));

                  if (soundEnabled) {
                    playTactileClick();
                  }
                }}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <span className="text-[10px] text-neutral-400">
                {temperature <= 0.3
                  ? '🎯 Precise / Deterministic'
                  : temperature <= 0.75
                    ? '⚖️ Balanced Full-Stack'
                    : '🎨 Creative Art Direction'}
              </span>
            </div>

            {/* Top P */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <span className="i-ph:sliders-horizontal text-blue-400" />
                  Top P
                </span>
                <span className="font-mono text-blue-400">{topP.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={topP}
                onChange={(e) => {
                  setTopP(parseFloat(e.target.value));

                  if (soundEnabled) {
                    playTactileClick();
                  }
                }}
                className="w-full accent-blue-400 cursor-pointer"
              />
              <span className="text-[10px] text-neutral-400">Nucleus sampling threshold</span>
            </div>

            {/* Max Output Tokens */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <span className="i-ph:cube text-purple-400" />
                  Max Output Tokens
                </span>
                <span className="font-mono text-purple-400">{maxTokens}</span>
              </div>
              <input
                type="range"
                min="2048"
                max="16384"
                step="1024"
                value={maxTokens}
                onChange={(e) => {
                  setMaxTokens(parseInt(e.target.value, 10));

                  if (soundEnabled) {
                    playTactileClick();
                  }
                }}
                className="w-full accent-purple-400 cursor-pointer"
              />
              <span className="text-[10px] text-neutral-400">Single generation completion ceiling</span>
            </div>
          </div>

          {/* Live Studio Telemetry Bar */}
          <div className="p-3 rounded-xl border border-white/5 bg-black/40 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  telemetry.status === 'streaming'
                    ? 'bg-amber-400 animate-ping'
                    : telemetry.status === 'complete'
                      ? 'bg-emerald-400'
                      : telemetry.status === 'error'
                        ? 'bg-red-400'
                        : 'bg-neutral-500'
                }`}
              />
              <span className="text-neutral-400 uppercase text-[10px] tracking-wider">Status:</span>
              <span className="font-bold text-white capitalize">{telemetry.status}</span>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-neutral-300">
              <div className="flex items-center gap-1.5">
                <span className="text-neutral-500">Latency:</span>
                <span className="text-cyan-400 font-semibold">{telemetry.latencyMs || 0}ms</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-neutral-500">Speed:</span>
                <span className="text-emerald-400 font-semibold">{telemetry.tokensPerSec || 0} tps</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-neutral-500">Tokens:</span>
                <span className="text-purple-400 font-semibold">{telemetry.totalTokens?.toLocaleString() || 0}</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="text-neutral-500">Context Window:</span>
                <span className="text-blue-400 font-semibold">1M tokens</span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-1">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
            >
              <div className={soundEnabled ? 'i-ph:speaker-high-fill text-blue-400' : 'i-ph:speaker-slash'} />
              <span>{soundEnabled ? 'Audio SFX On' : 'Audio SFX Muted'}</span>
            </button>
            <div className="flex items-center gap-2.5">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-300 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all font-mono"
              >
                Save & Apply to Studio
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
