import type { MetaFunction } from '@remix-run/cloudflare';
import { useState } from 'react';
import { Header } from '~/components/header/Header';
import BackgroundRays from '~/components/ui/BackgroundRays';

export const meta: MetaFunction = () => {
  return [
    { title: 'Support & Help Hub — Zoth WebGen Foundry' },
    {
      name: 'description',
      content: 'Customer support, technical assistance, license activation help, and FAQs for Zoth WebGen Foundry.',
    },
  ];
};

export default function SupportPage() {
  const [copied, setCopied] = useState(false);

  const issueTemplate = `[ZOTH WEBGEN SUPPORT TICKET]
Issue Description: 
Operating System / Browser: 
LLM Provider / Model: 
License Email / Tx Hash: 
Steps to Reproduce: `;

  const copyTemplate = () => {
    navigator.clipboard.writeText(issueTemplate).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-bolt-elements-background-depth-1 text-bolt-elements-textPrimary">
      <BackgroundRays />
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full z-1">
        <div className="rounded-2xl border border-white/10 bg-[#0E0E12]/80 backdrop-blur-xl p-8 sm:p-12 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 text-xs font-mono font-medium uppercase tracking-wider text-[#D4AF37] mb-6">
            <span>🤝</span>
            <span>Customer Concierge & Technical Help</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-4">Support & Knowledge Hub</h1>
          <p className="text-xs text-bolt-elements-textTertiary font-mono mb-8">
            Prompt Help • 30-Day Refunds • Developer Community
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-3">
              <div className="i-ph:envelope-simple-duotone text-2xl text-[#D4AF37]" />
              <h3 className="font-bold text-white">Direct Email Concierge</h3>
              <p className="text-xs text-bolt-elements-textSecondary">
                Reach our team directly for order verification, refunds, enterprise inquiries, or license reactivation.
              </p>
              <a
                href="mailto:support@nealfrazier.tech"
                className="inline-block text-xs font-mono font-bold text-[#D4AF37] hover:underline"
              >
                support@nealfrazier.tech →
              </a>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-3">
              <div className="i-ph:git-branch-duotone text-2xl text-[#14F195]" />
              <h3 className="font-bold text-white">GitHub Issues & Community</h3>
              <p className="text-xs text-bolt-elements-textSecondary">
                Report bugs, suggest prompt templates, or track feature developments on the official repo.
              </p>
              <a
                href="https://github.com/1nc0gn30"
                target="_blank"
                rel="noreferrer"
                className="inline-block text-xs font-mono font-bold text-[#14F195] hover:underline"
              >
                github.com/1nc0gn30 →
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Frequently Answered Inquiries</h2>

            <div className="space-y-4 text-xs text-bolt-elements-textSecondary">
              <div className="rounded-xl border border-white/10 p-4 space-y-1.5">
                <strong className="text-sm text-[#D4AF37] block">How do I activate my license on a new device?</strong>
                <p>
                  Click "Already purchased? Enter License Key" on the sales banner or header, and input your Stripe
                  receipt email address or Solana transaction signature. It activates immediately client-side.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 p-4 space-y-1.5">
                <strong className="text-sm text-[#D4AF37] block">What is the refund process?</strong>
                <p>
                  We provide a 100% money-back guarantee within 30 days of purchase. Simply email
                  support@nealfrazier.tech with your receipt, and we will issue a full refund with zero friction.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 p-4 space-y-1.5">
                <strong className="text-sm text-[#D4AF37] block">Does Zoth WebGen require a paid API key?</strong>
                <p>
                  You can use Google Gemini (free tier available with Gemini 2.5 Flash), or local offline models via
                  Ollama and LM Studio with zero API costs.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-3 mt-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white">Quick Support Ticket Template</span>
                <button
                  type="button"
                  onClick={copyTemplate}
                  className="px-3 py-1 rounded bg-[#D4AF37] text-black text-xs font-bold hover:bg-[#F5E6AB] transition-colors"
                >
                  {copied ? '✓ Copied to Clipboard!' : '📋 Copy Template'}
                </button>
              </div>
              <pre className="p-3 rounded bg-black/40 text-[11px] font-mono text-gray-400 overflow-x-auto">
                {issueTemplate}
              </pre>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap gap-4 text-xs">
            <a href="/" className="text-[#D4AF37] hover:underline font-bold">
              ← Back to Foundry Workspace
            </a>
            <a href="/terms" className="text-bolt-elements-textTertiary hover:text-white">
              Terms of Service
            </a>
            <a href="/privacy" className="text-bolt-elements-textTertiary hover:text-white">
              Privacy Policy
            </a>
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t border-white/10 py-6 text-center text-xs text-bolt-elements-textTertiary">
        Engineered by Neal Frazier Tech (
        <a href="https://github.com/1nc0gn30" className="text-[#D4AF37]">
          @1nc0gn30
        </a>
        ) • NullAI Platform • Inspired by Bolt
      </footer>
    </div>
  );
}
