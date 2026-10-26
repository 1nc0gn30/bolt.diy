import { useStore } from '@nanostores/react';
import { useState } from 'react';
import { ClientOnly } from 'remix-utils/client-only';
import { HeaderActionButtons } from './HeaderActionButtons.client';
import { AssetVaultModal } from '~/components/chat/AssetVaultModal';
import { AIStudioModal } from '~/components/studio/AIStudioModal';
import { AgyTerminalModal } from '~/components/terminal/AgyTerminalModal';
import { SoulMemoryPanel } from '~/components/zoth/SoulMemoryPanel';
import { ZothBridgeDock } from '~/components/zoth/ZothBridgeDock';
import { soulPanelOpenAtom } from '~/lib/stores/soul';
import { ChatDescription } from '~/lib/persistence/ChatDescription.client';
import { chatStore } from '~/lib/stores/chat';
import { isProLicensedStore } from '~/lib/stores/license';
import { isAIStudioOpenAtom, pendingPromptAppendAtom } from '~/lib/stores/studioStore';
import { classNames } from '~/utils/classNames';

export function Header() {
  const chat = useStore(chatStore);
  const isLicensed = useStore(isProLicensedStore);
  const isAIStudioOpen = useStore(isAIStudioOpenAtom);
  const [isAgyTerminalOpen, setIsAgyTerminalOpen] = useState(false);
  const [isAssetVaultOpen, setIsAssetVaultOpen] = useState(false);

  return (
    <header
      className={classNames('flex items-center justify-between px-3 sm:px-4 border-b h-[var(--header-height)]', {
        'border-transparent': !chat.started,
        'border-bolt-elements-borderColor': chat.started,
      })}
    >
      <div className="flex items-center gap-1.5 sm:gap-2 z-logo text-bolt-elements-textPrimary cursor-pointer shrink-0">
        <div className="i-ph:sidebar-simple-duotone text-xl shrink-0" />
        <a
          href="/"
          className="flex items-center gap-2 text-bolt-elements-textPrimary hover:opacity-90 transition-opacity shrink-0"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#8C6D1F] flex items-center justify-center shadow-[0_0_12px_rgba(212,175,55,0.4)] border border-[#F5E6AB]/40 shrink-0">
            <span className="font-extrabold text-black text-xs font-mono">⚡</span>
          </div>
          <div className="flex items-baseline gap-1.5 shrink-0 whitespace-nowrap">
            <span className="hidden sm:inline font-bold text-base tracking-wider text-bolt-elements-textPrimary">ZOTH</span>
            <span className="font-semibold text-xs tracking-widest text-[#D4AF37]">BOLT</span>
            <span className="hidden md:inline-block ml-1 text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]">
              AI &amp; MOTION ARCHITECT
            </span>
          </div>
        </a>
      </div>

      <div className="flex-1 min-w-2" />

      {chat.started && (
        <span className="hidden md:inline-block max-w-[280px] px-4 truncate text-center text-bolt-elements-textPrimary text-xs font-medium">
          <ClientOnly>{() => <ChatDescription />}</ClientOnly>
        </span>
      )}

      {/* Header Action Buttons & Status */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <button
          type="button"
          onClick={() => setIsAssetVaultOpen(true)}
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#F5E6AB] text-xs font-mono font-bold transition-all cursor-pointer shrink-0"
          title="Open Zoth Bolt Asset, Pixel-Art, SVG & Motion Edit Vault"
        >
          <span className="i-ph:sparkle-fill text-sm text-[#D4AF37]" />
          <span className="hidden sm:inline">Assets &amp; Motion</span>
        </button>

        <ZothBridgeDock
          onOpenAgy={() => setIsAgyTerminalOpen(true)}
          onOpenStudio={() => isAIStudioOpenAtom.set(true)}
        />

        <button
          type="button"
          onClick={() => soulPanelOpenAtom.set(true)}
          className="inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-full border border-accent-500/40 bg-accent-500/10 hover:bg-accent-500/20 text-accent-200 text-xs font-mono font-medium transition-all cursor-pointer shrink-0"
          title="Open WebGen soul and memory"
        >
          <span className="i-ph:brain text-sm" />
          <span className="hidden sm:inline">Soul</span>
        </button>

        <button
          type="button"
          onClick={() => isAIStudioOpenAtom.set(true)}
          className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/40 bg-blue-950/40 hover:bg-blue-900/40 text-blue-300 text-xs font-mono font-medium transition-all cursor-pointer shrink-0"
          title="Open Google AI Studio Developer Controls & System Tuning"
        >
          <span className="i-ph:sliders-horizontal text-sm text-blue-400" />
          <span>AI Studio</span>
        </button>

        <button
          type="button"
          onClick={() => setIsAgyTerminalOpen(true)}
          className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/40 bg-black/60 hover:bg-amber-500/10 text-amber-400 text-xs font-mono font-medium transition-all cursor-pointer shrink-0"
          title="Open AGY & ZothOS Host Terminal"
        >
          <span className="i-ph:terminal-window text-sm" />
          <span>AGY</span>
        </button>

        <ClientOnly>
          {() =>
            isLicensed ? (
              <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold tracking-wider shrink-0">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                PRO
              </span>
            ) : null
          }
        </ClientOnly>

        {chat.started && (
          <ClientOnly>
            {() => (
              <div className="shrink-0">
                <HeaderActionButtons chatStarted={chat.started} />
              </div>
            )}
          </ClientOnly>
        )}
      </div>

      <ClientOnly>
        {() => (
          <>
            <AgyTerminalModal isOpen={isAgyTerminalOpen} onClose={() => setIsAgyTerminalOpen(false)} />
            <AIStudioModal isOpen={isAIStudioOpen} onClose={() => isAIStudioOpenAtom.set(false)} />
            <AssetVaultModal
              isOpen={isAssetVaultOpen}
              onClose={() => setIsAssetVaultOpen(false)}
              onInjectPrompt={(snippet) => pendingPromptAppendAtom.set(snippet)}
            />
            <SoulMemoryPanel />
          </>
        )}
      </ClientOnly>
    </header>
  );
}
