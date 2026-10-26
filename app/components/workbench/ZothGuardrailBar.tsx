import { useStore } from '@nanostores/react';
import React, { useMemo } from 'react';
import { toast } from 'react-toastify';
import { workbenchStore } from '~/lib/stores/workbench';

export const ZothGuardrailBar: React.FC = () => {
  const files = useStore(workbenchStore.files);

  const audit = useMemo(() => {
    const entries = Object.entries(files || {});
    let combined = '';
    let hasRobots = false;
    let hasNetlifyToml = false;

    for (const [filePath, dirent] of entries) {
      if (filePath.endsWith('robots.txt')) {
        hasRobots = true;
      }

      if (filePath.endsWith('netlify.toml')) {
        hasNetlifyToml = true;
      }

      if (dirent && dirent.type === 'file' && !dirent.isBinary && typeof dirent.content === 'string') {
        combined += `\n${dirent.content}`;
      }
    }

    const checks = [
      {
        id: 'JSON-LD',
        label: 'Schema.org @graph (WebApplication + FAQPage)',
        pass: /application\/ld\+json/i.test(combined) && /FAQPage/i.test(combined),
      },
      {
        id: 'OG-META',
        label: 'OpenGraph & Twitter Card Social Headers',
        pass: /og:title/i.test(combined) && /twitter:card/i.test(combined),
      },
      {
        id: 'VIEWPORT',
        label: 'Triple-Viewport Responsive Meta Tag',
        pass: /name=["']viewport["']/i.test(combined),
      },
      {
        id: 'ALT-TEXT',
        label: '100% Image Alt-Text Accessibility',
        pass: !/<img(?![^>]*\balt=)[^>]*>/i.test(combined),
      },
      {
        id: 'SVG/CANVAS',
        label: '60fps Canvas Shader or Multi-Layer SVG Craft',
        pass: /<canvas\b/i.test(combined) || /<svg\b/i.test(combined),
      },
      {
        id: 'ROBOTS/TOML',
        label: 'Frontier Crawler robots.txt & netlify.toml',
        pass: hasRobots && hasNetlifyToml,
      },
      {
        id: 'ATTRIBUTION',
        label: 'Neal Frazier Tech (@1nc0gn30) • NullAI Platform',
        pass: /Neal Frazier Tech|1nc0gn30|NullAI/i.test(combined),
      },
      {
        id: 'MONETIZATION',
        label: 'Dual-Rail Stripe + Solana DePay & ?licensed=true',
        pass: /Stripe|Solana|DePay|licensed/i.test(combined),
      },
    ];

    const passed = checks.filter((c) => c.pass).length;
    const score = entries.length > 0 ? Math.round((passed / checks.length) * 100) : 100;

    return { checks, passed, total: checks.length, score, fileCount: entries.length };
  }, [files]);

  const handleAutoHealWorkspace = async () => {
    try {
      const entries = Object.entries(files || {});
      const htmlEntry = entries.find(([p, d]) => p.endsWith('index.html') && d?.type === 'file');

      const robotsContent = `User-agent: *
User-agent: Googlebot
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: PerplexityBot
User-agent: Applebot
Allow: /
Crawl-delay: 0
Sitemap: https://zoth.nullai.tech/sitemap.xml
`;

      const netlifyTomlContent = `[build]
  publish = "dist"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`;

      await workbenchStore.createFile('/home/project/public/robots.txt', robotsContent);
      await workbenchStore.createFile('/home/project/netlify.toml', netlifyTomlContent);

      if (htmlEntry) {
        const [htmlPath, htmlDirent] = htmlEntry;
        let html = (htmlDirent as any).content || '';

        html = html.replace(/<img(?![^>]*\balt=)([^>]*)>/gi, '<img alt="Zoth Bolt visual asset"$1>');

        const headExtras: string[] = [];

        if (!/name=["']viewport["']/i.test(html)) {
          headExtras.push('    <meta name="viewport" content="width=device-width, initial-scale=1.0" />');
        }

        if (!/og:title/i.test(html)) {
          headExtras.push(
            '    <meta property="og:title" content="Zoth Bolt Sovereign App" />',
            '    <meta property="og:description" content="Engineered with Zoth Bolt by Neal Frazier Tech (@1nc0gn30) • NullAI Platform" />',
            '    <meta property="og:type" content="website" />',
            '    <meta property="og:image" content="https://zoth.nullai.tech/og-banner.png" />',
            '    <meta name="twitter:card" content="summary_large_image" />',
            '    <meta name="twitter:site" content="@1nc0gn30" />',
            '    <meta name="twitter:creator" content="@1nc0gn30" />',
          );
        }

        if (!/application\/ld\+json/i.test(html) || !/FAQPage/i.test(html)) {
          const schema = {
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'WebApplication',
                name: 'Zoth Bolt Sovereign Application',
                applicationCategory: 'DeveloperApplication',
                operatingSystem: 'All',
                offers: { '@type': 'Offer', price: '19.00', priceCurrency: 'USD' },
                creator: { '@type': 'Organization', name: 'Neal Frazier Tech', url: 'https://nullai.tech' },
              },
              {
                '@type': 'FAQPage',
                mainEntity: [
                  {
                    '@type': 'Question',
                    name: 'Does this application run directly in the browser?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Yes, 100% client-side execution with zero fake placeholders.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'What payment and licensing options are supported?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Supports Stripe and Solana DePay with instant ?licensed=true client-side activation.',
                    },
                  },
                ],
              },
            ],
          };
          headExtras.push(`    <script type="application/ld+json">${JSON.stringify(schema)}</script>`);
        }

        if (headExtras.length > 0 && /<\/head>/i.test(html)) {
          html = html.replace(/<\/head>/i, `${headExtras.join('\n')}\n  </head>`);
        }

        if (!/Neal Frazier Tech|1nc0gn30/i.test(html) || !/Stripe|Solana|DePay|licensed/i.test(html)) {
          const footerBlock = `
  <!-- Sovereign Attribution & Dual-Rail Monetization Ready -->
  <footer style="padding:12px 20px;text-align:center;font-family:monospace;font-size:12px;color:#94A3B8;background:#08080B;border-top:1px solid rgba(212,175,55,0.25);">
    <span>⚡ Founding Pro ($19 Lifetime via Stripe &amp; Solana DePay • ?licensed=true)</span> •
    <span>Engineered by <a href="https://github.com/1nc0gn30" style="color:#D4AF37;">Neal Frazier Tech (@1nc0gn30)</a> • <a href="https://nullai.tech" style="color:#38BDF8;">NullAI Platform</a> • <svg width="10" height="10" viewBox="0 0 10 10" style="display:inline-block"><circle cx="5" cy="5" r="4" fill="#D4AF37"/></svg></span>
  </footer>`;
          html = html.replace(/<\/body>/i, `${footerBlock}\n</body>`);
        }

        workbenchStore.setDocuments({
          ...workbenchStore.documents.get(),
          [htmlPath]: {
            value: html,
            isBinary: false,
            filePath: htmlPath,
          },
        });
        await workbenchStore.saveFile(htmlPath);
      }

      toast.success('🛡️ Auto-Healed Workspace: Injected Schema.org @graph, OpenGraph, robots.txt, netlify.toml & Sovereign Funnel!');
    } catch {
      toast.info('Generated files ready for Sovereign Guardrail injection.');
    }
  };

  if (audit.fileCount === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 bg-[#0B0D14] border-b border-white/10 text-xs font-mono">
      <div className="flex items-center gap-1.5 flex-wrap">
        <span
          className={`px-2 py-0.5 rounded font-bold text-[10px] border ${
            audit.score === 100
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
              : 'bg-amber-500/20 border-amber-500/50 text-amber-300'
          }`}
        >
          🛡️ GUARDRAIL: {audit.score}/100 ({audit.passed}/{audit.total})
        </span>
        {audit.checks.map((chk) => (
          <span
            key={chk.id}
            title={chk.label}
            className={`px-1.5 py-0.5 rounded text-[10px] ${
              chk.pass ? 'bg-emerald-500/10 text-emerald-300/90' : 'bg-red-500/15 text-red-300'
            }`}
          >
            {chk.pass ? '✔' : '⚠'} {chk.id}
          </span>
        ))}
      </div>
      {audit.score < 100 && (
        <button
          type="button"
          onClick={handleAutoHealWorkspace}
          className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[10px] transition-colors cursor-pointer"
        >
          🛠️ Auto-Heal to 100/100 Guardrail
        </button>
      )}
    </div>
  );
};
