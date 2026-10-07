export interface DesignScheme {
  palette: { [key: string]: string };
  features: string[];
  font: string[];
  framework?: string;
  uiLibrary?: string;
  animationLibrary?: string;
  commodities?: string[];
  typographyPairing?: string;
}

export const defaultDesignScheme: DesignScheme = {
  palette: {
    primary: '#D4AF37',
    secondary: '#00F0FF',
    accent: '#F5E6AB',
    background: '#08080B',
    surface: '#121218',
    text: '#FFFFFF',
    textSecondary: '#A3A3A3',
    border: '#2F2F2F',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  features: ['rounded'],
  font: ['syne', 'space-grotesk'],
  framework: 'vite-react',
  uiLibrary: 'shadcn-ui',
  animationLibrary: 'framer-motion',
  commodities: ['conic-border-beam', 'aurora-mesh-gradient'],
  typographyPairing: 'syne-space-grotesk',
};

export const paletteRoles = [
  {
    key: 'primary',
    label: 'Primary',
    description: 'Main brand color - use for primary buttons, active links, and key interactive elements',
  },
  {
    key: 'secondary',
    label: 'Secondary',
    description: 'Supporting brand color - use for secondary buttons, inactive states, and complementary elements',
  },
  {
    key: 'accent',
    label: 'Accent',
    description: 'Highlight color - use for badges, notifications, focus states, and call-to-action elements',
  },
  {
    key: 'background',
    label: 'Background',
    description: 'Page backdrop - use for the main application/website background behind all content',
  },
  {
    key: 'surface',
    label: 'Surface',
    description: 'Elevated content areas - use for cards, modals, dropdowns, and panels that sit above the background',
  },
  { key: 'text', label: 'Text', description: 'Primary text - use for headings, body text, and main readable content' },
  {
    key: 'textSecondary',
    label: 'Text Secondary',
    description: 'Muted text - use for captions, placeholders, timestamps, and less important information',
  },
  {
    key: 'border',
    label: 'Border',
    description: 'Separators - use for input borders, dividers, table lines, and element outlines',
  },
  {
    key: 'success',
    label: 'Success',
    description: 'Positive feedback - use for success messages, completed states, and positive indicators',
  },
  {
    key: 'warning',
    label: 'Warning',
    description: 'Caution alerts - use for warning messages, pending states, and attention-needed indicators',
  },
  {
    key: 'error',
    label: 'Error',
    description: 'Error states - use for error messages, failed states, and destructive action indicators',
  },
];

export const designFeatures = [
  { key: 'rounded', label: 'Rounded Corners' },
  { key: 'border', label: 'Subtle Border' },
  { key: 'gradient', label: 'Gradient Accent' },
  { key: 'shadow', label: 'Soft Shadow' },
  { key: 'frosted-glass', label: 'Frosted Glass' },
];

export const designFonts = [
  { key: 'sans-serif', label: 'Sans Serif', preview: 'Aa' },
  { key: 'serif', label: 'Serif', preview: 'Aa' },
  { key: 'monospace', label: 'Monospace', preview: 'Aa' },
  { key: 'cursive', label: 'Cursive', preview: 'Aa' },
  { key: 'fantasy', label: 'Fantasy', preview: 'Aa' },
];

export const curatedPaletteMaps: Record<string, { [key: string]: string }> = {
  'imperial-gold-obsidian': {
    primary: '#D4AF37',
    secondary: '#00F0FF',
    accent: '#F5E6AB',
    background: '#08080B',
    surface: '#121218',
    text: '#FFFFFF',
    textSecondary: '#A3A3A3',
    border: '#2F2F2F',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  'cyber-emerald-solana': {
    primary: '#14F195',
    secondary: '#9945FF',
    accent: '#00F0FF',
    background: '#090A0F',
    surface: '#13151F',
    text: '#FFFFFF',
    textSecondary: '#94A3B8',
    border: '#1E293B',
    success: '#14F195',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  'tokyo-night': {
    primary: '#7AA2F7',
    secondary: '#BB9AF7',
    accent: '#7DCFFF',
    background: '#1A1B26',
    surface: '#24283B',
    text: '#C0CAF5',
    textSecondary: '#787C99',
    border: '#414868',
    success: '#9ECE6A',
    warning: '#E0AF68',
    error: '#F7768E',
  },
  'nord-frost': {
    primary: '#88C0D0',
    secondary: '#81A1C1',
    accent: '#8FBCBB',
    background: '#2E3440',
    surface: '#3B4252',
    text: '#ECEFF4',
    textSecondary: '#D8DEE9',
    border: '#4C566A',
    success: '#A3BE8C',
    warning: '#EBCB8B',
    error: '#BF616A',
  },
  'dracula-pro': {
    primary: '#BD93F9',
    secondary: '#FF79C6',
    accent: '#8BE9FD',
    background: '#282A36',
    surface: '#44475A',
    text: '#F8F8F2',
    textSecondary: '#6272A4',
    border: '#6272A4',
    success: '#50FA7B',
    warning: '#F1FA8C',
    error: '#FF5555',
  },
  'catppuccin-mocha': {
    primary: '#CBA6F7',
    secondary: '#89B4FA',
    accent: '#F5C2E7',
    background: '#1E1E2E',
    surface: '#313244',
    text: '#CDD6F4',
    textSecondary: '#A6ADC8',
    border: '#45475A',
    success: '#A6E3A1',
    warning: '#F9E2AF',
    error: '#F38BA8',
  },
  'synthwave-84': {
    primary: '#FF7EDB',
    secondary: '#36F9F6',
    accent: '#FE4450',
    background: '#262335',
    surface: '#34294F',
    text: '#FDFDFD',
    textSecondary: '#848BBD',
    border: '#463465',
    success: '#72F1B8',
    warning: '#FFBE5C',
    error: '#FE4450',
  },
  'acid-lime-onyx': {
    primary: '#CCFF00',
    secondary: '#00F0FF',
    accent: '#E5FF80',
    background: '#111111',
    surface: '#1C1C1C',
    text: '#FFFFFF',
    textSecondary: '#9CA3AF',
    border: '#2E2E2E',
    success: '#CCFF00',
    warning: '#F59E0B',
    error: '#EF4444',
  },
};

export interface StudioPreset {
  id: string;
  name: string;
  description: string;
  scheme: Partial<DesignScheme>;
}

export const STUDIO_PRESETS: StudioPreset[] = [
  {
    id: 'zoth-avant-garde',
    name: 'Zoth Imperial Avant-Garde',
    description:
      'Vite React 19 + shadcn/ui + Framer Motion + Conic Beams + Syne / Space Grotesk + Imperial Gold & Obsidian',
    scheme: {
      framework: 'vite-react',
      uiLibrary: 'shadcn-ui',
      animationLibrary: 'framer-motion',
      typographyPairing: 'syne-space-grotesk',
      commodities: ['conic-border-beam', 'aurora-mesh-gradient', 'shimmer-gold-text'],
      palette: curatedPaletteMaps['imperial-gold-obsidian'],
      features: ['rounded', 'frosted-glass'],
    },
  },
  {
    id: 'astro-high-speed',
    name: 'Astro 5 Ultra-Speed',
    description: 'Astro 5 + Tailwind v4 + GSAP ScrollTrigger + Shimmer Gold + Cabinet / Satoshi + Tokyo Night',
    scheme: {
      framework: 'astro',
      uiLibrary: 'tailwind-v4',
      animationLibrary: 'gsap-scrolltrigger',
      typographyPairing: 'cabinet-satoshi',
      commodities: ['bento-grid', 'spotlight-reveal', 'shimmer-gold-text'],
      palette: curatedPaletteMaps['tokyo-night'],
      features: ['rounded', 'border'],
    },
  },
  {
    id: 'cyberpunk-solana',
    name: 'Cyberpunk Solana DePay',
    description:
      'Vite React 19 + Aceternity UI + Three.js + Frosted Glass Paywall + Unbounded / DM Sans + Cyber Emerald',
    scheme: {
      framework: 'vite-react',
      uiLibrary: 'aceternity-ui',
      animationLibrary: 'threejs',
      typographyPairing: 'unbounded-dm-sans',
      commodities: ['frosted-glass-paywall', 'dual-checkout-box', 'neon-cyber-glow'],
      palette: curatedPaletteMaps['cyber-emerald-solana'],
      features: ['rounded', 'frosted-glass', 'gradient'],
    },
  },
  {
    id: 'zero-build-pure-html',
    name: 'HTML5 + CSS3 + JS Zero-Build',
    description: 'Standalone HTML5 + Pure CSS + Canvas Confetti + Retro CRT + Space Grotesk / Inter + Acid Lime',
    scheme: {
      framework: 'html-css-js',
      uiLibrary: 'pure-css',
      animationLibrary: 'canvas-confetti',
      typographyPairing: 'space-grotesk-inter',
      commodities: ['retro-crt-scanlines', 'confetti-cannon-burst'],
      palette: curatedPaletteMaps['acid-lime-onyx'],
      features: ['border'],
    },
  },
  {
    id: 'fintech-telemetry',
    name: 'Fintech Telemetry Dashboard',
    description: 'Next.js App Router + Tremor + Motion One + Bento Grid + Plus Jakarta / JetBrains + Imperial Gold',
    scheme: {
      framework: 'nextjs-shadcn',
      uiLibrary: 'tremor',
      animationLibrary: 'motion-one',
      typographyPairing: 'jakarta-jetbrains',
      commodities: ['bento-grid', 'radar-sonar-rings', 'rolling-odometer-ticker'],
      palette: curatedPaletteMaps['imperial-gold-obsidian'],
      features: ['rounded', 'shadow'],
    },
  },
];
