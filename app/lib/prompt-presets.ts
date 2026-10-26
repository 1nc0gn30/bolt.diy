export type PromptPresetGroup =
  | 'framework'
  | 'visual'
  | 'motion'
  | 'layout'
  | 'feature'
  | 'commerce'
  | 'zoth'
  | 'copy';

export interface PromptPreset {
  id: string;
  label: string;
  group: PromptPresetGroup;
  badge?: string;
  prompt: string;
}

export const PRESET_GROUPS: { id: PromptPresetGroup; label: string }[] = [
  { id: 'framework', label: 'Architecture' },
  { id: 'visual', label: 'Visual' },
  { id: 'motion', label: 'Motion' },
  { id: 'layout', label: 'Layout' },
  { id: 'feature', label: 'Features' },
  { id: 'commerce', label: 'Commerce' },
  { id: 'zoth', label: 'Zoth OS / Studio' },
  { id: 'copy', label: 'Copy & SEO' },
];

export const PROMPT_PRESETS: PromptPreset[] = [
  {
    id: 'fw-vite-react',
    label: 'Vite + React 19',
    group: 'framework',
    badge: 'HMR',
    prompt: 'Scaffold Vite + React 19 + TypeScript + Tailwind. Write package.json, vite.config, index.html, and src yourself. No interactive create commands.',
  },
  {
    id: 'fw-html',
    label: 'HTML5 static',
    group: 'framework',
    badge: 'Zero-build',
    prompt: 'Ship a zero-build static site: semantic HTML5, one CSS file, one JS module. No bundler, no React.',
  },
  {
    id: 'fw-astro',
    label: 'Astro 5 islands',
    group: 'framework',
    badge: '0-JS',
    prompt: 'Use Astro 5 with component islands, Tailwind, and content collections. Default to zero client JS.',
  },
  {
    id: 'fw-next',
    label: 'Next.js App Router',
    group: 'framework',
    prompt: 'Use Next.js App Router with TypeScript, Tailwind, and shadcn/ui. Keep routes as real files.',
  },
  {
    id: 'fw-vanilla',
    label: 'Vanilla ESM',
    group: 'framework',
    prompt: 'Use Vite + vanilla ES modules. No React, no Vue. Modular DOM code only.',
  },
  {
    id: 'fw-svelte',
    label: 'SvelteKit',
    group: 'framework',
    prompt: 'Use SvelteKit with TypeScript and Tailwind. Keep pages as real +page files.',
  },
  {
    id: 'vis-gold-foundry',
    label: 'Zoth gold foundry',
    group: 'visual',
    badge: '#D4AF37',
    prompt: 'Use Zoth foundry tokens: background #08080B, surface #121218, accent #D4AF37, text white. Space Grotesk display, Inter body. One gold accent, no extra palette.',
  },
  {
    id: 'vis-obsidian-glass',
    label: 'Obsidian glass',
    group: 'visual',
    prompt: 'Dark glassmorphic panels, 1px white/10 borders, blur-md, no purple blobs, no neon soup.',
  },
  {
    id: 'vis-editorial',
    label: 'Editorial luxury',
    group: 'visual',
    prompt: 'Editorial layout: generous whitespace, serif display + sans body, long measure 60ch, restrained ink, no cards-on-cards.',
  },
  {
    id: 'vis-brutalist',
    label: 'Sharp brutalist',
    group: 'visual',
    prompt: 'Brutalist: hard edges, high contrast, mono labels, thick rules, no rounded-2xl, no soft shadows.',
  },
  {
    id: 'vis-print',
    label: 'Print poster',
    group: 'visual',
    prompt: 'Print-poster type: oversized headlines, tight tracking on labels, ink-on-paper feel, one photograph max.',
  },
  {
    id: 'vis-tokyo',
    label: 'Tokyo night',
    group: 'visual',
    prompt: 'Tokyo-night surfaces: deep navy, cyan hairline, dense data, no kawaii stickers.',
  },
  {
    id: 'vis-paper',
    label: 'Warm paper',
    group: 'visual',
    prompt: 'Warm paper light mode: cream ground, charcoal type, one rust accent, tactile borders.',
  },
  {
    id: 'vis-crt',
    label: 'CRT scan',
    group: 'visual',
    prompt: 'Subtle CRT scanlines on a terminal HUD only. Do not wash the whole page in scanlines.',
  },
  {
    id: 'mot-css-only',
    label: 'CSS only',
    group: 'motion',
    prompt: 'Motion is CSS only: transform and opacity, under 400ms, respect prefers-reduced-motion. No GSAP, no canvas.',
  },
  {
    id: 'mot-framer',
    label: 'Framer Motion',
    group: 'motion',
    prompt: 'Use Framer Motion for entrance and page handoff. Stagger 40–80ms. Never hide content behind in-view opacity 0 without a fallback.',
  },
  {
    id: 'mot-gsap',
    label: 'GSAP scroll',
    group: 'motion',
    prompt: 'Use GSAP ScrollTrigger for one pinned section. Keep the rest of the page still.',
  },
  {
    id: 'mot-canvas',
    label: 'Kinetic canvas',
    group: 'motion',
    prompt: 'One kinetic canvas in the hero, pause when offscreen, never trap pointer events on copy.',
  },
  {
    id: 'mot-none',
    label: 'Still',
    group: 'motion',
    prompt: 'No animation except button hover. The page must read as a finished print.',
  },
  {
    id: 'lay-bento',
    label: 'Bento grid',
    group: 'layout',
    prompt: 'Use a bento grid for the feature band. Uneven cells, one dominant tile, no equal 3x3.',
  },
  {
    id: 'lay-split',
    label: 'Split hero',
    group: 'layout',
    prompt: 'Split hero: type on the left, product or preview on the right. Stack at 768px.',
  },
  {
    id: 'lay-sidebar',
    label: 'App shell',
    group: 'layout',
    prompt: 'App shell: left nav, main canvas, optional inspector. Keyboard-focusable nav.',
  },
  {
    id: 'lay-magazine',
    label: 'Magazine',
    group: 'layout',
    prompt: 'Magazine: masthead, 12-col grid, pull quotes, one full-bleed image per chapter.',
  },
  {
    id: 'lay-dashboard',
    label: 'Telemetry dash',
    group: 'layout',
    prompt: 'Telemetry dashboard with real in-browser stats, not fake 99.99% numbers.',
  },
  {
    id: 'lay-mobile-first',
    label: '390px first',
    group: 'layout',
    prompt: 'Design at 390px first. No horizontal scroll. Dividers sit between sections, never through type.',
  },
  {
    id: 'feat-contact',
    label: 'Contact form',
    group: 'feature',
    prompt: 'One contact form is the contact line. Do not also print Name/Phone/Email as static labels beside it.',
  },
  {
    id: 'feat-nav-views',
    label: 'Two views',
    group: 'feature',
    prompt: 'Two complete views reachable from the nav. Every hero button scrolls or routes to a real section.',
  },
  {
    id: 'feat-md',
    label: 'Markdown blog',
    group: 'feature',
    prompt: 'Include a markdown-driven journal or docs index with at least two real posts.',
  },
  {
    id: 'feat-search',
    label: 'Client search',
    group: 'feature',
    prompt: 'In-browser search over the page content. Empty and no-result states included.',
  },
  {
    id: 'feat-theme',
    label: 'Theme toggle',
    group: 'feature',
    prompt: 'Light/dark toggle persisted in localStorage. Every color has both values.',
  },
  {
    id: 'feat-auth-ui',
    label: 'Auth screens',
    group: 'feature',
    prompt: 'Sign-in and sign-up screens with working client validation. No fake backend.',
  },
  {
    id: 'feat-table',
    label: 'Filter table',
    group: 'feature',
    prompt: 'A filterable, sortable table with real sample rows, not Lorem.',
  },
  {
    id: 'feat-chat',
    label: 'In-app chat',
    group: 'feature',
    prompt: 'A working in-app chat pane with local state. No unpaid cloud API.',
  },
  {
    id: 'feat-map',
    label: 'Local map',
    group: 'feature',
    prompt: 'A simple SVG or canvas map of a real place the user named. No invented shop.',
  },
  {
    id: 'com-stripe-ui',
    label: 'Stripe checkout UI',
    group: 'commerce',
    prompt: 'Checkout UI only: price the user named, Stripe-styled pay button. Do not invent a second price or a founding banner.',
  },
  {
    id: 'com-solana',
    label: 'Solana DePay UI',
    group: 'commerce',
    prompt: 'Add a Solana DePay-styled pay control next to the card button only if a price was asked.',
  },
  {
    id: 'com-pricing',
    label: 'Three-tier pricing',
    group: 'commerce',
    prompt: 'Three-tier pricing with the prices the user gave. No fake discounts, no countdown.',
  },
  {
    id: 'com-cart',
    label: 'Cart drawer',
    group: 'commerce',
    prompt: 'Cart drawer with add/remove and a running total, all in client state.',
  },
  {
    id: 'zoth-studio-tokens',
    label: 'Studio tokens',
    group: 'zoth',
    badge: 'Studio',
    prompt: 'Match Zoth Studio: gold #D4AF37, Space Grotesk + Inter, mono eyebrows with 0.2em tracking, MotionReveal-style short fades.',
  },
  {
    id: 'zoth-os-strip',
    label: 'OS control strip',
    group: 'zoth',
    badge: 'OS',
    prompt: 'Add a footer control strip linking to Zoth Studio (localhost:3000), Zoth Civilization (localhost:9393), and this WebGen foundry. Honest labels, no fake uptime.',
  },
  {
    id: 'zoth-agent-hud',
    label: 'Agent HUD',
    group: 'zoth',
    prompt: 'Include an agent HUD: model name, token tick, and a log well. Use the same gold foundry chrome as WebGen.',
  },
  {
    id: 'zoth-soul-panel',
    label: 'Soul / memory pane',
    group: 'zoth',
    prompt: 'Add a Soul and Memory pane: two columns of markdown the user can edit locally. Persist in localStorage.',
  },
  {
    id: 'zoth-promptmaster',
    label: 'PromptMaster sister',
    group: 'zoth',
    prompt: 'If a tools page exists, list PromptMaster Studio as a sister product at https://promptmaster-studio.netlify.app with no invented price.',
  },
  {
    id: 'zoth-agy',
    label: 'AGY note',
    group: 'zoth',
    prompt: 'In the about or footer, name AGY (Antigravity CLI) and Grok CLI as local agents on Zoth OS. Do not fake a live socket.',
  },
  {
    id: 'zoth-memory-link',
    label: 'Memory link',
    group: 'zoth',
    badge: '8094',
    prompt: 'If a tools or footer strip exists, link Zoth Memory at http://127.0.0.1:8094/#everywhere. Label it Memory. Do not invent stored notes.',
  },
  {
    id: 'zoth-os-site',
    label: 'OS product site',
    group: 'zoth',
    badge: 'v3.2',
    prompt: 'If you mention Zoth OS, link https://zothos.nullai.tech and the v3.2.0 ISO. Live users are zoth, azoth, and root. Password zoth. Do not say the live user is neo.',
  },
  {
    id: 'zoth-studio-cta',
    label: 'Studio CTA',
    group: 'zoth',
    prompt: 'Primary product CTA for Zoth OS is https://zothos.nullai.tech. Companion studio is https://zoth.nullai.tech. Do not invent a second Product Hunt listing.',
  },
  {
    id: 'zoth-no-paywall',
    label: 'No fake paywall',
    group: 'zoth',
    prompt: 'Do not add Unlock Pro, $19 lifetime, or SOL paywall chrome. This foundry is not a paid bolt clone.',
  },
  {
    id: 'feat-llms-txt',
    label: 'llms.txt',
    group: 'feature',
    prompt: 'Add a public /llms.txt that states what the site is, who it is for, and the live URLs. No invented metrics.',
  },
  {
    id: 'feat-a11y',
    label: 'A11y pass',
    group: 'feature',
    prompt: 'Keyboard focus-visible rings, labels on every input, skip link, contrast 4.5:1 on body text.',
  },
  {
    id: 'mot-aperture',
    label: 'Aperture intro',
    group: 'motion',
    prompt: 'Optional 800ms aperture-style intro that does not trap the user. Honor prefers-reduced-motion. Skip control always visible.',
  },
  {
    id: 'copy-llms',
    label: 'llms copy',
    group: 'copy',
    prompt: 'Write an llms.txt in plain operator English. Name the product, the local ports, and what it will not do.',
  },
  {
    id: 'copy-aeo',
    label: 'AEO / FAQ',
    group: 'copy',
    prompt: 'Add an FAQ with real questions and answers for answer engines. No lorem. JSON-LD FAQPage if it is a public site.',
  },
  {
    id: 'copy-honest',
    label: 'Honest copy',
    group: 'copy',
    prompt: 'Headlines say what it does in eight words or fewer. Buttons are verbs. No invented reviews, rankings, or staff photos.',
  },
  {
    id: 'copy-docs',
    label: 'Docs tone',
    group: 'copy',
    prompt: 'Write in operator docs tone: short sentences, numbered steps, no marketing adjectives.',
  },
  {
    id: 'copy-local',
    label: 'Local business',
    group: 'copy',
    prompt: 'Local business site: use only facts the user supplied. Do not invent an address, phone, hours, or review.',
  },
];

export const STACK_MARKER = '[Zoth stack]';

export function applyPresetStack(input: string, stacked: PromptPreset[]): string {
  const userPart = input.split(`\n\n${STACK_MARKER}\n`)[0].replace(/\s+$/, '');

  if (stacked.length === 0) {
    return userPart;
  }

  const block = stacked.map((preset) => `- ${preset.prompt}`).join('\n');

  return `${userPart}${userPart ? '\n\n' : ''}${STACK_MARKER}\n${block}`;
}

export function parseStackedIds(raw: string | null): string[] {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
}
