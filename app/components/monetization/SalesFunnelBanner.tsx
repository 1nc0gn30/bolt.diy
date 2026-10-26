import { useStore } from '@nanostores/react';
import React from 'react';
import { isProLicensedStore, openActivationModal, openDePayCheckout, STRIPE_CHECKOUT_URL } from '~/lib/stores/license';

export const SalesFunnelBanner: React.FC = () => {
  const isLicensed = useStore(isProLicensedStore);

  if (isLicensed) {
    return null;
  }

  return (
    <div className="relative mx-auto my-2.5 w-full max-w-4xl px-4 animate-fade-in">
      <div className="relative overflow-hidden rounded-2xl border border-[#D4AF37]/35 bg-gradient-to-r from-[#121217]/90 via-[#0e0e12]/95 to-[#161510]/90 p-4 md:p-4.5 shadow-[0_4px_30px_rgba(212,175,55,0.08)] backdrop-blur-xl transition-all duration-300 hover:border-[#D4AF37]/50">
        {/* Ambient Top Glow Beam */}
        <div className="pointer-events-none absolute -top-12 left-1/2 h-24 w-96 -translate-x-1/2 rounded-full bg-[#D4AF37]/15 blur-2xl" />

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-widest text-[#D4AF37] uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              🔥 FOUNDING ARCHITECT LIFETIME DEAL • 73% OFF
            </div>
            <h2 className="text-base md:text-lg font-extrabold tracking-tight text-bolt-elements-textPrimary">
              Supercharge Your Workflow with{' '}
              <span className="bg-gradient-to-r from-[#F5E6AB] to-[#D4AF37] bg-clip-text text-transparent">
                Zoth Bolt Pro
              </span>
            </h2>
            <p className="text-xs text-bolt-elements-textSecondary max-w-xl leading-relaxed">
              Unlock unthrottled in-browser AST code generation, full repository ZIP exports, Supabase schema
              generators, and autonomous sovereign mode for a single $19 lifetime license.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
            <div className="flex items-baseline gap-2">
              <span className="text-xs line-through text-bolt-elements-textTertiary">$79</span>
              <span className="text-2xl font-black text-[#D4AF37]">$19</span>
              <span className="text-[10px] font-medium text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                LIFETIME
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href={STRIPE_CHECKOUT_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#D4AF37] via-[#C5A028] to-[#997B1A] px-3.5 py-1.5 text-xs font-bold text-black shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>💳</span>
                <span>Unlock Pro ($19)</span>
              </a>

              <button
                type="button"
                onClick={openDePayCheckout}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#14F195]/40 bg-[#14F195]/10 px-3 py-1.5 text-xs font-bold text-[#14F195] transition-all hover:bg-[#14F195]/20 hover:border-[#14F195]"
              >
                <span>⚡</span>
                <span>Pay with SOL</span>
              </button>
            </div>

            <button
              type="button"
              onClick={openActivationModal}
              className="text-[11px] text-bolt-elements-textTertiary hover:text-[#D4AF37] transition-colors underline underline-offset-2"
            >
              Already purchased? Enter License Key / Email 🔑
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
