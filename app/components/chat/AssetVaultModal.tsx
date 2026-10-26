import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
  PIXEL_ART_ICONS,
  BESPOKE_SVG_CRESTS,
  MOTION_EDIT_TEMPLATES,
  CURATED_PHOTOGRAPHY_PACKS,
  SYNTHETIC_SFX_COLLECTION,
  playTactileClick,
} from '~/lib/modules/design-libraries/media-packs';

interface AssetVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInjectPrompt: (snippet: string) => void;
}

export const AssetVaultModal: React.FC<AssetVaultModalProps> = ({ isOpen, onClose, onInjectPrompt }) => {
  const [tab, setTab] = useState<'motion' | 'pixel' | 'svg' | 'iconify' | 'media'>('motion');
  const [iconQuery, setIconQuery] = useState('rocket');
  const [iconCollection, setIconCollection] = useState('pixelarticons');
  const [iconResults, setIconResults] = useState<string[]>([
    'pixelarticons:zap',
    'pixelarticons:heart',
    'pixelarticons:shield',
    'pixelarticons:trophy',
    'pixelarticons:coin',
    'pixelarticons:android',
    'pixelarticons:code',
    'pixelarticons:gamepad',
    'lucide:sparkles',
    'lucide:cpu',
    'lucide:rocket',
    'lucide:terminal',
  ]);
  const [searching, setSearching] = useState(false);
  const [diceSeed, setDiceSeed] = useState('ZothBolt');

  if (!isOpen) {
    return null;
  }

  const handleSearchIconify = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!iconQuery.trim()) {
      return;
    }

    setSearching(true);

    try {
      const prefixParam = iconCollection === 'all' ? '' : `&prefix=${encodeURIComponent(iconCollection)}`;
      const res = await fetch(
        `https://api.iconify.design/search?query=${encodeURIComponent(iconQuery.trim())}&limit=24${prefixParam}`,
      );
      const data = (await res.json()) as { icons?: string[] };

      if (data?.icons && data.icons.length > 0) {
        setIconResults(data.icons);
      } else {
        toast.info('No icons matched that query — try another keyword.');
      }
    } catch {
      toast.error('Offline or unable to reach Iconify API — use built-in Pixel Art & SVG packs.');
    } finally {
      setSearching(false);
    }
  };

  const injectAndNotify = (snippet: string, label: string) => {
    playTactileClick();
    onInjectPrompt(snippet);
    toast.success(`⚡ Injected ${label} into Zoth Bolt prompt!`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[88vh] flex flex-col rounded-2xl border border-[#D4AF37]/40 bg-[#0B0C12] shadow-[0_0_60px_rgba(212,175,55,0.2)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#10121B]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <div className="i-ph:sparkle-fill text-lg" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Zoth Bolt Asset, Motion &amp; Pixel Vault</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37]">
                  MCP + 200K+ FREE ASSETS
                </span>
              </h2>
              <p className="text-xs text-white/60 font-mono">
                1-click inject Motion Edit Templates, 16-bit Pixel Art SVGs, Bespoke Vector Crests, and Free Iconify/Unsplash Media
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <div className="i-ph:x-bold text-sm" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1.5 px-5 py-2.5 border-b border-white/10 bg-[#0D0F17] overflow-x-auto">
          {[
            { id: 'motion', label: '🎬 Motion Edit Templates (6)' },
            { id: 'pixel', label: '👾 16-Bit Pixel Art SVGs (8)' },
            { id: 'svg', label: '🛡️ Bespoke Vector Crests (4)' },
            { id: 'iconify', label: '🔍 Free Iconify & DiceBear (200k+)' },
            { id: 'media', label: '📸 HD Photos & WebAudio SFX' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer shrink-0 ${
                tab === t.id
                  ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {tab === 'motion' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {MOTION_EDIT_TEMPLATES.map((tpl) => (
                <div
                  key={tpl.id}
                  className="p-4 rounded-xl border border-white/10 bg-[#121521] hover:border-[#D4AF37]/50 transition-all flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border"
                        style={{
                          color: tpl.accent,
                          borderColor: `${tpl.accent}55`,
                          backgroundColor: `${tpl.accent}18`,
                        }}
                      >
                        {tpl.badge}
                      </span>
                      <span className="text-[10px] font-mono text-white/40">{tpl.id}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">{tpl.name}</h3>
                    <p className="text-xs text-white/65 leading-relaxed">{tpl.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => injectAndNotify(tpl.prompt, tpl.name)}
                    className="w-full py-2 px-3 rounded-lg bg-[#D4AF37]/15 hover:bg-[#D4AF37] text-[#F5E6AB] hover:text-black border border-[#D4AF37]/40 font-mono text-xs font-bold transition-all cursor-pointer"
                  >
                    + Inject Motion Edit Spec into Prompt
                  </button>
                </div>
              ))}
            </div>
          )}

          {tab === 'pixel' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PIXEL_ART_ICONS.map((icon) => (
                <div
                  key={icon.id}
                  className="p-3.5 rounded-xl border border-white/10 bg-[#121521] hover:border-[#D4AF37]/50 flex flex-col items-center text-center gap-2.5"
                >
                  <div
                    className="w-14 h-14 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: icon.svg }}
                  />
                  <div>
                    <div className="text-xs font-bold text-white">{icon.name}</div>
                    <div className="text-[10px] font-mono text-white/45 uppercase">{icon.category} · 16x16 SVG</div>
                  </div>
                  <div className="flex gap-1.5 w-full">
                    <button
                      type="button"
                      onClick={() =>
                        injectAndNotify(
                          `Include this crisp 16x16 pixel-art inline SVG icon (${icon.name}):\n${icon.svg}`,
                          icon.name,
                        )
                      }
                      className="flex-1 py-1.5 px-2 rounded bg-[#D4AF37]/20 hover:bg-[#D4AF37] text-[#F5E6AB] hover:text-black text-[11px] font-mono font-bold transition-all cursor-pointer"
                    >
                      + Prompt
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(icon.svg);
                        toast.success(`Copied ${icon.name} SVG!`);
                      }}
                      className="py-1.5 px-2 rounded bg-white/5 hover:bg-white/15 text-white/75 text-[11px] font-mono cursor-pointer"
                    >
                      SVG
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'svg' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BESPOKE_SVG_CRESTS.map((crest) => (
                <div
                  key={crest.id}
                  className="p-4 rounded-xl border border-white/10 bg-[#121521] hover:border-[#D4AF37]/50 flex items-center gap-4"
                >
                  <div
                    className="w-20 h-20 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center shrink-0 p-2"
                    dangerouslySetInnerHTML={{ __html: crest.svg }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-mono text-[#D4AF37] uppercase">{crest.theme}</div>
                    <h4 className="text-sm font-bold text-white mb-2">{crest.name}</h4>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          injectAndNotify(
                            `Embed this bespoke multi-layered vector SVG crest (${crest.name}) in the hero/header:\n${crest.svg}`,
                            crest.name,
                          )
                        }
                        className="py-1.5 px-3 rounded-lg bg-[#D4AF37]/20 hover:bg-[#D4AF37] text-[#F5E6AB] hover:text-black text-xs font-mono font-bold transition-all cursor-pointer"
                      >
                        + Inject SVG Crest
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(crest.svg);
                          toast.success(`Copied ${crest.name} SVG!`);
                        }}
                        className="py-1.5 px-2.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/75 text-xs font-mono cursor-pointer"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'iconify' && (
            <div className="space-y-4">
              <form onSubmit={handleSearchIconify} className="flex flex-wrap gap-2">
                <select
                  value={iconCollection}
                  onChange={(e) => setIconCollection(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-white text-xs font-mono"
                >
                  <option value="pixelarticons">Pixelarticons (8-Bit Pixel Art)</option>
                  <option value="lucide">Lucide (Clean Vector)</option>
                  <option value="ph">Phosphor (Editorial Vector)</option>
                  <option value="game-icons">Game-Icons (RPG &amp; Fantasy)</option>
                  <option value="simple-icons">Simple-Icons (Brand Logos)</option>
                  <option value="all">All 200,000+ Free Icons</option>
                </select>
                <input
                  type="text"
                  value={iconQuery}
                  onChange={(e) => setIconQuery(e.target.value)}
                  placeholder="Search free icons (e.g. sword, bolt, terminal, shield, coin)..."
                  className="flex-1 min-w-[180px] px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-white text-xs font-mono"
                />
                <button
                  type="submit"
                  disabled={searching}
                  className="px-4 py-2 rounded-lg bg-[#D4AF37] text-black font-mono text-xs font-bold cursor-pointer"
                >
                  {searching ? 'Searching...' : 'Search Free Icons'}
                </button>
              </form>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {iconResults.map((iconName) => {
                  const [prefix, name] = iconName.split(':');
                  const svgUrl = `https://api.iconify.design/${prefix}/${name}.svg?color=%23D4AF37`;

                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() =>
                        injectAndNotify(
                          `Use Iconify SVG icon "${iconName}" via <img src="${svgUrl}" alt="${name} icon" width="24" height="24" />`,
                          iconName,
                        )
                      }
                      className="p-2.5 rounded-xl border border-white/10 bg-[#121521] hover:border-[#D4AF37] flex flex-col items-center gap-1.5 cursor-pointer group"
                      title={`Click to inject ${iconName}`}
                    >
                      <img src={svgUrl} alt={`${name} icon`} className="w-7 h-7 object-contain" />
                      <span className="text-[10px] font-mono text-white/70 truncate w-full text-center group-hover:text-[#F5E6AB]">
                        {name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* DiceBear Free Pixel-Art Avatar Generator */}
              <div className="p-4 rounded-xl border border-white/10 bg-[#121521] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(diceSeed)}`}
                    alt={`Pixel art avatar for ${diceSeed}`}
                    className="w-12 h-12 rounded-lg bg-black/60 border border-[#D4AF37]/40 p-1"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">Free DiceBear Pixel-Art Character Sprite</div>
                    <div className="text-[11px] font-mono text-white/55">
                      Deterministic zero-key SVG sprite generator
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={diceSeed}
                    onChange={(e) => setDiceSeed(e.target.value)}
                    placeholder="Sprite seed..."
                    className="px-2.5 py-1.5 rounded bg-black/60 border border-white/15 text-white text-xs font-mono w-36"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      injectAndNotify(
                        `Use this free pixel-art character sprite SVG: https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(diceSeed)}`,
                        `DiceBear Pixel Sprite (${diceSeed})`,
                      )
                    }
                    className="px-3 py-1.5 rounded bg-[#D4AF37]/20 hover:bg-[#D4AF37] text-[#F5E6AB] hover:text-black text-xs font-mono font-bold cursor-pointer"
                  >
                    + Inject Sprite
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab === 'media' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CURATED_PHOTOGRAPHY_PACKS.slice(0, 6).map((photo) => (
                  <div
                    key={photo.id}
                    className="p-3 rounded-xl border border-white/10 bg-[#121521] flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono uppercase text-[#D4AF37]">{photo.industry}</span>
                      <div className="text-xs font-bold text-white truncate">{photo.title}</div>
                      <div className="text-[10px] text-white/50 truncate">{photo.alt}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        injectAndNotify(
                          `Include high-res verified image "${photo.title}": <img src="${photo.url}" alt="${photo.alt}" />`,
                          photo.title,
                        )
                      }
                      className="px-2.5 py-1.5 rounded bg-[#D4AF37]/20 hover:bg-[#D4AF37] text-[#F5E6AB] hover:text-black text-xs font-mono font-bold shrink-0 cursor-pointer"
                    >
                      + Photo
                    </button>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SYNTHETIC_SFX_COLLECTION.map((sfx) => (
                  <div
                    key={sfx.id}
                    className="p-3 rounded-xl border border-white/10 bg-[#121521] flex items-center justify-between gap-3"
                  >
                    <div>
                      <span className="text-[10px] font-mono uppercase text-cyan-400">WebAudio Synth SFX</span>
                      <div className="text-xs font-bold text-white">{sfx.name}</div>
                      <div className="text-[10px] text-white/55">{sfx.description}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        injectAndNotify(
                          `Add zero-dependency WebAudio sound effect (${sfx.name}):\n\`\`\`ts\n${sfx.implementationCode}\n\`\`\``,
                          sfx.name,
                        )
                      }
                      className="px-2.5 py-1.5 rounded bg-cyan-500/20 hover:bg-cyan-400 text-cyan-300 hover:text-black text-xs font-mono font-bold shrink-0 cursor-pointer"
                    >
                      + SFX
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
