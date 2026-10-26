import type { MetaFunction } from '@remix-run/cloudflare';
import { Header } from '~/components/header/Header';
import BackgroundRays from '~/components/ui/BackgroundRays';

export const meta: MetaFunction = () => {
  return [
    { title: 'Terms of Service — Zoth Bolt' },
    {
      name: 'description',
      content: 'Terms of service and lifetime commercial license terms for Zoth Bolt by Neal Frazier Tech.',
    },
  ];
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-bolt-elements-background-depth-1 text-bolt-elements-textPrimary">
      <BackgroundRays />
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full z-1">
        <div className="rounded-2xl border border-white/10 bg-[#0E0E12]/80 backdrop-blur-xl p-8 sm:p-12 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 text-xs font-mono font-medium uppercase tracking-wider text-[#D4AF37] mb-6">
            <span>📜</span>
            <span>Legal Documentation</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-4">
            Terms of Service & Commercial License
          </h1>
          <p className="text-xs text-bolt-elements-textTertiary font-mono mb-8">
            Last Updated: October 2026 • Neal Frazier Tech
          </p>

          <div className="space-y-8 text-sm text-bolt-elements-textSecondary leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#D4AF37]">1. Lifetime Commercial License Grant</h2>
              <p>
                Upon purchasing a lifetime license to <strong>Zoth Bolt</strong> via Stripe or DePay Solana,
                Neal Frazier Tech grants you a perpetual, non-exclusive, worldwide commercial license to use the
                software to architect, generate, compile, and export web applications for personal, commercial, client,
                and internal enterprise projects.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#D4AF37]">2. 100% Client-Side In-Browser Execution</h2>
              <p>
                Zoth Bolt operates client-side inside your browser via WebContainer technology. You acknowledge that
                code execution, AST transformations, and file generation take place locally on your hardware. Neal
                Frazier Tech does not operate backend servers that host or execute your generated applications.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#D4AF37]">3. Payments, Refunds & 30-Day Guarantee</h2>
              <p>
                All purchases are processed securely through Stripe (Credit Card, Apple Pay, Google Pay) or
                decentralized Web3 smart contracts (Solana SOL / USDC). We honor a unconditional{' '}
                <strong>30-day money-back guarantee</strong> for any customer unsatisfied with their experience. Simply
                reach out to{' '}
                <a href="mailto:support@nealfrazier.tech" className="text-[#D4AF37] underline">
                  support@nealfrazier.tech
                </a>{' '}
                with your receipt.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#D4AF37]">4. Ownership of Generated Output</h2>
              <p>
                You retain 100% complete, unencumbered ownership and intellectual property rights over any source code,
                media, components, configurations, and applications synthesized or exported through Zoth Bolt. Neal
                Frazier Tech claims zero royalties, equity, or rights in your creations.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#D4AF37]">5. Attribution & Heritage</h2>
              <p>
                Zoth Bolt is engineered by Neal Frazier Tech (@1nc0gn30) as part of the NullAI Platform. The
                platform architecture is inspired by Bolt and WebContainer open-source foundations under the MIT
                License.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap gap-4 text-xs">
            <a href="/" className="text-[#D4AF37] hover:underline font-bold">
              ← Back to Foundry Workspace
            </a>
            <a href="/privacy" className="text-bolt-elements-textTertiary hover:text-white">
              Privacy Policy
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
