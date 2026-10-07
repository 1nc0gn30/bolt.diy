import { useStore } from '@nanostores/react';
import { useState } from 'react';
import { ClientOnly } from 'remix-utils/client-only';
import { HeaderActionButtons } from './HeaderActionButtons.client';
import { AgyTerminalModal } from '~/components/terminal/AgyTerminalModal';
import { ChatDescription } from '~/lib/persistence/ChatDescription.client';
import { chatStore } from '~/lib/stores/chat';
import { isProLicensedStore, openPaywall, openDePayCheckout } from '~/lib/stores/license';
import { classNames } from '~/utils/classNames';

export function Header() {
  const chat = useStore(chatStore);
  const isLicensed = useStore(isProLicensedStore);
  const [isAgyTerminalOpen, setIsAgyTerminalOpen] = useState(false);

  return (
    <header
      className={classNames('flex items-center justify-between px-4 border-b h-[var(--header-height)]', {
        'border-transparent': !chat.started,
        'border-bolt-elements-borderColor': chat.started,
      })}
    >
      <div className="flex items-center gap-2 z-logo text-bolt-elements-textPrimary cursor-pointer">
        <div className="i-ph:sidebar-simple-duotone text-xl" />
        <a
          href="/"
          className="flex items-center gap-2.5 text-bolt-elements-textPrimary hover:opacity-90 transition-opacity"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#8C6D1F] flex items-center justify-center shadow-[0_0_12px_rgba(212,175,55,0.4)] border border-[#F5E6AB]/40 shrink-0">
            <span className="font-extrabold text-black text-xs font-mono">Z</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-base tracking-wider text-bolt-elements-textPrimary">ZOTH</span>
            <span className="font-semibold text-xs tracking-widest text-[#D4AF37]">WEBGEN</span>
            <span className="hidden sm:inline-block ml-1 text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]">
              FOUNDRY
            </span>
          </div>
        </a>
      </div>

      {!chat.started && (
        <button
          type="button"
          onClick={() => setIsAgyTerminalOpen(true)}
          className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D0D12]/90 hover:bg-[#181822] border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 text-xs font-mono text-white/80 shadow-[0_0_12px_rgba(212,175,55,0.1)] transition-all cursor-pointer group"
          title="Click to launch AGY & ZothOS Host Terminal"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
          <span className="font-bold text-[#D4AF37] group-hover:text-amber-300">ZOTHOS ENGINES</span>
          <span className="text-white/30">•</span>
          <span className="text-white/70">AGY · Hermes · Ollama</span>
          <span className="text-white/30">•</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Terminal Live
          </span>
        </button>
      )}

      {chat.started && (
        <span className="flex-1 px-4 truncate text-center text-bolt-elements-textPrimary">
          <ClientOnly>{() => <ChatDescription />}</ClientOnly>
        </span>
      )}

      {/* Header Monetization & Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Quick AGY Terminal Launch Button */}
        <button
          type="button"
          onClick={() => setIsAgyTerminalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/40 bg-black/60 hover:bg-amber-500/10 text-amber-400 text-xs font-mono font-medium transition-all shadow-[0_0_10px_rgba(212,175,55,0.1)] cursor-pointer"
          title="Open AGY & ZothOS Host Terminal"
        >
          <span className="i-ph:terminal-window text-sm" />
          <span className="hidden sm:inline">AGY Terminal</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </button>

        <ClientOnly>
          {() => (
            <>
              {isLicensed ? (
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />⭐ PRO ACTIVE
                </span>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={openPaywall}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#D4AF37]/40 bg-gradient-to-r from-[#D4AF37]/20 to-[#997B1A]/20 text-[#D4AF37] hover:border-[#D4AF37] text-xs font-bold transition-all shadow-[0_0_10px_rgba(212,175,55,0.15)]"
                  >
                    <span>👑</span>
                    <span className="hidden xs:inline">Buy</span>
                    <span>Pro ($19)</span>
                  </button>
                  <button
                    type="button"
                    onClick={openDePayCheckout}
                    className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#14F195]/30 bg-[#14F195]/10 text-[#14F195] hover:bg-[#14F195]/20 text-xs font-medium transition-all"
                  >
                    <span>⚡</span>
                    <span>SOL</span>
                  </button>
                </div>
              )}
            </>
          )}
        </ClientOnly>

        {chat.started && (
          <ClientOnly>
            {() => (
              <div>
                <HeaderActionButtons chatStarted={chat.started} />
              </div>
            )}
          </ClientOnly>
        )}
      </div>

      <ClientOnly>
        {() => <AgyTerminalModal isOpen={isAgyTerminalOpen} onClose={() => setIsAgyTerminalOpen(false)} />}
      </ClientOnly>
    </header>
  );
}
