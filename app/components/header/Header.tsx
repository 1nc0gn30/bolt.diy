import { useStore } from '@nanostores/react';
import { useState } from 'react';
import { ClientOnly } from 'remix-utils/client-only';
import { HeaderActionButtons } from './HeaderActionButtons.client';
import { AgyTerminalModal } from '~/components/terminal/AgyTerminalModal';
import { AIStudioModal } from '~/components/studio/AIStudioModal';
import { isAIStudioOpenAtom } from '~/lib/stores/studioStore';
import { ChatDescription } from '~/lib/persistence/ChatDescription.client';
import { chatStore } from '~/lib/stores/chat';
import { isProLicensedStore } from '~/lib/stores/license';
import { classNames } from '~/utils/classNames';

export function Header() {
  const chat = useStore(chatStore);
  const isLicensed = useStore(isProLicensedStore);
  const isAIStudioOpen = useStore(isAIStudioOpenAtom);
  const [isAgyTerminalOpen, setIsAgyTerminalOpen] = useState(false);

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
            <span className="font-extrabold text-black text-xs font-mono">Z</span>
          </div>
          <div className="flex items-baseline gap-1.5 shrink-0 whitespace-nowrap">
            <span className="font-bold text-base tracking-wider text-bolt-elements-textPrimary">ZOTH</span>
            <span className="font-semibold text-xs tracking-widest text-[#D4AF37]">WEBGEN</span>
            <span className="hidden sm:inline-block ml-1 text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]">
              FOUNDRY
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
      <div className="flex items-center gap-2 shrink-0">
        {/* Google AI Studio Controls Pill */}
        <button
          type="button"
          onClick={() => isAIStudioOpenAtom.set(true)}
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full border border-blue-500/40 bg-blue-950/40 hover:bg-blue-900/40 text-blue-300 text-xs font-mono font-medium transition-all shadow-[0_0_10px_rgba(59,130,246,0.15)] cursor-pointer shrink-0"
          title="Open Google AI Studio Developer Controls & System Tuning"
        >
          <span className="i-ph:sliders-horizontal text-sm text-blue-400" />
          <span className="hidden sm:inline">AI Studio</span>
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
        </button>

        {/* Quick AGY Terminal Launch Button / Connection Pill */}
        <button
          type="button"
          onClick={() => setIsAgyTerminalOpen(true)}
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full border border-amber-500/40 bg-black/60 hover:bg-amber-500/10 text-amber-400 text-xs font-mono font-medium transition-all shadow-[0_0_10px_rgba(212,175,55,0.1)] cursor-pointer shrink-0"
          title="Open AGY & ZothOS Host Terminal"
        >
          <span className="i-ph:terminal-window text-sm" />
          <span className="hidden sm:inline">AGY Terminal</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </button>

        <ClientOnly>
          {() =>
            isLicensed ? (
              <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold tracking-wider shrink-0">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />⭐ PRO ACTIVE
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
          </>
        )}
      </ClientOnly>
    </header>
  );
}
