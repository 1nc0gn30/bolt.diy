import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from '@remix-run/cloudflare';

interface UrlBlueprintResult {
  ok: boolean;
  url: string;
  title: string;
  description: string;
  headings: string[];
  navItems: string[];
  colors: string[];
  fonts: string[];
  sectionCount: number;
  hasJsonLd: boolean;
  hasOgImage: boolean;
  synthesizedPrompt: string;
  error?: string;
}

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function extractBlueprint(url: string, html: string): UrlBlueprintResult {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const ogTitleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i);
  const title = stripTags(titleMatch?.[1] || ogTitleMatch?.[1] || url);

  const descMatch =
    html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i);
  const description = stripTags(descMatch?.[1] || 'High-converting digital platform and interactive web application.');

  const headingMatches = Array.from(html.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi));
  const headings = Array.from(
    new Set(
      headingMatches
        .map((m) => stripTags(m[1]))
        .filter((t) => t.length > 2 && t.length < 110),
    ),
  ).slice(0, 10);

  const navBlock = html.match(/<nav[\s\S]*?<\/nav>/i)?.[0] || html.match(/<header[\s\S]*?<\/header>/i)?.[0] || '';
  const navLinks = Array.from(navBlock.matchAll(/<a[^>]*>([\s\S]*?)<\/a>/gi));
  const navItems = Array.from(
    new Set(
      navLinks
        .map((m) => stripTags(m[1]))
        .filter((t) => t.length > 1 && t.length < 28),
    ),
  ).slice(0, 7);

  const hexMatches = Array.from(html.matchAll(/#([0-9a-fA-F]{6})\b/g)).map((m) => `#${m[1].toUpperCase()}`);
  const ignoredHex = new Set(['#FFFFFF', '#000000', '#111111', '#222222', '#333333', '#EEEEEE', '#CCCCCC']);
  const colors = Array.from(new Set(hexMatches.filter((c) => !ignoredHex.has(c)))).slice(0, 6);
  if (colors.length === 0) {
    colors.push('#D4AF37', '#38BDF8', '#10B981');
  }

  const fontMatches = Array.from(
    html.matchAll(/family=([A-Za-z0-9+:_-]+)|font-family:\s*['"]?([A-Za-z0-9\s-]+)['"]?/gi),
  );
  const fonts = Array.from(
    new Set(
      fontMatches
        .map((m) => (m[1] || m[2] || '').replace(/\+/g, ' ').split(':')[0].trim())
        .filter((f) => f.length > 2 && f.length < 32 && !/sans-serif|monospace|serif|inherit|system-ui/i.test(f)),
    ),
  ).slice(0, 4);

  const sectionCount = Math.max(
    1,
    (html.match(/<section\b/gi) || []).length + (html.match(/<article\b/gi) || []).length,
  );
  const hasJsonLd = /application\/ld\+json/i.test(html);
  const hasOgImage = /property=["']og:image["']/i.test(html);

  const synthesizedPrompt = [
    `Re-architect and elevate "${title}" (source reference: ${url}) into an Awwwards-grade, high-converting full-stack web experience in Zoth Bolt.`,
    `Core Value Proposition: ${description}`,
    headings.length > 0 ? `Preserve & upgrade key content pillars: ${headings.slice(0, 6).join(' • ')}.` : '',
    navItems.length > 0 ? `Navigation architecture: ${navItems.join(', ')}.` : '',
    `Visual & Motion Direction: Use accent palette [${colors.join(', ')}] on obsidian #08080B, display typography (${fonts[0] || 'Syne'} + Space Grotesk + JetBrains Mono), a 60fps HTML5 Canvas kinetic shader hero, bespoke multi-layered SVG artwork (zero stock placeholders), interactive real-time calculator/workspace, and full Schema.org @graph JSON-LD + OpenGraph metadata.`,
  ]
    .filter(Boolean)
    .join('\n');

  return {
    ok: true,
    url,
    title,
    description,
    headings,
    navItems,
    colors,
    fonts,
    sectionCount,
    hasJsonLd,
    hasOgImage,
    synthesizedPrompt,
  };
}

async function handleUrlBlueprint(rawUrl: string): Promise<UrlBlueprintResult> {
  const targetUrl = rawUrl.trim().startsWith('http') ? rawUrl.trim() : `https://${rawUrl.trim()}`;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6500);
    const res = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'ZothBolt-Architect/3.0 (+https://zoth.nullai.tech)',
        Accept: 'text/html,application/xhtml+xml',
      },
    });
    clearTimeout(timer);

    const html = await res.text();
    return extractBlueprint(targetUrl, html);
  } catch (err: any) {
    return {
      ok: false,
      url: targetUrl,
      title: targetUrl.replace(/^https?:\/\//, '').split('/')[0],
      description: 'Autonomous redesign blueprint synthesized from domain archetype.',
      headings: ['Hero Value Proposition', 'Interactive Product Workspace', 'Bento Capability Matrix', 'Transparent Pricing & FAQ'],
      navItems: ['Product', 'Interactive Demo', 'Architecture', 'Pricing', 'FAQ'],
      colors: ['#D4AF37', '#38BDF8', '#10B981'],
      fonts: ['Syne', 'Space Grotesk', 'JetBrains Mono'],
      sectionCount: 5,
      hasJsonLd: false,
      hasOgImage: false,
      synthesizedPrompt: `Re-architect ${targetUrl} into an Awwwards-grade full-stack web application featuring a 60fps kinetic canvas hero, bespoke multi-layered SVG illustrations, an interactive client-side utility workspace, Bento feature grid, and full Schema.org @graph JSON-LD.`,
      error: err?.message || 'Target blocked direct fetch; generated fallback domain blueprint.',
    };
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  const urlObj = new URL(request.url);
  const target = urlObj.searchParams.get('url') || 'https://zoth.nullai.tech';
  const result = await handleUrlBlueprint(target);
  return json(result, {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  const body = (await request.json().catch(() => ({}))) as { url?: string };
  const target = body.url || 'https://zoth.nullai.tech';
  const result = await handleUrlBlueprint(target);
  return json(result, {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
}
