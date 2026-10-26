import { useStore } from '@nanostores/react';
import React, { useState } from 'react';
import {
  isPaywallModalOpenStore,
  isActivationModalOpenStore,
  closePaywall,
  openActivationModal,
  openDePayCheckout,
  activateLicense,
  STRIPE_CHECKOUT_URL,
} from '~/lib/stores/license';

export const ProPaywallModal: React.FC = () => {
  const isOpen = useStore(isPaywallModalOpenStore);
  const isActivationOpen = useStore(isActivationModalOpenStore);
  const [licenseKeyInput, setLicenseKeyInput] = useState('');
  const [activationError, setActivationError] = useState('');

  if (!isOpen && !isActivationOpen) {
    return null;
  }

  const handleActivateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!licenseKeyInput.trim()) {
      setActivationError('Please enter a valid license key or receipt email.');
      return;
    }

    activateLicense(licenseKeyInput.trim());
    setLicenseKeyInput('');
    setActivationError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      {isOpen && (
        <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#D4AF37]/40 bg-[#0E0E12] p-6 shadow-[0_10px_50px_rgba(212,175,55,0.15)] text-bolt-elements-textPrimary">
          {/* Ambient Glow */}
          <div className="pointer-events-none absolute -top-16 -right-16 h-36 w-36 rounded-full bg-[#D4AF37]/20 blur-3xl" />

          {/* Close button */}
          <button
            type="button"
            onClick={closePaywall}
            className="absolute top-4 right-4 text-bolt-elements-textTertiary hover:text-white transition-colors"
            aria-label="Close"
          >
            <div className="i-ph:x text-lg" />
          </button>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 text-xs font-mono font-medium uppercase tracking-wider text-[#D4AF37]">
              <span>👑</span>
              <span>Zoth Bolt Pro Lifetime Access</span>
            </div>

            <h3 className="text-xl font-extrabold tracking-tight">Unlock the Full Sovereign Foundry</h3>

            <p className="text-xs text-bolt-elements-textSecondary leading-relaxed">
              Experience uncensored full-stack application synthesis directly in your browser. One-time payment of{' '}
              <strong>$19</strong>. No monthly recurring fees.
            </p>

            {/* 6 Value Matrix Checkpoints */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {[
                { icon: 'i-ph:lightning-duotone', text: 'Uncapped AST Code Generation' },
                { icon: 'i-ph:file-zip-duotone', text: 'Full Project ZIP & Git Export' },
                { icon: 'i-ph:sparkle-duotone', text: 'Gemini 2.5 Flash & Claude 3.5' },
                { icon: 'i-ph:database-duotone', text: 'Supabase Migration Engine' },
                { icon: 'i-ph:shield-check-duotone', text: '100% Client-Side Privacy' },
                { icon: 'i-ph:infinity-duotone', text: 'Lifetime Updates & Support' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-bolt-elements-textSecondary">
                  <div className={`${item.icon} text-[#D4AF37] text-base shrink-0`} />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            {/* Price Box */}
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-bolt-elements-textTertiary font-mono">
                  Founding Member
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm line-through text-bolt-elements-textTertiary">$79</span>
                  <span className="text-2xl font-black text-[#D4AF37]">$19</span>
                  <span className="text-xs font-semibold text-emerald-400">One-time payment</span>
                </div>
              </div>
              <div className="text-right text-[11px] text-bolt-elements-textTertiary">
                <span>30-Day Money-Back</span>
                <br />
                <span className="text-emerald-400 font-medium">Instant Activation</span>
              </div>
            </div>

            {/* Dual Payment Rails */}
            <div className="space-y-2 pt-1">
              <a
                href={STRIPE_CHECKOUT_URL}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#C5A028] to-[#997B1A] py-3 text-xs font-bold text-black shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-transform duration-150 hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>💳</span>
                <span>Pay with Card / Apple Pay / Google Pay ($19)</span>
              </a>

              <button
                type="button"
                onClick={openDePayCheckout}
                className="flex items-center justify-center gap-2 w-full rounded-xl border border-[#14F195]/40 bg-[#14F195]/10 py-2.5 text-xs font-bold text-[#14F195] transition-all hover:bg-[#14F195]/20 hover:border-[#14F195]"
              >
                <span>⚡</span>
                <span>Pay with Solana (SOL / USDC)</span>
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  closePaywall();
                  openActivationModal();
                }}
                className="text-xs text-bolt-elements-textTertiary hover:text-[#D4AF37] transition-colors underline underline-offset-2"
              >
                Already purchased? Activate with License Key / Receipt Email 🔑
              </button>
            </div>
          </div>
        </div>
      )}

      {/* License Key Activation Modal */}
      {isActivationOpen && (
        <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#D4AF37]/40 bg-[#0E0E12] p-6 shadow-[0_10px_50px_rgba(212,175,55,0.15)] text-bolt-elements-textPrimary">
          <button
            type="button"
            onClick={() => isActivationModalOpenStore.set(false)}
            className="absolute top-4 right-4 text-bolt-elements-textTertiary hover:text-white transition-colors"
            aria-label="Close"
          >
            <div className="i-ph:x text-lg" />
          </button>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#D4AF37]">
              <div className="i-ph:key-duotone text-2xl" />
              <h3 className="text-lg font-bold">Activate Pro License</h3>
            </div>

            <p className="text-xs text-bolt-elements-textSecondary">
              Enter your Stripe receipt email, transaction hash, or license key to permanently activate Zoth Bolt Pro
              on this device:
            </p>

            <form onSubmit={handleActivateSubmit} className="space-y-3">
              <input
                type="text"
                value={licenseKeyInput}
                onChange={(e) => setLicenseKeyInput(e.target.value)}
                placeholder="name@example.com or LICENSE-KEY"
                className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                autoFocus
              />

              {activationError && <p className="text-xs text-rose-400">{activationError}</p>}

              <button
                type="submit"
                className="w-full rounded-xl bg-[#D4AF37] py-2.5 text-xs font-bold text-black transition-all hover:bg-[#F5E6AB]"
              >
                ⚡ Activate Lifetime License
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
