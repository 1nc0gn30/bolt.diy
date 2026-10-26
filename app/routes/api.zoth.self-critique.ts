import { json, type ActionFunctionArgs } from '@remix-run/cloudflare';

interface CritiqueItem {
  id: string;
  category: 'Hierarchy' | 'Responsiveness' | 'Visual Craft' | 'Interactivity' | 'AEO & Conversion';
  label: string;
  passed: boolean;
  score: number;
  maxScore: number;
  fixDescription: string;
}

export function runDeterministicCritique(html: string) {
  const items: CritiqueItem[] = [
    {
      id: 'fluid-type',
      category: 'Hierarchy',
      label: 'Fluid clamp() Display Typography & Scale Contrast',
      passed: /clamp\(/i.test(html) || /font-size:\s*(2\.|3\.|4\.|[3-7][0-9]px)/i.test(html),
      score: /clamp\(/i.test(html) || /font-size:\s*(2\.|3\.|4\.|[3-7][0-9]px)/i.test(html) ? 20 : 10,
      maxScore: 20,
      fixDescription: 'Inject fluid clamp() typographic scale for H1/H2/H3 display hierarchy.',
    },
    {
      id: 'overflow-guard',
      category: 'Responsiveness',
      label: 'Zero Horizontal Overflow & Mobile Touch Targets',
      passed: /overflow-x:\s*hidden/i.test(html) && /@media/i.test(html),
      score: /overflow-x:\s*hidden/i.test(html) && /@media/i.test(html) ? 20 : 10,
      maxScore: 20,
      fixDescription: 'Enforce overflow-x: hidden, box-sizing: border-box, and responsive mobile media queries.',
    },
    {
      id: 'motion-svg',
      category: 'Visual Craft',
      label: '60fps Canvas Motion & Multi-Layer Vector SVG Art',
      passed: (/<canvas\b/i.test(html) || /requestAnimationFrame/i.test(html)) && /<svg\b/i.test(html),
      score: (/<canvas\b/i.test(html) || /requestAnimationFrame/i.test(html)) && /<svg\b/i.test(html) ? 20 : 12,
      maxScore: 20,
      fixDescription: 'Embed kinetic SVG ambient emblem and micro-interaction hover choreography.',
    },
    {
      id: 'real-utility',
      category: 'Interactivity',
      label: 'Real Client-Side Interactive Event Handlers (Zero Fake Work)',
      passed: /addEventListener|onclick=|oninput=|onchange=/i.test(html) && /<button\b/i.test(html),
      score: /addEventListener|onclick=|oninput=|onchange=/i.test(html) && /<button\b/i.test(html) ? 20 : 10,
      maxScore: 20,
      fixDescription: 'Verify interactive buttons, inputs, and live DOM state updates.',
    },
    {
      id: 'aeo-funnel',
      category: 'AEO & Conversion',
      label: 'Schema.org @graph JSON-LD + Sovereign Conversion Funnel',
      passed: /application\/ld\+json/i.test(html) && (/Stripe|Solana|DePay|licensed/i.test(html)),
      score: /application\/ld\+json/i.test(html) && (/Stripe|Solana|DePay|licensed/i.test(html)) ? 20 : 10,
      maxScore: 20,
      fixDescription: 'Inject Schema.org @graph (WebApplication + FAQPage) and Dual-Rail conversion bar.',
    },
  ];

  const totalScore = items.reduce((acc, item) => acc + item.score, 0);
  return {
    totalScore,
    maxScore: 100,
    grade: totalScore >= 95 ? 'S+ (Awwwards Ready)' : totalScore >= 85 ? 'A (Production)' : 'B (Needs Polish)',
    items,
  };
}

export function autoPolishHtml(html: string): string {
  let polished = html;

  const polishCss = `
  /* Zoth Bolt Design Director Auto-Polish Layer */
  *, *::before, *::after { box-sizing: border-box; }
  html, body { overflow-x: hidden; scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
  h1 { font-size: clamp(2.1rem, 4.5vw, 3.75rem); line-height: 1.08; letter-spacing: -0.025em; }
  h2 { font-size: clamp(1.5rem, 3vw, 2.35rem); line-height: 1.15; letter-spacing: -0.015em; }
  button, a, [role="button"] { transition: transform 0.18s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.18s ease, opacity 0.18s ease; }
  button:active, [role="button"]:active { transform: scale(0.98); }
  @media (max-width: 768px) {
    body { padding-left: 0; padding-right: 0; }
    button, a.btn { min-height: 44px; }
  }
  `;

  if (!/Zoth Bolt Design Director Auto-Polish Layer/i.test(polished)) {
    if (/<\/style>/i.test(polished)) {
      polished = polished.replace(/<\/style>/i, `${polishCss}\n</style>`);
    } else if (/<\/head>/i.test(polished)) {
      polished = polished.replace(/<\/head>/i, `<style>${polishCss}</style>\n</head>`);
    }
  }

  return polished;
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  const body = (await request.json().catch(() => ({}))) as { html?: string; autoPolish?: boolean };
  const rawHtml = body.html || '';
  const finalHtml = body.autoPolish ? autoPolishHtml(rawHtml) : rawHtml;
  const critique = runDeterministicCritique(finalHtml);

  return json(
    {
      ok: true,
      critique,
      polishedHtml: body.autoPolish ? finalHtml : undefined,
    },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
  );
}
