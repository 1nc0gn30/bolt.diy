import React from 'react';
import { toast } from 'react-toastify';
import { playTactileClick } from '~/lib/modules/design-libraries/media-packs';
import { isAIStudioOpenAtom } from '~/lib/stores/studioStore';
import { STUDIO_PRESETS, type DesignScheme } from '~/types/design-scheme';

interface NoahAestheticStripProps {
  designScheme?: DesignScheme;
  setDesignScheme?: (scheme: DesignScheme) => void;
  onOpenAIStudio?: () => void;
}

export const NoahAestheticStrip: React.FC<NoahAestheticStripProps> = ({
  designScheme,
  setDesignScheme,
  onOpenAIStudio,
}) => {
  const currentTypography = designScheme?.typographyPairing || 'space-grotesk-inter';

  const handleSelectPreset = (presetId: string) => {
    const preset = STUDIO_PRESETS.find((p) => p.id === presetId);

    if (!preset || !setDesignScheme) {
      return;
    }

    playTactileClick();

    const updatedScheme: DesignScheme = {
      palette: preset.scheme.palette || designScheme?.palette || {},
      features: preset.scheme.features || designScheme?.features || [],
      font: preset.scheme.font || designScheme?.font || ['space-grotesk', 'inter'],
      framework: preset.scheme.framework || designScheme?.framework || 'vite-react',
      uiLibrary: preset.scheme.uiLibrary || designScheme?.uiLibrary || 'shadcn-ui',
      animationLibrary: preset.scheme.animationLibrary || designScheme?.animationLibrary || 'framer-motion',
      commodities: preset.scheme.commodities || designScheme?.commodities || [],
      typographyPairing: preset.scheme.typographyPairing || designScheme?.typographyPairing || 'space-grotesk-inter',
    };

    setDesignScheme(updatedScheme);

    if (typeof window !== 'undefined') {
      localStorage.setItem('zoth_design_scheme', JSON.stringify(updatedScheme));
    }

    toast.success(`✨ Style Active: ${preset.name}`);
  };

  const PRESET_CHIPS = [
    {
      id: 'zoth-avant-garde',
      label: 'Sovereign Gold',
      icon: '🏆',
      accentColor: '#D4AF37',
      pairing: 'syne-space-grotesk',
    },
    {
      id: 'astro-high-speed',
      label: 'Aurora Cyber',
      icon: '🌌',
      accentColor: '#6366F1',
      pairing: 'cabinet-satoshi',
    },
    {
      id: 'cyberpunk-solana',
      label: 'Solana DePay',
      icon: '⚡',
      accentColor: '#10B981',
      pairing: 'unbounded-dm-sans',
    },
    {
      id: 'zero-build-pure-html',
      label: 'HTML5 Static',
      icon: '⚡',
      accentColor: '#F7DF1E',
      pairing: 'space-grotesk-inter',
    },
    {
      id: 'fintech-telemetry',
      label: 'Fintech Bento',
      icon: '📊',
      accentColor: '#00D8FF',
      pairing: 'jakarta-jetbrains',
    },
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto modern-scrollbar pb-1.5 mb-1.5 w-full text-xs select-none">
      <div className="flex items-center gap-1.5 shrink-0 pr-1">
        <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-neutral-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>Noah Style:</span>
        </span>
      </div>

      <div className="flex items-center gap-1.5 flex-nowrap shrink-0">
        {PRESET_CHIPS.map((chip) => {
          const isActive = currentTypography === chip.pairing;
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => handleSelectPreset(chip.id)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium transition-all cursor-pointer shrink-0 border ${
                isActive
                  ? 'border-[#D4AF37]/60 bg-[#D4AF37]/15 text-[#F5E6AB] shadow-[0_0_12px_rgba(212,175,55,0.25)] font-bold'
                  : 'border-white/5 bg-white/[0.03] text-neutral-300 hover:text-white hover:bg-white/[0.08] hover:border-white/20'
              }`}
              title={`Switch to ${chip.label} visual style`}
            >
              <span className="text-xs">{chip.icon}</span>
              <span>{chip.label}</span>
              {isActive && <span className="w-1 h-1 rounded-full bg-[#D4AF37] animate-ping ml-0.5" />}
            </button>
          );
        })}

        {/* AI Studio Trigger Pill */}
        <button
          type="button"
          onClick={() => {
            if (onOpenAIStudio) {
              onOpenAIStudio();
            } else {
              isAIStudioOpenAtom.set(true);
            }
          }}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold border border-blue-500/40 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 hover:text-white transition-all cursor-pointer shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.15)] ml-1"
          title="Open Google AI Studio Developer Controls & System Instructions"
        >
          <span className="i-ph:sliders-horizontal text-xs text-blue-400" />
          <span>AI Studio Controls</span>
        </button>
      </div>
    </div>
  );
};
