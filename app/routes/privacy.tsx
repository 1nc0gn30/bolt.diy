import type { MetaFunction } from '@remix-run/cloudflare';
import { Header } from '~/components/header/Header';
import BackgroundRays from '~/components/ui/BackgroundRays';

export const meta: MetaFunction = () => {
  return [
    { title: 'Privacy Policy — Zoth Bolt' },
    {
      name: 'description',
      content: 'Privacy policy and sovereign client-side data handling for Zoth Bolt by Neal Frazier Tech.',
    },
  ];
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-bolt-elements-background-depth-1 text-bolt-elements-textPrimary">
      <BackgroundRays />
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full z-1">
        <div className="rounded-2xl border border-white/10 bg-[#0E0E12]/80 backdrop-blur-xl p-8 sm:p-12 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono font-medium uppercase tracking-wider text-emerald-400 mb-6">
            <span>🛡️</span>
            <span>Zero-Telemetry Privacy Standard</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-4">
            Privacy Policy & Data Sovereignty
          </h1>
          <p className="text-xs text-bolt-elements-textTertiary font-mono mb-8">
            Last Updated: October 2026 • Neal Frazier Tech
          </p>

          <div className="space-y-8 text-sm text-bolt-elements-textSecondary leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#D4AF37]">1. Zero Server-Side Prompt or Code Storage</h2>
              <p>
                <strong>Zoth Bolt</strong> is engineered with a strict{' '}
                <em>local-first, sovereign architecture</em>. Your prompts, code artifacts, AST file trees, and terminal
                execution buffers are stored exclusively in your browser’s local IndexedDB and localStorage instances.
                We run zero centralized databases that capture or retain your project data.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#D4AF37]">2. Direct LLM API Key Communication</h2>
              <p>
                When you input an API key (e.g., Google Gemini, Anthropic, OpenAI) or configure local endpoints (Ollama,
                LM Studio), network calls originate directly from your local browser environment to your chosen LLM
                provider. Your credentials are never proxied, harvested, or logged by Neal Frazier Tech.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#D4AF37]">3. Payment Processing & Analytics</h2>
              <p>
                Payments are securely managed by <strong>Stripe Inc.</strong> and the <strong>Solana blockchain</strong>
                . We do not store credit card numbers, billing addresses, or private cryptographic keys. We do not use
                third-party surveillance trackers (such as Google Tag Manager or Facebook Pixel).
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#D4AF37]">4. GDPR & CCPA Compliance</h2>
              <p>
                Because all user data resides locally in your browser storage, you maintain total sovereignty over your
                data. You can delete all conversations, cached packages, and license tokens at any time simply by
                clearing your browser cache or clicking "Delete All Chats" in the sidebar menu.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap gap-4 text-xs">
            <a href="/" className="text-[#D4AF37] hover:underline font-bold">
              ← Back to Foundry Workspace
            </a>
            <a href="/terms" className="text-bolt-elements-textTertiary hover:text-white">
              Terms of Service
            </a>
            <a href="/support" className="text-bolt-elements-textTertiary hover:text-white">
              Support & Contact
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
