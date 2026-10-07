import React, { useState, useEffect, useMemo } from 'react';
import { Button } from './Button';
import { Dialog, DialogTitle, DialogDescription, DialogRoot } from './Dialog';
import { IconButton } from './IconButton';
import {
  FRAMEWORK_OPTIONS,
  UI_LIBRARIES,
  ANIMATION_LIBRARIES,
  COMMODITIES_AND_EFFECTS,
  TYPOGRAPHY_PAIRINGS,
  COLOR_PALETTES,
  type CatalogItem,
} from '~/lib/modules/design-libraries/catalog';
import type { DesignScheme, StudioPreset } from '~/types/design-scheme';
import {
  defaultDesignScheme,
  designFeatures,
  paletteRoles,
  curatedPaletteMaps,
  STUDIO_PRESETS,
} from '~/types/design-scheme';

export interface ColorSchemeDialogProps {
  designScheme?: DesignScheme;
  setDesignScheme?: (scheme: DesignScheme) => void;
}

type StudioTab = 'frameworks' | 'ui' | 'animation' | 'commodities' | 'typography' | 'colors' | 'features';

export const ColorSchemeDialog: React.FC<ColorSchemeDialogProps> = ({ setDesignScheme, designScheme }) => {
  const [palette, setPalette] = useState<{ [key: string]: string }>(() => {
    if (designScheme?.palette) {
      return { ...defaultDesignScheme.palette, ...designScheme.palette };
    }

    return defaultDesignScheme.palette;
  });

  const [features, setFeatures] = useState<string[]>(designScheme?.features || defaultDesignScheme.features);
  const [font, setFont] = useState<string[]>(designScheme?.font || defaultDesignScheme.font);

  const [framework, setFramework] = useState<string>(
    designScheme?.framework || defaultDesignScheme.framework || 'vite-react',
  );
  const [uiLibrary, setUiLibrary] = useState<string>(
    designScheme?.uiLibrary || defaultDesignScheme.uiLibrary || 'shadcn-ui',
  );

  const [animationLibrary, setAnimationLibrary] = useState<string>(
    designScheme?.animationLibrary || defaultDesignScheme.animationLibrary || 'framer-motion',
  );
  const [commodities, setCommodities] = useState<string[]>(
    designScheme?.commodities || defaultDesignScheme.commodities || ['conic-border-beam', 'aurora-mesh-gradient'],
  );
  const [typographyPairing, setTypographyPairing] = useState<string>(
    designScheme?.typographyPairing || defaultDesignScheme.typographyPairing || 'syne-space-grotesk',
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<StudioTab>('frameworks');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (designScheme) {
      setPalette(() => ({ ...defaultDesignScheme.palette, ...designScheme.palette }));
      setFeatures(designScheme.features || defaultDesignScheme.features);
      setFont(designScheme.font || defaultDesignScheme.font);
      setFramework(designScheme.framework || 'vite-react');
      setUiLibrary(designScheme.uiLibrary || 'shadcn-ui');
      setAnimationLibrary(designScheme.animationLibrary || 'framer-motion');
      setCommodities(designScheme.commodities || ['conic-border-beam', 'aurora-mesh-gradient']);
      setTypographyPairing(designScheme.typographyPairing || 'syne-space-grotesk');
    }
  }, [designScheme]);

  const handleColorChange = (role: string, value: string) => {
    setPalette((prev) => ({ ...prev, [role]: value }));
  };

  const handleFeatureToggle = (key: string) => {
    setFeatures((prev) => (prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]));
  };

  const handleCommodityToggle = (id: string) => {
    setCommodities((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleApplyPalette = (paletteId: string) => {
    const preset = curatedPaletteMaps[paletteId];

    if (preset) {
      setPalette({ ...palette, ...preset });
    }
  };

  const handleApplyPreset = (preset: StudioPreset) => {
    if (preset.scheme.framework) {
      setFramework(preset.scheme.framework);
    }

    if (preset.scheme.uiLibrary) {
      setUiLibrary(preset.scheme.uiLibrary);
    }

    if (preset.scheme.animationLibrary) {
      setAnimationLibrary(preset.scheme.animationLibrary);
    }

    if (preset.scheme.typographyPairing) {
      setTypographyPairing(preset.scheme.typographyPairing);
    }

    if (preset.scheme.commodities) {
      setCommodities(preset.scheme.commodities);
    }

    if (preset.scheme.palette) {
      setPalette((prev) => ({ ...prev, ...preset.scheme.palette }));
    }

    if (preset.scheme.features) {
      setFeatures(preset.scheme.features);
    }
  };

  const handleSave = () => {
    const updated: DesignScheme = {
      palette,
      features,
      font,
      framework,
      uiLibrary,
      animationLibrary,
      commodities,
      typographyPairing,
    };

    try {
      localStorage.setItem('zoth_design_scheme', JSON.stringify(updated));
    } catch {
      // Local storage may be restricted in some browser settings
    }

    setDesignScheme?.(updated);
    setIsDialogOpen(false);
  };

  const handleReset = () => {
    setPalette(defaultDesignScheme.palette);
    setFeatures(defaultDesignScheme.features);
    setFont(defaultDesignScheme.font);
    setFramework(defaultDesignScheme.framework || 'vite-react');
    setUiLibrary(defaultDesignScheme.uiLibrary || 'shadcn-ui');
    setAnimationLibrary(defaultDesignScheme.animationLibrary || 'framer-motion');
    setCommodities(defaultDesignScheme.commodities || ['conic-border-beam', 'aurora-mesh-gradient']);
    setTypographyPairing(defaultDesignScheme.typographyPairing || 'syne-space-grotesk');
  };

  const filterItems = (items: CatalogItem[]) => {
    if (!searchQuery.trim()) {
      return items;
    }

    const q = searchQuery.toLowerCase();

    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q)) ||
        (item.badge && item.badge.toLowerCase().includes(q)) ||
        (item.npmPackage && item.npmPackage.toLowerCase().includes(q)),
    );
  };

  const filteredFrameworks = useMemo(() => filterItems(FRAMEWORK_OPTIONS), [searchQuery]);
  const filteredUI = useMemo(() => filterItems(UI_LIBRARIES), [searchQuery]);
  const filteredAnimation = useMemo(() => filterItems(ANIMATION_LIBRARIES), [searchQuery]);
  const filteredCommodities = useMemo(() => filterItems(COMMODITIES_AND_EFFECTS), [searchQuery]);
  const filteredTypography = useMemo(() => filterItems(TYPOGRAPHY_PAIRINGS), [searchQuery]);
  const filteredPalettes = useMemo(() => filterItems(COLOR_PALETTES), [searchQuery]);

  const activeFrameworkObj = FRAMEWORK_OPTIONS.find((f) => f.id === framework) || FRAMEWORK_OPTIONS[1];
  const activeUIObj = UI_LIBRARIES.find((u) => u.id === uiLibrary) || UI_LIBRARIES[0];
  const activeMotionObj = ANIMATION_LIBRARIES.find((a) => a.id === animationLibrary) || ANIMATION_LIBRARIES[0];
  const activeTypoObj = TYPOGRAPHY_PAIRINGS.find((t) => t.id === typographyPairing) || TYPOGRAPHY_PAIRINGS[0];

  const tabs: { key: StudioTab; label: string; icon: string; count: number }[] = [
    { key: 'frameworks', label: 'Frameworks', icon: 'i-ph:cube', count: FRAMEWORK_OPTIONS.length },
    { key: 'ui', label: 'UI Systems', icon: 'i-ph:layout', count: UI_LIBRARIES.length },
    { key: 'animation', label: 'Motion & Physics', icon: 'i-ph:play-circle', count: ANIMATION_LIBRARIES.length },
    { key: 'commodities', label: '2026 FX', icon: 'i-ph:sparkle', count: COMMODITIES_AND_EFFECTS.length },
    { key: 'typography', label: 'Typography', icon: 'i-ph:text-aa', count: TYPOGRAPHY_PAIRINGS.length },
    { key: 'colors', label: 'Palettes', icon: 'i-ph:palette', count: COLOR_PALETTES.length },
    { key: 'features', label: 'Surface FX', icon: 'i-ph:magic-wand', count: designFeatures.length },
  ];

  return (
    <div>
      <IconButton
        title="Zoth Design & Framework Studio (280+ Options)"
        className="transition-all relative hover:scale-105"
        onClick={() => setIsDialogOpen(!isDialogOpen)}
      >
        <div className="i-ph:palette text-xl text-amber-400"></div>
        <span className="absolute -top-1 -right-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
      </IconButton>

      <DialogRoot open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog className="!w-[95vw] !max-w-5xl !rounded-2xl border-amber-500/20 bg-bolt-elements-bg-depth-1">
          <div className="py-4 px-4 sm:px-6 w-full max-h-[90vh] flex flex-col gap-4 overflow-hidden text-bolt-elements-textPrimary">
            {/* Studio Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-bolt-elements-borderColor pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-xl sm:text-2xl font-bold text-bolt-elements-textPrimary flex items-center gap-2">
                    <span className="i-ph:sparkle text-amber-400 text-xl" />
                    Zoth Design & Framework Studio
                  </DialogTitle>
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    280+ Libraries & FX
                  </span>
                </div>
                <DialogDescription className="text-xs sm:text-sm text-bolt-elements-textSecondary mt-1">
                  Synthesize your web application stack with Astro 5+, Vite React 19, Vanilla JS, motion physics, and
                  2026 commodities.
                </DialogDescription>
              </div>

              {/* Active Stack Summary Pill */}
              <div className="hidden lg:flex items-center gap-2 p-2 rounded-xl bg-bolt-elements-bg-depth-3 border border-bolt-elements-borderColor text-xs">
                <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-400 font-mono font-medium border border-amber-500/20">
                  {activeFrameworkObj?.name.split(' ')[0]}
                </span>
                <span className="text-bolt-elements-textTertiary">+</span>
                <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 font-mono font-medium border border-blue-500/20">
                  {activeUIObj?.name.split(' ')[0]}
                </span>
                <span className="text-bolt-elements-textTertiary">+</span>
                <span className="px-2 py-1 rounded bg-purple-500/10 text-purple-400 font-mono font-medium border border-purple-500/20">
                  {activeMotionObj?.name.split(' ')[0]}
                </span>
              </div>
            </div>

            {/* 1-Click Studio Presets Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar text-xs">
              <span className="text-bolt-elements-textTertiary whitespace-nowrap font-medium flex items-center gap-1">
                <span className="i-ph:lightning text-amber-400" /> Presets:
              </span>
              {STUDIO_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset)}
                  title={preset.description}
                  className="whitespace-nowrap px-3 py-1.5 rounded-lg bg-bolt-elements-bg-depth-3 hover:bg-bolt-elements-bg-depth-2 border border-bolt-elements-borderColor hover:border-amber-400/50 text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary transition-all duration-150 flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>

            {/* Search Input & Navigation Tabs */}
            <div className="flex flex-col gap-2">
              <div className="relative">
                <span className="i-ph:magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-bolt-elements-textTertiary text-base" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter across 280+ frameworks, UI libraries, animation engines, effects, typography..."
                  className="w-full pl-9 pr-8 py-2 rounded-xl bg-bolt-elements-bg-depth-3 border border-bolt-elements-borderColor text-xs sm:text-sm text-bolt-elements-textPrimary placeholder:text-bolt-elements-textTertiary focus:outline-none focus:border-amber-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-bolt-elements-textTertiary hover:text-bolt-elements-textPrimary text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Tabs */}
              <div className="flex gap-1 overflow-x-auto p-1 bg-bolt-elements-bg-depth-3 rounded-xl custom-scrollbar">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                      activeTab === tab.key
                        ? 'bg-bolt-elements-bg-depth-1 text-bolt-elements-textPrimary shadow-sm border border-bolt-elements-borderColorActive'
                        : 'text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary hover:bg-bolt-elements-bg-depth-2'
                    }`}
                  >
                    <span className={`${tab.icon} text-base ${activeTab === tab.key ? 'text-amber-400' : ''}`} />
                    <span>{tab.label}</span>
                    <span className="px-1.5 py-0.2 rounded-md bg-bolt-elements-bg-depth-2 text-[10px] text-bolt-elements-textTertiary font-mono">
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Interactive Studio Content Pane */}
            <div className="min-h-72 max-h-[48vh] overflow-y-auto pr-1 custom-scrollbar">
              {/* TAB 1: FRAMEWORKS */}
              {activeTab === 'frameworks' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredFrameworks.map((item) => {
                    const isSelected = framework === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setFramework(item.id)}
                        className={`text-left p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-400/80 shadow-md ring-1 ring-amber-500/40'
                            : 'bg-bolt-elements-bg-depth-3 border-bolt-elements-borderColor hover:border-bolt-elements-borderColorActive hover:bg-bolt-elements-bg-depth-2'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <span className="font-semibold text-sm text-bolt-elements-textPrimary">{item.name}</span>
                            {item.badge && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-400/20 text-amber-300 border border-amber-400/30 whitespace-nowrap">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-bolt-elements-textSecondary line-clamp-2 leading-relaxed mb-2">
                            {item.description}
                          </p>
                        </div>

                        <div>
                          {item.bestFor && (
                            <div className="text-[11px] text-bolt-elements-textTertiary mb-2 italic line-clamp-1">
                              Best for: {item.bestFor}
                            </div>
                          )}
                          <div className="flex items-center justify-between text-xs pt-2 border-t border-bolt-elements-borderColor/50">
                            <span className="font-mono text-[10px] text-bolt-elements-textTertiary">
                              {item.npmPackage ? `pkg: ${item.npmPackage}` : 'Zero build'}
                            </span>
                            {isSelected && (
                              <span className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
                                <span className="i-ph:check-bold text-xs" /> Active
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* TAB 2: UI LIBRARIES */}
              {activeTab === 'ui' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredUI.map((item) => {
                    const isSelected = uiLibrary === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setUiLibrary(item.id)}
                        className={`text-left p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                          isSelected
                            ? 'bg-blue-500/10 border-blue-400/80 shadow-md ring-1 ring-blue-500/40'
                            : 'bg-bolt-elements-bg-depth-3 border-bolt-elements-borderColor hover:border-bolt-elements-borderColorActive hover:bg-bolt-elements-bg-depth-2'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <span className="font-semibold text-sm text-bolt-elements-textPrimary">{item.name}</span>
                            {item.badge && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-blue-400/20 text-blue-300 border border-blue-400/30 whitespace-nowrap">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-bolt-elements-textSecondary line-clamp-2 leading-relaxed mb-2">
                            {item.description}
                          </p>
                        </div>

                        <div>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {item.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-1.5 py-0.5 rounded bg-bolt-elements-bg-depth-1 text-[10px] text-bolt-elements-textTertiary"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center justify-between text-xs pt-2 border-t border-bolt-elements-borderColor/50">
                            <span className="font-mono text-[10px] text-bolt-elements-textTertiary line-clamp-1">
                              {item.npmPackage || 'CSS'}
                            </span>
                            {isSelected && (
                              <span className="flex items-center gap-1 text-blue-400 text-xs font-semibold">
                                <span className="i-ph:check-bold text-xs" /> Active
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* TAB 3: ANIMATION & MOTION */}
              {activeTab === 'animation' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredAnimation.map((item) => {
                    const isSelected = animationLibrary === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setAnimationLibrary(item.id)}
                        className={`text-left p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                          isSelected
                            ? 'bg-purple-500/10 border-purple-400/80 shadow-md ring-1 ring-purple-500/40'
                            : 'bg-bolt-elements-bg-depth-3 border-bolt-elements-borderColor hover:border-bolt-elements-borderColorActive hover:bg-bolt-elements-bg-depth-2'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <span className="font-semibold text-sm text-bolt-elements-textPrimary">{item.name}</span>
                            {item.badge && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-purple-400/20 text-purple-300 border border-purple-400/30 whitespace-nowrap">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-bolt-elements-textSecondary line-clamp-2 leading-relaxed mb-2">
                            {item.description}
                          </p>
                        </div>

                        <div>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {item.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-1.5 py-0.5 rounded bg-bolt-elements-bg-depth-1 text-[10px] text-bolt-elements-textTertiary"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center justify-between text-xs pt-2 border-t border-bolt-elements-borderColor/50">
                            <span className="font-mono text-[10px] text-bolt-elements-textTertiary line-clamp-1">
                              {item.npmPackage || 'Engine'}
                            </span>
                            {isSelected && (
                              <span className="flex items-center gap-1 text-purple-400 text-xs font-semibold">
                                <span className="i-ph:check-bold text-xs" /> Active
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* TAB 4: 2026 COMMODITIES & EFFECTS */}
              {activeTab === 'commodities' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-bolt-elements-textSecondary">
                    <span>Select active visual commodities ({commodities.length} active):</span>
                    <button
                      onClick={() => setCommodities([])}
                      className="text-bolt-elements-textTertiary hover:text-bolt-elements-textPrimary"
                    >
                      Deselect all
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredCommodities.map((item) => {
                      const isSelected = commodities.includes(item.id);

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleCommodityToggle(item.id)}
                          className={`text-left p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                            isSelected
                              ? 'bg-amber-500/10 border-amber-400/80 shadow-md ring-1 ring-amber-500/40'
                              : 'bg-bolt-elements-bg-depth-3 border-bolt-elements-borderColor hover:border-bolt-elements-borderColorActive hover:bg-bolt-elements-bg-depth-2'
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <span className="font-semibold text-sm text-bolt-elements-textPrimary">{item.name}</span>
                              {item.badge && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-400/20 text-amber-300 border border-amber-400/30 whitespace-nowrap">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-bolt-elements-textSecondary line-clamp-2 leading-relaxed mb-2">
                              {item.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between text-xs pt-2 border-t border-bolt-elements-borderColor/50">
                            <span className="text-[11px] text-bolt-elements-textTertiary">
                              {isSelected ? 'Enabled' : 'Click to enable'}
                            </span>
                            <div
                              className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                                isSelected
                                  ? 'bg-amber-500 border-amber-500 text-black'
                                  : 'border-bolt-elements-borderColor'
                              }`}
                            >
                              {isSelected && <span className="i-ph:check-bold text-xs" />}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 5: TYPOGRAPHY PAIRINGS */}
              {activeTab === 'typography' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredTypography.map((item) => {
                    const isSelected = typographyPairing === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setTypographyPairing(item.id)}
                        className={`text-left p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-400/80 shadow-md ring-1 ring-amber-500/40'
                            : 'bg-bolt-elements-bg-depth-3 border-bolt-elements-borderColor hover:border-bolt-elements-borderColorActive hover:bg-bolt-elements-bg-depth-2'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <span className="font-bold text-base text-bolt-elements-textPrimary">{item.name}</span>
                            {item.badge && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-400/20 text-amber-300 border border-amber-400/30 whitespace-nowrap">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-bolt-elements-textSecondary leading-relaxed mb-3">
                            {item.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-2 border-t border-bolt-elements-borderColor/50">
                          <span className="font-mono text-xs text-bolt-elements-textTertiary">
                            Heading: {item.name.split('+')[0]?.trim()} / Body: {item.name.split('+')[1]?.trim()}
                          </span>
                          {isSelected && (
                            <span className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
                              <span className="i-ph:check-bold text-xs" /> Active
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* TAB 6: PALETTES & HEX COLOR ROLES */}
              {activeTab === 'colors' && (
                <div className="space-y-6">
                  {/* Curated Luxury Harmonies */}
                  <div>
                    <h4 className="text-sm font-semibold text-bolt-elements-textPrimary mb-2 flex items-center gap-2">
                      <span className="i-ph:swatches text-amber-400" />
                      Curated Signature Themes (Click to apply)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                      {filteredPalettes.map((item) => {
                        const preset = curatedPaletteMaps[item.id];

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleApplyPalette(item.id)}
                            className="text-left p-3 rounded-xl bg-bolt-elements-bg-depth-3 hover:bg-bolt-elements-bg-depth-2 border border-bolt-elements-borderColor hover:border-amber-400/60 transition-all group"
                          >
                            <div className="font-medium text-xs text-bolt-elements-textPrimary group-hover:text-amber-300 mb-1.5 line-clamp-1">
                              {item.name}
                            </div>
                            {preset && (
                              <div className="flex h-4 rounded-md overflow-hidden border border-bolt-elements-borderColor">
                                <div className="flex-1" style={{ backgroundColor: preset.primary }} />
                                <div className="flex-1" style={{ backgroundColor: preset.secondary }} />
                                <div className="flex-1" style={{ backgroundColor: preset.accent }} />
                                <div className="flex-1" style={{ backgroundColor: preset.surface }} />
                                <div className="flex-1" style={{ backgroundColor: preset.background }} />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Individual Role Hex Pickers */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-semibold text-bolt-elements-textPrimary flex items-center gap-2">
                        <span className="i-ph:sliders text-amber-400" />
                        Fine-Tune Individual Color Roles
                      </h4>
                      <button
                        onClick={handleReset}
                        className="text-xs text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary flex items-center gap-1"
                      >
                        <span className="i-ph:arrow-clockwise text-xs" /> Reset
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {paletteRoles.map((role) => (
                        <div
                          key={role.key}
                          className="flex items-center gap-3 p-3 rounded-xl bg-bolt-elements-bg-depth-3 border border-bolt-elements-borderColor"
                        >
                          <div className="relative flex-shrink-0">
                            <div
                              className="w-10 h-10 rounded-lg shadow cursor-pointer transition-all hover:scale-105 border border-white/10"
                              style={{ backgroundColor: palette[role.key] || '#111111' }}
                              onClick={() => document.getElementById(`color-input-${role.key}`)?.click()}
                              role="button"
                              tabIndex={0}
                              aria-label={`Change ${role.label} color`}
                            />
                            <input
                              id={`color-input-${role.key}`}
                              type="color"
                              value={palette[role.key] || '#111111'}
                              onChange={(e) => handleColorChange(role.key, e.target.value)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              tabIndex={-1}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-xs text-bolt-elements-textPrimary">{role.label}</div>
                            <div className="text-[10px] text-bolt-elements-textTertiary font-mono">
                              {palette[role.key]}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: SURFACE FX */}
              {activeTab === 'features' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {designFeatures.map((f) => {
                    const isSelected = features.includes(f.key);

                    return (
                      <button
                        key={f.key}
                        type="button"
                        onClick={() => handleFeatureToggle(f.key)}
                        className={`p-4 rounded-xl border text-left transition-all duration-200 flex items-center justify-between ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-400/80 shadow-md ring-1 ring-amber-500/40 text-amber-300'
                            : 'bg-bolt-elements-bg-depth-3 border-bolt-elements-borderColor hover:border-bolt-elements-borderColorActive hover:bg-bolt-elements-bg-depth-2 text-bolt-elements-textPrimary'
                        }`}
                      >
                        <span className="font-semibold text-sm">{f.label}</span>
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                            isSelected ? 'bg-amber-500 border-amber-500 text-black' : 'border-bolt-elements-borderColor'
                          }`}
                        >
                          {isSelected && <span className="i-ph:check-bold text-xs" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Studio Footer Summary & Action Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-bolt-elements-borderColor text-xs">
              <div className="text-bolt-elements-textSecondary flex items-center gap-1.5 flex-wrap">
                <span className="text-amber-400 font-semibold">{activeFrameworkObj?.name}</span>
                <span>•</span>
                <span>{activeUIObj?.name}</span>
                <span>•</span>
                <span>{activeMotionObj?.name}</span>
                <span>•</span>
                <span>{commodities.length} FX</span>
                <span>•</span>
                <span>{activeTypoObj?.name}</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <Button variant="secondary" onClick={() => setIsDialogOpen(false)} className="text-xs px-3 py-1.5">
                  Cancel
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleSave}
                  className="bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs px-4 py-1.5 rounded-lg shadow transition-all duration-150 flex items-center gap-1"
                >
                  <span className="i-ph:check-bold text-xs" />
                  Save & Apply Stack
                </Button>
              </div>
            </div>
          </div>
        </Dialog>
      </DialogRoot>

      <style>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: var(--bolt-elements-textTertiary) transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: var(--bolt-elements-textTertiary);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: var(--bolt-elements-textSecondary);
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};
