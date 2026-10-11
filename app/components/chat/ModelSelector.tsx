import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import type { KeyboardEvent } from 'react';
import type { ModelInfo } from '~/lib/modules/llm/types';
import { LOCAL_PROVIDERS, updateProviderSettings } from '~/lib/stores/settings';
import type { ProviderInfo } from '~/types/model';
import { classNames } from '~/utils/classNames';
import { PROVIDER_LIST } from '~/utils/constants';

export interface CloudModelPreset {
  id: string;
  name: string;
  providerName: string;
  modelName: string;
  badge: string;
  badgeType: 'reasoning' | 'frontier' | 'fast' | 'flagship';
  icon: string;
  description: string;
}

export const CLOUD_MODEL_PRESETS: CloudModelPreset[] = [
  {
    id: 'gemini-2-5-flash',
    name: 'Gemini 2.5 Flash',
    providerName: 'Google',
    modelName: 'gemini-2.5-flash',
    badge: '1M CONTEXT',
    badgeType: 'fast',
    icon: '🌟',
    description: 'Google next-gen 1M token workhorse for rapid web development',
  },
  {
    id: 'claude-3-7-sonnet',
    name: 'Claude 3.7 Sonnet',
    providerName: 'Anthropic',
    modelName: 'claude-3-7-sonnet-20250219',
    badge: 'HYBRID',
    badgeType: 'frontier',
    icon: '💎',
    description: 'Anthropic frontier hybrid reasoning & coding model',
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    providerName: 'Anthropic',
    modelName: 'claude-3-5-sonnet-20241022',
    badge: 'CODING',
    badgeType: 'frontier',
    icon: '🧠',
    description: 'Anthropic industry-standard code architecture model',
  },
  {
    id: 'o3-mini',
    name: 'OpenAI o3-mini',
    providerName: 'OpenAI',
    modelName: 'o3-mini',
    badge: 'REASONING',
    badgeType: 'reasoning',
    icon: '⚡',
    description: 'OpenAI high-speed reasoning model for coding & math',
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1',
    providerName: 'Deepseek',
    modelName: 'deepseek-reasoner',
    badge: 'REASONING',
    badgeType: 'reasoning',
    icon: '🚀',
    description: 'DeepSeek frontier open-weights reasoning model',
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek V3',
    providerName: 'Deepseek',
    modelName: 'deepseek-chat',
    badge: '671B MOE',
    badgeType: 'frontier',
    icon: '🌌',
    description: 'DeepSeek 671B parameter Mixture-of-Experts architecture',
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    providerName: 'OpenAI',
    modelName: 'gpt-4o',
    badge: 'FLAGSHIP',
    badgeType: 'flagship',
    icon: '⚡',
    description: 'OpenAI flagship multimodal intelligence',
  },
  {
    id: 'groq-llama',
    name: 'Groq Llama 3.3',
    providerName: 'Groq',
    modelName: 'llama-3.3-70b-versatile',
    badge: 'ULTRA-FAST LPU',
    badgeType: 'fast',
    icon: '⚡',
    description: 'Ultra-low latency LPU cloud inference via Groq',
  },
];

export const LOCAL_HARNESS_PRESETS: CloudModelPreset[] = [
  {
    id: 'grok-cli',
    name: 'Grok CLI',
    providerName: 'ZothLocal',
    modelName: 'grok-cli',
    badge: 'ZOTH OS',
    badgeType: 'flagship',
    icon: '✦',
    description: 'Grok Build on this machine. Answers in the chat. Does not take over your open Grok session.',
  },
  {
    id: 'hermes-agent',
    name: 'Hermes',
    providerName: 'ZothLocal',
    modelName: 'hermes-agent',
    badge: 'ZOTH OS',
    badgeType: 'frontier',
    icon: '♛',
    description: 'Nous Hermes Agent, using the model already configured in Hermes.',
  },
  {
    id: 'opencode',
    name: 'OpenCode',
    providerName: 'ZothLocal',
    modelName: 'opencode',
    badge: 'ZOTH OS',
    badgeType: 'frontier',
    icon: '⌘',
    description: 'OpenCode CLI. The Zoth OS menu is here. The CLI itself still needs to be installed.',
  },
  {
    id: 'cline',
    name: 'Cline',
    providerName: 'ZothLocal',
    modelName: 'cline',
    badge: 'ZOTH OS',
    badgeType: 'fast',
    icon: '▸',
    description: 'Cline CLI on this machine, same binary Zoth OS launches.',
  },
  {
    id: 'aider',
    name: 'Aider',
    providerName: 'ZothLocal',
    modelName: 'aider',
    badge: 'ZOTH OS',
    badgeType: 'fast',
    icon: '✎',
    description: 'Aider pair programmer. Uses your Aider config and does not commit.',
  },
  {
    id: 'agy-engine',
    name: 'AGY',
    providerName: 'ZothLocal',
    modelName: 'agy-engine',
    badge: 'ZOTH OS',
    badgeType: 'frontier',
    icon: '⚡',
    description: 'Antigravity CLI already wired on this host.',
  },
  {
    id: 'claude-cli',
    name: 'Claude Code',
    providerName: 'ZothLocal',
    modelName: 'claude-cli',
    badge: 'ZOTH OS',
    badgeType: 'frontier',
    icon: '◈',
    description: 'Claude Code CLI on this host.',
  },
];

// Fuzzy search utilities
const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
      }
    }
  }

  return matrix[str2.length][str1.length];
};

const fuzzyMatch = (query: string, text: string): { score: number; matches: boolean } => {
  if (!query) {
    return { score: 0, matches: true };
  }

  if (!text) {
    return { score: 0, matches: false };
  }

  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();

  // Exact substring match gets highest score
  if (textLower.includes(queryLower)) {
    return { score: 100 - (textLower.indexOf(queryLower) / textLower.length) * 20, matches: true };
  }

  // Fuzzy match with reasonable threshold
  const distance = levenshteinDistance(queryLower, textLower);
  const maxLen = Math.max(queryLower.length, textLower.length);
  const similarity = 1 - distance / maxLen;

  return {
    score: similarity > 0.6 ? similarity * 80 : 0,
    matches: similarity > 0.6,
  };
};

const highlightText = (text: string, query: string): string => {
  if (!query) {
    return text;
  }

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');

  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 text-current">$1</mark>');
};

const formatContextSize = (tokens: number): string => {
  if (tokens >= 1000000) {
    return `${(tokens / 1000000).toFixed(1)}M`;
  }

  if (tokens >= 1000) {
    return `${(tokens / 1000).toFixed(0)}K`;
  }

  return tokens.toString();
};

interface ModelSelectorProps {
  model?: string;
  setModel?: (model: string) => void;
  provider?: ProviderInfo;
  setProvider?: (provider: ProviderInfo) => void;
  modelList: ModelInfo[];
  providerList: ProviderInfo[];
  apiKeys: Record<string, string>;
  modelLoading?: string;
}

// Helper function to determine if a model is likely free
const isModelLikelyFree = (model: ModelInfo, providerName?: string): boolean => {
  // OpenRouter models with zero pricing in the label
  if (providerName === 'OpenRouter' && model.label.includes('in:$0.00') && model.label.includes('out:$0.00')) {
    return true;
  }

  // Models with "free" in the name or label
  if (model.name.toLowerCase().includes('free') || model.label.toLowerCase().includes('free')) {
    return true;
  }

  return false;
};

export const ModelSelector = ({
  model,
  setModel,
  provider,
  setProvider,
  modelList,
  providerList,
  apiKeys = {},
  modelLoading,
}: ModelSelectorProps) => {
  const [modelSearchQuery, setModelSearchQuery] = useState('');
  const [debouncedModelSearchQuery, setDebouncedModelSearchQuery] = useState('');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [focusedModelIndex, setFocusedModelIndex] = useState(-1);
  const modelSearchInputRef = useRef<HTMLInputElement>(null);
  const modelOptionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const [providerSearchQuery, setProviderSearchQuery] = useState('');
  const [debouncedProviderSearchQuery, setDebouncedProviderSearchQuery] = useState('');
  const [isProviderDropdownOpen, setIsProviderDropdownOpen] = useState(false);
  const [focusedProviderIndex, setFocusedProviderIndex] = useState(-1);
  const providerSearchInputRef = useRef<HTMLInputElement>(null);
  const providerOptionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const providerDropdownRef = useRef<HTMLDivElement>(null);
  const [showFreeModelsOnly, setShowFreeModelsOnly] = useState(false);

  type ConnectionStatus = 'unknown' | 'connected' | 'disconnected';

  const [localProviderStatus, setLocalProviderStatus] = useState<Record<string, ConnectionStatus>>({});

  // Check connectivity of local providers when provider list changes
  useEffect(() => {
    const checkLocalProviders = async () => {
      const statuses: Record<string, 'connected' | 'disconnected'> = {};

      for (const p of providerList) {
        if (!LOCAL_PROVIDERS.includes(p.name)) {
          continue;
        }

        // If the provider has models loaded, it's connected
        const hasModels = modelList.some((m) => m.provider === p.name);

        statuses[p.name] = hasModels ? 'connected' : 'disconnected';
      }

      setLocalProviderStatus(statuses);
    };

    checkLocalProviders();
  }, [providerList, modelList]);

  // Debounce search queries
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedModelSearchQuery(modelSearchQuery);
    }, 150);

    return () => clearTimeout(timer);
  }, [modelSearchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedProviderSearchQuery(providerSearchQuery);
    }, 150);

    return () => clearTimeout(timer);
  }, [providerSearchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
        setIsModelDropdownOpen(false);
        setModelSearchQuery('');
      }

      if (providerDropdownRef.current && !providerDropdownRef.current.contains(event.target as Node)) {
        setIsProviderDropdownOpen(false);
        setProviderSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredModels = useMemo(() => {
    const baseModels = [...modelList].filter((e) => e.provider === provider?.name && e.name);

    return baseModels
      .filter((model) => {
        // Apply free models filter
        if (showFreeModelsOnly && !isModelLikelyFree(model, provider?.name)) {
          return false;
        }

        return true;
      })
      .map((model) => {
        // Calculate search scores for fuzzy matching
        const labelMatch = fuzzyMatch(debouncedModelSearchQuery, model.label);
        const nameMatch = fuzzyMatch(debouncedModelSearchQuery, model.name);
        const contextMatch = fuzzyMatch(debouncedModelSearchQuery, formatContextSize(model.maxTokenAllowed));

        const bestScore = Math.max(labelMatch.score, nameMatch.score, contextMatch.score);
        const matches = labelMatch.matches || nameMatch.matches || contextMatch.matches || !debouncedModelSearchQuery; // Show all if no query

        return {
          ...model,
          searchScore: bestScore,
          searchMatches: matches,
          highlightedLabel: highlightText(model.label, debouncedModelSearchQuery),
          highlightedName: highlightText(model.name, debouncedModelSearchQuery),
        };
      })
      .filter((model) => model.searchMatches)
      .sort((a, b) => {
        // Sort by search score (highest first), then by label
        if (debouncedModelSearchQuery) {
          return b.searchScore - a.searchScore;
        }

        return a.label.localeCompare(b.label);
      });
  }, [modelList, provider?.name, showFreeModelsOnly, debouncedModelSearchQuery]);

  const [envKeyStatus, setEnvKeyStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let isMounted = true;

    const cloudProviders = Array.from(new Set(CLOUD_MODEL_PRESETS.map((p) => p.providerName)));

    Promise.all(
      cloudProviders.map(async (pName) => {
        if (apiKeys?.[pName]?.trim()) {
          return [pName, true] as const;
        }

        try {
          const res = await fetch(`/api/check-env-key?provider=${encodeURIComponent(pName)}`);

          if (!res.ok) {
            return [pName, false] as const;
          }

          const data = (await res.json()) as { isSet?: boolean };

          return [pName, Boolean(data?.isSet)] as const;
        } catch {
          return [pName, false] as const;
        }
      }),
    ).then((results) => {
      if (isMounted) {
        setEnvKeyStatus(Object.fromEntries(results));
      }
    });

    return () => {
      isMounted = false;
    };
  }, [apiKeys]);

  const filteredProviders = useMemo(() => {
    const callableProviders = providerList.filter((p) => {
      if (p.name === 'ZothLocal') {
        return true;
      }

      return Boolean(apiKeys?.[p.name]?.trim()) || Boolean(envKeyStatus[p.name]);
    });

    if (!debouncedProviderSearchQuery) {
      return callableProviders;
    }

    return callableProviders
      .map((provider) => {
        const match = fuzzyMatch(debouncedProviderSearchQuery, provider.name);
        return {
          ...provider,
          searchScore: match.score,
          searchMatches: match.matches,
          highlightedName: highlightText(provider.name, debouncedProviderSearchQuery),
        };
      })
      .filter((provider) => provider.searchMatches)
      .sort((a, b) => b.searchScore - a.searchScore);
  }, [providerList, apiKeys, envKeyStatus, debouncedProviderSearchQuery]);

  // Reset free models filter when provider changes
  useEffect(() => {
    setShowFreeModelsOnly(false);
  }, [provider?.name]);

  useEffect(() => {
    setFocusedModelIndex(-1);
  }, [debouncedModelSearchQuery, isModelDropdownOpen, showFreeModelsOnly]);

  useEffect(() => {
    setFocusedProviderIndex(-1);
  }, [debouncedProviderSearchQuery, isProviderDropdownOpen]);

  // Clear search functions
  const clearModelSearch = useCallback(() => {
    setModelSearchQuery('');
    setDebouncedModelSearchQuery('');

    if (modelSearchInputRef.current) {
      modelSearchInputRef.current.focus();
    }
  }, []);

  const clearProviderSearch = useCallback(() => {
    setProviderSearchQuery('');
    setDebouncedProviderSearchQuery('');

    if (providerSearchInputRef.current) {
      providerSearchInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (isModelDropdownOpen && modelSearchInputRef.current) {
      modelSearchInputRef.current.focus();
    }
  }, [isModelDropdownOpen]);

  useEffect(() => {
    if (isProviderDropdownOpen && providerSearchInputRef.current) {
      providerSearchInputRef.current.focus();
    }
  }, [isProviderDropdownOpen]);

  const handleModelKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!isModelDropdownOpen) {
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedModelIndex((prev) => (prev + 1 >= filteredModels.length ? 0 : prev + 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedModelIndex((prev) => (prev - 1 < 0 ? filteredModels.length - 1 : prev - 1));
        break;
      case 'Enter':
        e.preventDefault();

        if (focusedModelIndex >= 0 && focusedModelIndex < filteredModels.length) {
          const selectedModel = filteredModels[focusedModelIndex];
          setModel?.(selectedModel.name);
          setIsModelDropdownOpen(false);
          setModelSearchQuery('');
          setDebouncedModelSearchQuery('');
        }

        break;
      case 'Escape':
        e.preventDefault();
        setIsModelDropdownOpen(false);
        setModelSearchQuery('');
        setDebouncedModelSearchQuery('');
        break;
      case 'Tab':
        if (!e.shiftKey && focusedModelIndex === filteredModels.length - 1) {
          setIsModelDropdownOpen(false);
        }

        break;
      case 'k':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          clearModelSearch();
        }

        break;
    }
  };

  const handleProviderKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!isProviderDropdownOpen) {
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedProviderIndex((prev) => (prev + 1 >= filteredProviders.length ? 0 : prev + 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedProviderIndex((prev) => (prev - 1 < 0 ? filteredProviders.length - 1 : prev - 1));
        break;
      case 'Enter':
        e.preventDefault();

        if (focusedProviderIndex >= 0 && focusedProviderIndex < filteredProviders.length) {
          const selectedProvider = filteredProviders[focusedProviderIndex];

          if (setProvider) {
            setProvider(selectedProvider);

            const firstModel = modelList.find((m) => m.provider === selectedProvider.name);

            if (firstModel && setModel) {
              setModel(firstModel.name);
            }
          }

          setIsProviderDropdownOpen(false);
          setProviderSearchQuery('');
          setDebouncedProviderSearchQuery('');
        }

        break;
      case 'Escape':
        e.preventDefault();
        setIsProviderDropdownOpen(false);
        setProviderSearchQuery('');
        setDebouncedProviderSearchQuery('');
        break;
      case 'Tab':
        if (!e.shiftKey && focusedProviderIndex === filteredProviders.length - 1) {
          setIsProviderDropdownOpen(false);
        }

        break;
      case 'k':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          clearProviderSearch();
        }

        break;
    }
  };

  useEffect(() => {
    if (focusedModelIndex >= 0 && modelOptionsRef.current[focusedModelIndex]) {
      modelOptionsRef.current[focusedModelIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [focusedModelIndex]);

  useEffect(() => {
    if (focusedProviderIndex >= 0 && providerOptionsRef.current[focusedProviderIndex]) {
      providerOptionsRef.current[focusedProviderIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [focusedProviderIndex]);

  useEffect(() => {
    if (providerList.length === 0) {
      return;
    }

    if (provider && !providerList.some((p) => p.name === provider.name)) {
      if (provider.name === 'ZothLocal') {
        return;
      }

      const firstEnabledProvider = providerList[0];
      setProvider?.(firstEnabledProvider);

      const firstModel = modelList.find((m) => m.provider === firstEnabledProvider.name);

      if (firstModel) {
        setModel?.(firstModel.name);
      }
    }
  }, [providerList, provider, setProvider, modelList, setModel]);

  const visibleCloudPresets = useMemo(() => {
    return CLOUD_MODEL_PRESETS.filter((preset) => {
      const hasKey = Boolean(apiKeys?.[preset.providerName]?.trim()) || Boolean(envKeyStatus[preset.providerName]);

      if (!hasKey) {
        return false;
      }

      const prov = providerList.find((p) => p.name === preset.providerName);

      if (!prov) {
        return false;
      }

      const hasModel =
        prov.staticModels?.some((m) => m.name === preset.modelName) ||
        modelList.some((m) => m.provider === preset.providerName && m.name === preset.modelName);

      return Boolean(hasModel);
    });
  }, [apiKeys, envKeyStatus, providerList, modelList]);

  const isCurrentPreset = useMemo(() => {
    return [...visibleCloudPresets, ...LOCAL_HARNESS_PRESETS].some(
      (p) => p.providerName === provider?.name && p.modelName === model,
    );
  }, [provider?.name, model, visibleCloudPresets]);

  const activePreset = useMemo(() => {
    return [...visibleCloudPresets, ...LOCAL_HARNESS_PRESETS].find(
      (p) => p.providerName === provider?.name && p.modelName === model,
    );
  }, [provider?.name, model, visibleCloudPresets]);

  const [showDetailedSelector, setShowDetailedSelector] = useState(false);

  const onlyZothAndGemini = useMemo(() => {
    const cloudOnly = visibleCloudPresets.filter((p) => p.providerName !== 'ZothLocal');
    return cloudOnly.length <= 1 && cloudOnly.every((p) => p.providerName === 'Google');
  }, [visibleCloudPresets]);

  const effectiveShowDetailed = (showDetailedSelector && !onlyZothAndGemini) || !isCurrentPreset;

  const handleSelectPreset = useCallback(
    (preset: CloudModelPreset) => {
      let targetProvider = providerList.find((p) => p.name === preset.providerName);

      if (!targetProvider) {
        targetProvider = (PROVIDER_LIST as ProviderInfo[]).find((p) => p.name === preset.providerName);
      }

      if (preset.providerName === 'ZothLocal') {
        updateProviderSettings('ZothLocal', { enabled: true });
      }

      if (targetProvider && setProvider) {
        setProvider(targetProvider);
      }

      if (setModel) {
        setModel(preset.modelName);
      }
    },
    [providerList, setProvider, setModel],
  );

  if (providerList.length === 0) {
    return (
      <div className="mb-2 p-4 rounded-lg border border-bolt-elements-borderColor bg-bolt-elements-prompt-background text-bolt-elements-textPrimary">
        <p className="text-center">
          No providers are currently enabled. Please enable at least one provider in the settings to start using the
          chat.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 mb-2">
      {/* Frontier Cloud Models Strip */}
      <div className="flex flex-col gap-2 p-2.5 rounded-xl bg-bolt-elements-background-depth-2/90 border border-bolt-elements-borderColor shadow-sm backdrop-blur">
        {/* Header & Controls */}
        <div className="flex items-center justify-between text-xs px-0.5">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            <span className="font-semibold text-bolt-elements-textPrimary tracking-wide uppercase text-[10px]">
              AI Engines & Agent Harnesses
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-bolt-elements-textSecondary hidden sm:inline">
              Selected:{' '}
              <strong className="text-[#D4AF37] font-mono">{activePreset?.name || model || 'Custom Model'}</strong>{' '}
              <span className="text-[10px] text-bolt-elements-textTertiary">({provider?.name || 'Local'})</span>
            </span>

            {!onlyZothAndGemini && (
              <button
                type="button"
                onClick={() => setShowDetailedSelector(!showDetailedSelector)}
                className={classNames(
                  'flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium transition-all cursor-pointer',
                  effectiveShowDetailed
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-bolt-elements-background-depth-3 text-bolt-elements-textTertiary hover:text-bolt-elements-textPrimary border border-bolt-elements-borderColor/60',
                )}
                title="Toggle configured provider and model search"
              >
                <span className="i-ph:sliders-horizontal text-xs" />
                <span>{effectiveShowDetailed ? 'Hide Detailed' : 'Configured Providers'}</span>
                <span
                  className={classNames(
                    'i-ph:caret-down text-[10px] transition-transform',
                    effectiveShowDetailed ? 'rotate-180' : '',
                  )}
                />
              </button>
            )}
          </div>
        </div>

        {/* Cloud Model Preset Pills */}
        {visibleCloudPresets.length > 0 && (
          <>
            <div className="flex items-center gap-2 px-0.5 pt-1">
              <span className="font-semibold text-bolt-elements-textPrimary tracking-wide uppercase text-[10px] whitespace-nowrap">
                Cloud models
              </span>
              <span className="text-[10px] text-bolt-elements-textTertiary truncate">
                Frontier cloud APIs. Visible only when configured with callable credentials.
              </span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 sm:scrollbar-none [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-bolt-elements-borderColor">
              {visibleCloudPresets.map((preset) => {
                const isPresetActive = provider?.name === preset.providerName && model === preset.modelName;

                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    title={preset.description}
                    className={classNames(
                      'group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all flex-shrink-0 cursor-pointer',
                      isPresetActive
                        ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/70 shadow-[0_0_12px_rgba(212,175,55,0.25)] font-semibold'
                        : 'bg-bolt-elements-prompt-background hover:bg-bolt-elements-background-depth-3 text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary border border-bolt-elements-borderColor/60',
                    )}
                  >
                    <span className="text-sm">{preset.icon}</span>
                    <span>{preset.name}</span>
                    <span
                      className={classNames(
                        'text-[9px] px-1 py-0.2 rounded font-mono uppercase border',
                        preset.badgeType === 'reasoning'
                          ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                          : preset.badgeType === 'fast'
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            : preset.badgeType === 'flagship'
                              ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                              : 'bg-amber-500/15 text-amber-300 border-amber-500/30',
                      )}
                    >
                      {preset.badge}
                    </span>
                    {isPresetActive && (
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}

        <div className="flex items-center gap-2 px-0.5 pt-1">
          <span className="font-semibold text-bolt-elements-textPrimary tracking-wide uppercase text-[10px] whitespace-nowrap">
            Zoth OS agents
          </span>
          <span className="text-[10px] text-bolt-elements-textTertiary truncate">
            Same CLIs the OS launches. The reply comes back into this chat.
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {LOCAL_HARNESS_PRESETS.map((preset) => {
            const isPresetActive = provider?.name === preset.providerName && model === preset.modelName;

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                title={preset.description}
                className={classNames(
                  'group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all flex-shrink-0 cursor-pointer',
                  isPresetActive
                    ? 'bg-emerald-500/15 text-emerald-200 border border-emerald-400/70 font-semibold'
                    : 'bg-bolt-elements-prompt-background hover:bg-bolt-elements-background-depth-3 text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary border border-bolt-elements-borderColor/60',
                )}
              >
                <span className="text-sm">{preset.icon}</span>
                <span>{preset.name}</span>
                {isPresetActive && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Detailed Comboboxes (When expanded or custom model selected) */}
      {effectiveShowDetailed && (
        <div className="flex gap-2 flex-col sm:flex-row">
          {/* Provider Combobox */}
          <div className="relative flex w-full" onKeyDown={handleProviderKeyDown} ref={providerDropdownRef}>
            <div
              className={classNames(
                'w-full p-2 rounded-lg border border-bolt-elements-borderColor',
                'bg-bolt-elements-prompt-background text-bolt-elements-textPrimary',
                'focus-within:outline-none focus-within:ring-2 focus-within:ring-bolt-elements-focus',
                'transition-all cursor-pointer',
                isProviderDropdownOpen ? 'ring-2 ring-bolt-elements-focus' : undefined,
              )}
              onClick={() => setIsProviderDropdownOpen(!isProviderDropdownOpen)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsProviderDropdownOpen(!isProviderDropdownOpen);
                }
              }}
              role="combobox"
              aria-expanded={isProviderDropdownOpen}
              aria-controls="provider-listbox"
              aria-haspopup="listbox"
              tabIndex={0}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                  {provider?.name && LOCAL_PROVIDERS.includes(provider.name) && (
                    <span
                      className={classNames(
                        'inline-block w-2 h-2 rounded-full flex-shrink-0',
                        localProviderStatus[provider.name] === 'connected'
                          ? 'bg-green-500'
                          : localProviderStatus[provider.name] === 'disconnected'
                            ? 'bg-red-400'
                            : 'bg-bolt-elements-textTertiary',
                      )}
                      title={
                        localProviderStatus[provider.name] === 'connected'
                          ? `${provider.name} is running`
                          : localProviderStatus[provider.name] === 'disconnected'
                            ? `${provider.name} is not reachable`
                            : 'Checking...'
                      }
                    />
                  )}
                  {provider?.name || 'Select provider'}
                </div>
                <div
                  className={classNames(
                    'i-ph:caret-down w-4 h-4 text-bolt-elements-textSecondary opacity-75',
                    isProviderDropdownOpen ? 'rotate-180' : undefined,
                  )}
                />
              </div>
            </div>

            {isProviderDropdownOpen && (
              <div
                className="absolute z-20 w-full mt-1 py-1 rounded-lg border border-bolt-elements-borderColor bg-bolt-elements-background-depth-2 shadow-lg"
                role="listbox"
                id="provider-listbox"
              >
                <div className="px-2 pb-2">
                  <div className="relative">
                    <input
                      ref={providerSearchInputRef}
                      type="text"
                      value={providerSearchQuery}
                      onChange={(e) => setProviderSearchQuery(e.target.value)}
                      placeholder="Search providers... (⌘K to clear)"
                      className={classNames(
                        'w-full pl-8 pr-8 py-1.5 rounded-md text-sm',
                        'bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor',
                        'text-bolt-elements-textPrimary placeholder:text-bolt-elements-textTertiary',
                        'focus:outline-none focus:ring-2 focus:ring-bolt-elements-focus',
                        'transition-all',
                      )}
                      onClick={(e) => e.stopPropagation()}
                      role="searchbox"
                      aria-label="Search providers"
                    />
                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2">
                      <span className="i-ph:magnifying-glass text-bolt-elements-textTertiary" />
                    </div>
                    {providerSearchQuery && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearProviderSearch();
                        }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-bolt-elements-background-depth-3 transition-colors"
                        aria-label="Clear search"
                      >
                        <span className="i-ph:x text-bolt-elements-textTertiary text-xs" />
                      </button>
                    )}
                  </div>
                </div>

                <div
                  className={classNames(
                    'max-h-60 overflow-y-auto',
                    'sm:scrollbar-none',
                    '[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2',
                    '[&::-webkit-scrollbar-thumb]:bg-bolt-elements-borderColor',
                    '[&::-webkit-scrollbar-thumb]:hover:bg-bolt-elements-borderColorHover',
                    '[&::-webkit-scrollbar-thumb]:rounded-full',
                    '[&::-webkit-scrollbar-track]:bg-bolt-elements-background-depth-2',
                    '[&::-webkit-scrollbar-track]:rounded-full',
                    'sm:[&::-webkit-scrollbar]:w-1.5 sm:[&::-webkit-scrollbar]:h-1.5',
                    'sm:hover:[&::-webkit-scrollbar-thumb]:bg-bolt-elements-borderColor/50',
                    'sm:hover:[&::-webkit-scrollbar-thumb:hover]:bg-bolt-elements-borderColor',
                    'sm:[&::-webkit-scrollbar-track]:bg-transparent',
                  )}
                >
                  {filteredProviders.length === 0 ? (
                    <div className="px-3 py-3 text-sm">
                      <div className="text-bolt-elements-textTertiary mb-1">
                        {debouncedProviderSearchQuery
                          ? `No providers match "${debouncedProviderSearchQuery}"`
                          : 'No providers found'}
                      </div>
                      {debouncedProviderSearchQuery && (
                        <div className="text-xs text-bolt-elements-textTertiary">
                          Try searching for provider names like "OpenAI", "Anthropic", or "Google"
                        </div>
                      )}
                    </div>
                  ) : (
                    filteredProviders.map((providerOption, index) => (
                      <div
                        ref={(el) => {
                          providerOptionsRef.current[index] = el;
                        }}
                        key={providerOption.name}
                        role="option"
                        aria-selected={provider?.name === providerOption.name}
                        className={classNames(
                          'px-3 py-2 text-sm cursor-pointer',
                          'hover:bg-bolt-elements-background-depth-3',
                          'text-bolt-elements-textPrimary',
                          'outline-none',
                          provider?.name === providerOption.name || focusedProviderIndex === index
                            ? 'bg-bolt-elements-background-depth-2'
                            : undefined,
                          focusedProviderIndex === index ? 'ring-1 ring-inset ring-bolt-elements-focus' : undefined,
                        )}
                        onClick={(e) => {
                          e.stopPropagation();

                          if (setProvider) {
                            setProvider(providerOption);

                            const firstModel = modelList.find((m) => m.provider === providerOption.name);

                            if (firstModel && setModel) {
                              setModel(firstModel.name);
                            }
                          }

                          setIsProviderDropdownOpen(false);
                          setProviderSearchQuery('');
                          setDebouncedProviderSearchQuery('');
                        }}
                        tabIndex={focusedProviderIndex === index ? 0 : -1}
                      >
                        <div className="flex items-center gap-2">
                          {LOCAL_PROVIDERS.includes(providerOption.name) && (
                            <span
                              className={classNames(
                                'inline-block w-2 h-2 rounded-full flex-shrink-0',
                                localProviderStatus[providerOption.name] === 'connected'
                                  ? 'bg-green-500'
                                  : localProviderStatus[providerOption.name] === 'disconnected'
                                    ? 'bg-red-400'
                                    : 'bg-bolt-elements-textTertiary',
                              )}
                            />
                          )}
                          <span
                            dangerouslySetInnerHTML={{
                              __html: (providerOption as any).highlightedName || providerOption.name,
                            }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Model Combobox */}
          <div className="relative flex w-full min-w-[70%]" onKeyDown={handleModelKeyDown} ref={modelDropdownRef}>
            <div
              className={classNames(
                'w-full p-2 rounded-lg border border-bolt-elements-borderColor',
                'bg-bolt-elements-prompt-background text-bolt-elements-textPrimary',
                'focus-within:outline-none focus-within:ring-2 focus-within:ring-bolt-elements-focus',
                'transition-all cursor-pointer',
                isModelDropdownOpen ? 'ring-2 ring-bolt-elements-focus' : undefined,
              )}
              onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsModelDropdownOpen(!isModelDropdownOpen);
                }
              }}
              role="combobox"
              aria-expanded={isModelDropdownOpen}
              aria-controls="model-listbox"
              aria-haspopup="listbox"
              tabIndex={0}
            >
              <div className="flex items-center justify-between">
                <div className="truncate">{modelList.find((m) => m.name === model)?.label || 'Select model'}</div>
                <div
                  className={classNames(
                    'i-ph:caret-down w-4 h-4 text-bolt-elements-textSecondary opacity-75',
                    isModelDropdownOpen ? 'rotate-180' : undefined,
                  )}
                />
              </div>
            </div>

            {isModelDropdownOpen && (
              <div
                className="absolute z-10 w-full mt-1 py-1 rounded-lg border border-bolt-elements-borderColor bg-bolt-elements-background-depth-2 shadow-lg"
                role="listbox"
                id="model-listbox"
              >
                <div className="px-2 pb-2 space-y-2">
                  {/* Free Models Filter Toggle - Only show for OpenRouter */}
                  {provider?.name === 'OpenRouter' && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowFreeModelsOnly(!showFreeModelsOnly);
                        }}
                        className={classNames(
                          'flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all',
                          'hover:bg-bolt-elements-background-depth-3',
                          showFreeModelsOnly
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                            : 'bg-bolt-elements-background-depth-3 text-bolt-elements-textSecondary border border-bolt-elements-borderColor',
                        )}
                      >
                        <span className="i-ph:gift text-xs" />
                        Free models only
                      </button>
                      {showFreeModelsOnly && (
                        <span className="text-xs text-bolt-elements-textTertiary">
                          {filteredModels.length} free model{filteredModels.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Search Result Count */}
                  {debouncedModelSearchQuery && filteredModels.length > 0 && (
                    <div className="text-xs text-bolt-elements-textTertiary px-1">
                      {filteredModels.length} model{filteredModels.length !== 1 ? 's' : ''} found
                      {filteredModels.length > 5 && ' (showing best matches)'}
                    </div>
                  )}

                  {/* Search Input */}
                  <div className="relative">
                    <input
                      ref={modelSearchInputRef}
                      type="text"
                      value={modelSearchQuery}
                      onChange={(e) => setModelSearchQuery(e.target.value)}
                      placeholder="Search models... (⌘K to clear)"
                      className={classNames(
                        'w-full pl-8 pr-8 py-1.5 rounded-md text-sm',
                        'bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor',
                        'text-bolt-elements-textPrimary placeholder:text-bolt-elements-textTertiary',
                        'focus:outline-none focus:ring-2 focus:ring-bolt-elements-focus',
                        'transition-all',
                      )}
                      onClick={(e) => e.stopPropagation()}
                      role="searchbox"
                      aria-label="Search models"
                    />
                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2">
                      <span className="i-ph:magnifying-glass text-bolt-elements-textTertiary" />
                    </div>
                    {modelSearchQuery && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearModelSearch();
                        }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-bolt-elements-background-depth-3 transition-colors"
                        aria-label="Clear search"
                      >
                        <span className="i-ph:x text-bolt-elements-textTertiary text-xs" />
                      </button>
                    )}
                  </div>
                </div>

                <div
                  className={classNames(
                    'max-h-60 overflow-y-auto',
                    'sm:scrollbar-none',
                    '[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2',
                    '[&::-webkit-scrollbar-thumb]:bg-bolt-elements-borderColor',
                    '[&::-webkit-scrollbar-thumb]:hover:bg-bolt-elements-borderColorHover',
                    '[&::-webkit-scrollbar-thumb]:rounded-full',
                    '[&::-webkit-scrollbar-track]:bg-bolt-elements-background-depth-2',
                    '[&::-webkit-scrollbar-track]:rounded-full',
                    'sm:[&::-webkit-scrollbar]:w-1.5 sm:[&::-webkit-scrollbar]:h-1.5',
                    'sm:hover:[&::-webkit-scrollbar-thumb]:bg-bolt-elements-borderColor/50',
                    'sm:hover:[&::-webkit-scrollbar-thumb:hover]:bg-bolt-elements-borderColor',
                    'sm:[&::-webkit-scrollbar-track]:bg-transparent',
                  )}
                >
                  {modelLoading === 'all' || modelLoading === provider?.name ? (
                    <div className="px-3 py-3 text-sm">
                      <div className="flex items-center gap-2 text-bolt-elements-textTertiary">
                        <span className="i-ph:spinner animate-spin" />
                        Loading models...
                      </div>
                    </div>
                  ) : filteredModels.length === 0 ? (
                    <div className="px-3 py-3 text-sm">
                      <div className="text-bolt-elements-textTertiary mb-1">
                        {debouncedModelSearchQuery
                          ? `No models match "${debouncedModelSearchQuery}"${showFreeModelsOnly ? ' (free only)' : ''}`
                          : showFreeModelsOnly
                            ? 'No free models available'
                            : provider?.name && LOCAL_PROVIDERS.includes(provider.name)
                              ? `No models found — is ${provider.name} running?`
                              : 'No models available'}
                      </div>
                      {!debouncedModelSearchQuery && provider?.name && LOCAL_PROVIDERS.includes(provider.name) && (
                        <div className="text-xs text-bolt-elements-textTertiary mt-1">
                          Make sure {provider.name} is running and has at least one model loaded.
                          {provider.name === 'Ollama' && ' Try: ollama pull llama3.2'}
                          {provider.name === 'LMStudio' && ' Load a model in LM Studio first.'}
                        </div>
                      )}
                      {debouncedModelSearchQuery && (
                        <div className="text-xs text-bolt-elements-textTertiary">
                          Try searching for model names, context sizes (e.g., "128k", "1M"), or capabilities
                        </div>
                      )}
                      {showFreeModelsOnly && !debouncedModelSearchQuery && (
                        <div className="text-xs text-bolt-elements-textTertiary">
                          Try disabling the "Free models only" filter to see all available models
                        </div>
                      )}
                    </div>
                  ) : (
                    filteredModels.map((modelOption, index) => (
                      <div
                        ref={(el) => {
                          modelOptionsRef.current[index] = el;
                        }}
                        key={modelOption.name}
                        role="option"
                        aria-selected={model === modelOption.name}
                        className={classNames(
                          'px-3 py-2 text-sm cursor-pointer',
                          'hover:bg-bolt-elements-background-depth-3',
                          'text-bolt-elements-textPrimary',
                          'outline-none',
                          model === modelOption.name || focusedModelIndex === index
                            ? 'bg-bolt-elements-background-depth-2'
                            : undefined,
                          focusedModelIndex === index ? 'ring-1 ring-inset ring-bolt-elements-focus' : undefined,
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          setModel?.(modelOption.name);
                          setIsModelDropdownOpen(false);
                          setModelSearchQuery('');
                          setDebouncedModelSearchQuery('');
                        }}
                        tabIndex={focusedModelIndex === index ? 0 : -1}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="truncate">
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: (modelOption as any).highlightedLabel || modelOption.label,
                                }}
                              />
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-bolt-elements-textTertiary">
                                {formatContextSize(modelOption.maxTokenAllowed)} tokens
                              </span>
                              {debouncedModelSearchQuery && (modelOption as any).searchScore > 70 && (
                                <span className="text-xs text-green-500 font-medium">
                                  {(modelOption as any).searchScore.toFixed(0)}% match
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 ml-2">
                            {isModelLikelyFree(modelOption, provider?.name) && (
                              <span className="i-ph:gift text-xs text-purple-400" title="Free model" />
                            )}
                            {model === modelOption.name && (
                              <span className="i-ph:check text-xs text-green-500" title="Selected" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
