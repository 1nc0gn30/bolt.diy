/**
 * Zoth Curated Media Packs & Asset Collections
 * Production-ready high-resolution photography, vector illustrations,
 * Web Audio sound synthesis primitives, and industry asset packs.
 *
 * Creator: Neal Frazier Tech (@1nc0gn30) • NullAI Platform
 */

export interface CuratedMediaAsset {
  id: string;
  category: 'photography' | 'illustration' | 'icon-pack' | 'audio-sfx' | '3d-asset';
  industry: 'saas' | 'luxury' | 'trades' | 'fintech' | 'editorial' | 'automotive' | 'medical' | 'general';
  title: string;
  url: string;
  thumbnailUrl?: string;
  alt: string;
  aspectRatio: '16:9' | '4:3' | '1:1' | '9:16';
  credit: string;
  tags: string[];
}

export interface SoundEffectDefinition {
  id: string;
  name: string;
  description: string;
  category: 'click' | 'chime' | 'swoosh' | 'terminal' | 'alert';
  implementationCode: string;
}

/*
 * ==========================================================================
 * 1. Curated High-Resolution Photography Packs (Unsplash Verified CDNs)
 * ==========================================================================
 */
export const CURATED_PHOTOGRAPHY_PACKS: CuratedMediaAsset[] = [
  // Luxury & Architecture
  {
    id: 'arch-luxury-villa-1',
    category: 'photography',
    industry: 'luxury',
    title: 'Minimalist Architectural Concrete Villa',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    alt: 'Modern minimalist luxury concrete villa at dusk with warm ambient lighting',
    aspectRatio: '16:9',
    credit: 'Unsplash Architectural Photography',
    tags: ['architecture', 'luxury', 'modern', 'concrete', 'villa'],
  },
  {
    id: 'arch-interior-gallery-2',
    category: 'photography',
    industry: 'luxury',
    title: 'Monolithic Art Gallery Interior',
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
    alt: 'Sculptural luxury interior living space with travertine stone and curated furniture',
    aspectRatio: '16:9',
    credit: 'Unsplash Interior Collection',
    tags: ['interior', 'minimalist', 'stone', 'gallery'],
  },
  {
    id: 'arch-glass-facade-3',
    category: 'photography',
    industry: 'luxury',
    title: 'Geometric Dark Glass Facade',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80',
    alt: 'Dark architectural glass facade with geometric mullions and sharp perspective angles',
    aspectRatio: '16:9',
    credit: 'Unsplash Commercial Architecture',
    tags: ['facade', 'glass', 'dark', 'geometry'],
  },

  // Developer & Sovereign SaaS
  {
    id: 'saas-dark-workstation-1',
    category: 'photography',
    industry: 'saas',
    title: 'Stealth Developer Command Cockpit',
    url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80',
    alt: 'Minimalist dark engineering workstation with mechanical keyboard and glowing terminal screens',
    aspectRatio: '16:9',
    credit: 'Unsplash Tech Collection',
    tags: ['developer', 'workspace', 'cyberpunk', 'dark-mode'],
  },
  {
    id: 'saas-network-nodes-2',
    category: 'photography',
    industry: 'saas',
    title: 'Cryptographic Abstract Network Mesh',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80',
    alt: 'Abstract illuminated digital network nodes traversing dark space',
    aspectRatio: '16:9',
    credit: 'Unsplash Creative Technology',
    tags: ['network', 'data', 'mesh', 'ai', 'cloud'],
  },
  {
    id: 'saas-server-rack-3',
    category: 'photography',
    industry: 'saas',
    title: 'High-Density Datacenter Telemetry Lights',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80',
    alt: 'Precision enterprise server racks with pulsing optical fiber indicators',
    aspectRatio: '16:9',
    credit: 'Unsplash Datacenter Systems',
    tags: ['datacenter', 'servers', 'infrastructure', 'cloud'],
  },

  // Trade Services & Craftsmanship (Painters, Contractors, Builders)
  {
    id: 'trades-fine-finish-painting-1',
    category: 'photography',
    industry: 'trades',
    title: 'Precision Interior Fine Finish Painting',
    url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1600&q=80',
    alt: 'Professional craftsman applying sharp edge lines with blue painter tape on smooth wall',
    aspectRatio: '16:9',
    credit: 'Unsplash Craftsmanship Collection',
    tags: ['painter', 'interior', 'craftsman', 'clean', 'edges'],
  },
  {
    id: 'trades-architectural-coatings-2',
    category: 'photography',
    industry: 'trades',
    title: 'Architectural Exterior Modern Residence',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80',
    alt: 'Flawlessly coated modern home exterior showing crisp trim work and clean siding',
    aspectRatio: '16:9',
    credit: 'Unsplash Construction Crafts',
    tags: ['exterior', 'modern-home', 'clean-lines', 'siding'],
  },
  {
    id: 'trades-hands-craftsman-3',
    category: 'photography',
    industry: 'trades',
    title: 'Detail Brushwork and Surface Prep',
    url: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1600&q=80',
    alt: 'Close-up of craftsman hand holding professional angle sash brush cutting a clean ceiling line',
    aspectRatio: '4:3',
    credit: 'Unsplash Professional Trades',
    tags: ['brushwork', 'detail', 'prep', 'craft'],
  },

  // Fintech & Web3
  {
    id: 'fintech-solana-abstract-1',
    category: 'photography',
    industry: 'fintech',
    title: 'Bioluminescent Neon Cyber Grid',
    url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1600&q=80',
    alt: '3D iridescent emerald and cyan blockchain grid in zero-gravity space',
    aspectRatio: '16:9',
    credit: 'Unsplash Crypto 3D Graphics',
    tags: ['crypto', 'web3', 'solana', 'blockchain', 'neon'],
  },
  {
    id: 'fintech-metallic-sheen-2',
    category: 'photography',
    industry: 'fintech',
    title: 'Brushed Titanium Card Surface',
    url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1600&q=80',
    alt: 'Luxury brushed titanium card resting on dark slate surface with subtle metallic reflection',
    aspectRatio: '16:9',
    credit: 'Unsplash Fintech Luxury',
    tags: ['card', 'fintech', 'titanium', 'payments'],
  },

  // Automotive & Detailing
  {
    id: 'auto-supercar-beading-1',
    category: 'photography',
    industry: 'automotive',
    title: 'Hydrophobic Ceramic Coating Water Beading',
    url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=80',
    alt: 'Microscopic spherical water beads rolling off high-gloss black ceramic coated sports car hood',
    aspectRatio: '16:9',
    credit: 'Unsplash Automotive Detail',
    tags: ['detailing', 'supercar', 'ceramic', 'hydrophobic', 'gloss'],
  },
  {
    id: 'auto-stealth-coupe-2',
    category: 'photography',
    industry: 'automotive',
    title: 'Satin Dark Exotic GT in Studio Lighting',
    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80',
    alt: 'Satin black exotic sports car illuminated by overhead strip studio lights',
    aspectRatio: '16:9',
    credit: 'Unsplash Exotic Motors',
    tags: ['automotive', 'exotic', 'studio', 'satin-black'],
  },

  // Medical & Biotechnology
  {
    id: 'medical-surgical-suite-1',
    category: 'photography',
    industry: 'medical',
    title: 'State-of-the-Art Minimalist Medical Suite',
    url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=80',
    alt: 'Clean minimalist medical examination room with ambient sapphire lighting and warm natural wood accents',
    aspectRatio: '16:9',
    credit: 'Unsplash Clinical Healthcare',
    tags: ['medical', 'clinic', 'modern', 'surgical', 'healthcare'],
  },
  {
    id: 'medical-dna-lattice-2',
    category: 'photography',
    industry: 'medical',
    title: 'Molecular Biotechnology Lattice',
    url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1600&q=80',
    alt: 'High-magnification biochemical research glassware with refraction patterns',
    aspectRatio: '16:9',
    credit: 'Unsplash Biotech Research',
    tags: ['biotech', 'research', 'laboratory', 'science'],
  },

  // Creative & Editorial
  {
    id: 'editorial-fashion-silhouette-1',
    category: 'photography',
    industry: 'editorial',
    title: 'High-Fashion Dramatic Silhouette',
    url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=80',
    alt: 'Striking high-fashion model silhouette with golden rim lighting against deep black background',
    aspectRatio: '4:3',
    credit: 'Unsplash Fashion Editorial',
    tags: ['fashion', 'editorial', 'silhouette', 'rim-light'],
  },
  {
    id: 'editorial-minimal-sculpture-2',
    category: 'photography',
    industry: 'editorial',
    title: 'Brutalist Travertine Monolith',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80',
    alt: 'Monolithic geometric stone sculpture casting crisp diagonal shadows on pure concrete',
    aspectRatio: '16:9',
    credit: 'Unsplash Fine Art',
    tags: ['editorial', 'monolith', 'stone', 'shadows'],
  },
];

/*
 * ==========================================================================
 * 2. Web Audio API Synthetic SFX Primitives (Zero External Dependencies)
 * ==========================================================================
 */
export const SYNTHETIC_SFX_COLLECTION: SoundEffectDefinition[] = [
  {
    id: 'tactile-click',
    name: 'Mechanical Tactile Click',
    description: 'Crisp, subtle button click sound synthesized with a rapid 800Hz to 180Hz sine drop in 40ms.',
    category: 'click',
    implementationCode: `
export function playTactileClick() {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {}
}
    `.trim(),
  },
  {
    id: 'harmonic-success-chime',
    name: 'Triad Success Chime',
    description: 'Elegantly voiced major triad (C-E-G or D-F#-A) with gentle bell harmonics and warm decay.',
    category: 'chime',
    implementationCode: `
export function playSuccessChime() {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.06);
      gain.gain.setValueAtTime(0.05, ctx.currentTime + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.06 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.06);
      osc.stop(ctx.currentTime + i * 0.06 + 0.35);
    });
  } catch {}
}
    `.trim(),
  },
  {
    id: 'aperture-swoosh',
    name: 'Aperture Shutter Swoosh',
    description: 'Smooth filtered pink-noise sweep denoting page load transitions or modal openings.',
    category: 'swoosh',
    implementationCode: `
export function playApertureSwoosh() {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const bufferSize = ctx.sampleRate * 0.2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.08));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 0.15);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  } catch {}
}
    `.trim(),
  },
  {
    id: 'terminal-keystroke',
    name: 'Phosphor CRT Terminal Keystroke',
    description: 'Vintage 1400Hz micro-click for typewriter simulations, code reveals, and CLI inputs.',
    category: 'terminal',
    implementationCode: `
export function playTerminalKeystroke() {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1400, ctx.currentTime);
    gain.gain.setValueAtTime(0.02, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.015);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.015);
  } catch {}
}
    `.trim(),
  },
];

// Live Callable Web Audio Synthesizer Functions
export function playTactileClick() {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const audioContextClass = window.AudioContext || (window as any).webkitAudioContext;

    if (!audioContextClass) {
      return;
    }

    const ctx = new audioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {}
}

export function playSuccessChime() {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const audioContextClass = window.AudioContext || (window as any).webkitAudioContext;

    if (!audioContextClass) {
      return;
    }

    const ctx = new audioContextClass();
    const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.06);
      gain.gain.setValueAtTime(0.04, ctx.currentTime + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.06 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.06);
      osc.stop(ctx.currentTime + i * 0.06 + 0.35);
    });
  } catch {}
}

export function playApertureSwoosh() {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const audioContextClass = window.AudioContext || (window as any).webkitAudioContext;

    if (!audioContextClass) {
      return;
    }

    const ctx = new audioContextClass();
    const bufferSize = ctx.sampleRate * 0.18;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.08));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 0.14);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  } catch {}
}

export function playTerminalKeystroke() {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const audioContextClass = window.AudioContext || (window as any).webkitAudioContext;

    if (!audioContextClass) {
      return;
    }

    const ctx = new audioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1400, ctx.currentTime);
    gain.gain.setValueAtTime(0.02, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.015);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.015);
  } catch {}
}

/*
 * ==========================================================================
 * 3. Curated Vector Illustration Libraries & Icon Suites
 * ==========================================================================
 */
export const VECTOR_AND_ICON_LIBRARIES = [
  {
    id: 'lucide-react',
    name: 'Lucide React Icons',
    badge: 'Industry Standard',
    description:
      'Pixel-perfect, lightweight, tree-shakeable icons for modern interfaces with stroke-width customization.',
    importSnippet: "import { ArrowRight, Sparkles, Terminal, Shield, Check } from 'lucide-react';",
  },
  {
    id: 'phosphor-icons',
    name: 'Phosphor React Icons',
    badge: '6 Flexible Weights',
    description:
      'Comprehensive icon suite designed for editorial elegance with thin, light, regular, bold, fill, and duotone weights.',
    importSnippet: "import { Lightning, Compass, Cube, CaretRight } from '@phosphor-icons/react';",
  },
  {
    id: 'undraw-svg',
    name: 'unDraw Vector Illustrations',
    badge: 'Color-Adaptive SVG',
    description: 'Open-source SVG illustrations with customizable primary color hex matching your design scheme.',
    cdnPattern: 'https://undraw.co/api/illustrations (Direct inline SVG components)',
  },
  {
    id: 'shapefest-3d',
    name: 'Shapefest 3D Geometry',
    badge: 'Tactile 3D Assets',
    description: 'High-res transparent PNGs and GLTF models of clay, glass, chrome, and matte geometric shapes.',
    cdnPattern: '3D clay icons for cards, hero badges, and pricing tiers',
  },
  {
    id: 'iconify-universal',
    name: 'Iconify 200k+ Free Vector & Pixel-Art API',
    badge: '200,000+ Free SVGs',
    description: 'Instant zero-auth REST API for Lucide, Phosphor, Pixelarticons, Game-Icons, Tabler, and Simple-Icons.',
    cdnPattern: 'https://api.iconify.design/pixelarticons/zap.svg?color=%23D4AF37',
  },
  {
    id: 'dicebear-pixel-avatars',
    name: 'DiceBear Free Pixel-Art & Bottts SVGs',
    badge: 'Procedural SVGs',
    description: 'Deterministic free SVG pixel-art characters, retro avatars, and robot emblems via URL seed.',
    cdnPattern: 'https://api.dicebear.com/9.x/pixel-art/svg?seed=ZothBolt',
  },
];

/*
 * ==========================================================================
 * 4. 16-Bit Pixel Art Inline SVG Icon Library (Crisp Edges, Zero Dependencies)
 * ==========================================================================
 */
export interface PixelArtIconAsset {
  id: string;
  name: string;
  category: 'arcade' | 'rpg' | 'cyber' | 'commerce' | 'status';
  accent: string;
  svg: string;
}

export const PIXEL_ART_ICONS: PixelArtIconAsset[] = [
  {
    id: 'pixel-bolt',
    name: 'Zoth Golden Lightning Bolt',
    category: 'cyber',
    accent: '#D4AF37',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="32" height="32" shape-rendering="crispEdges"><path fill="#F5E6AB" d="M9 1h3v2H10v2H9v2h4v2h-2v2H9v2H7v2H5v-3h2V9H4V7h2V5h2V3h1z"/><path fill="#D4AF37" d="M8 2h2v2H8v2H6v2h4v1H8v2H6v3H5v-2h2v-2H3V8h2V6h2V4h1z"/></svg>`,
  },
  {
    id: 'pixel-crown',
    name: 'Sovereign 24K Pixel Crown',
    category: 'rpg',
    accent: '#F59E0B',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="32" height="32" shape-rendering="crispEdges"><path fill="#D4AF37" d="M2 5h2v2h2V5h1V3h2v2h1v2h2V5h2v7H2V5z"/><path fill="#F5E6AB" d="M3 6h1v3h8V6h1v4H3V6zm4-2h2v3H7V4z"/><rect x="4" y="10" width="2" height="1" fill="#EF4444"/><rect x="7" y="10" width="2" height="1" fill="#10B981"/><rect x="10" y="10" width="2" height="1" fill="#3B82F6"/><rect x="2" y="12" width="12" height="2" fill="#8C6D1F"/></svg>`,
  },
  {
    id: 'pixel-robot',
    name: 'Autonomous Swarm Droid',
    category: 'cyber',
    accent: '#38BDF8',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="32" height="32" shape-rendering="crispEdges"><rect x="7" y="1" width="2" height="2" fill="#D4AF37"/><rect x="3" y="3" width="10" height="8" fill="#1E293B"/><rect x="4" y="4" width="8" height="6" fill="#0F172A"/><rect x="5" y="5" width="2" height="2" fill="#38BDF8"/><rect x="9" y="5" width="2" height="2" fill="#38BDF8"/><rect x="5" y="8" width="6" height="1" fill="#10B981"/><rect x="2" y="5" width="1" height="4" fill="#64748B"/><rect x="13" y="5" width="1" height="4" fill="#64748B"/><rect x="4" y="11" width="8" height="3" fill="#334155"/><rect x="5" y="14" width="2" height="1" fill="#94A3B8"/><rect x="9" y="14" width="2" height="1" fill="#94A3B8"/></svg>`,
  },
  {
    id: 'pixel-terminal',
    name: 'Phosphor CRT Terminal',
    category: 'cyber',
    accent: '#22C55E',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="32" height="32" shape-rendering="crispEdges"><rect x="1" y="2" width="14" height="11" fill="#1E293B"/><rect x="2" y="3" width="12" height="9" fill="#05080A"/><path fill="#22C55E" d="M4 5h1v1h1v1H5v1H4V7h1V6H4V5zm3 3h4v1H7V8z"/><rect x="5" y="13" width="6" height="1" fill="#475569"/><rect x="3" y="14" width="10" height="1" fill="#334155"/></svg>`,
  },
  {
    id: 'pixel-coin',
    name: 'Treasury Gold Doubloon',
    category: 'commerce',
    accent: '#EAB308',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="32" height="32" shape-rendering="crispEdges"><path fill="#B45309" d="M5 2h6v1h2v2h1v6h-1v2h-2v1H5v-1H3v-2H2V5h1V3h2V2z"/><path fill="#FACC15" d="M5 3h6v1h2v2h1v4h-1v2h-2v1H5v-1H3v-2H2V6h1V4h2V3z"/><rect x="7" y="5" width="2" height="6" fill="#FEF08A"/><rect x="6" y="6" width="1" height="4" fill="#CA8A04"/></svg>`,
  },
  {
    id: 'pixel-shield',
    name: 'Zero-Egress Enclave Aegis',
    category: 'status',
    accent: '#10B981',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="32" height="32" shape-rendering="crispEdges"><path fill="#065F46" d="M3 2h10v6H12v3h-2v2H8v1H6v-2H4V8H3V2z"/><path fill="#10B981" d="M4 3h8v5h-1v2H9v2H7v-2H5V8H4V3z"/><path fill="#A7F3D0" d="M7 4h2v6H7V4zM5 6h6v2H5V6z"/></svg>`,
  },
  {
    id: 'pixel-potion',
    name: 'Alchemical Azoth Elixir',
    category: 'rpg',
    accent: '#A855F7',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="32" height="32" shape-rendering="crispEdges"><rect x="6" y="1" width="4" height="2" fill="#D4AF37"/><rect x="5" y="3" width="6" height="1" fill="#94A3B8"/><rect x="6" y="4" width="4" height="2" fill="#E2E8F0"/><path fill="#9333EA" d="M4 6h8v2h1v5h-1v1H4v-1H3V8h1V6z"/><path fill="#C084FC" d="M5 8h6v4H5V8z"/><rect x="5" y="9" width="2" height="2" fill="#F3E8FF"/></svg>`,
  },
  {
    id: 'pixel-rocket',
    name: 'One-Click Deploy Thruster',
    category: 'arcade',
    accent: '#F43F5E',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="32" height="32" shape-rendering="crispEdges"><path fill="#E2E8F0" d="M7 1h2v2h2v3h1v4H4V6h1V3h2V1z"/><rect x="7" y="5" width="2" height="2" fill="#38BDF8"/><path fill="#F43F5E" d="M2 8h2v3H2V8zm10 0h2v3h-2V8zM6 10h4v2H6v-2z"/><path fill="#FBBF24" d="M6 12h4v2H7v1H6v-3z"/></svg>`,
  },
];

/*
 * ==========================================================================
 * 5. Bespoke Multi-Layered Vector SVG Crests & Hero Graphics
 * ==========================================================================
 */
export interface BespokeSvgCrest {
  id: string;
  name: string;
  theme: string;
  svg: string;
}

export const BESPOKE_SVG_CRESTS: BespokeSvgCrest[] = [
  {
    id: 'svg-zoth-bolt-crest',
    name: 'Zoth Bolt Sovereign Prism Crest',
    theme: 'gold-obsidian',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="96" height="96"><defs><linearGradient id="zbGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#FFF3B0"/><stop offset="50%" stop-color="#D4AF37"/><stop offset="100%" stop-color="#785A12"/></linearGradient><radialGradient id="zbGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#D4AF37" stop-opacity="0.35"/><stop offset="100%" stop-color="#08080B" stop-opacity="0"/></radialGradient></defs><circle cx="60" cy="60" r="56" fill="url(#zbGlow)" stroke="url(#zbGold)" stroke-width="1.5" stroke-dasharray="6 4"/><polygon points="60,12 104,37 104,83 60,108 16,83 16,37" fill="#0B0D14" stroke="url(#zbGold)" stroke-width="2"/><path d="M66 24 L38 64 H58 L52 96 L84 54 H62 Z" fill="url(#zbGold)"/></svg>`,
  },
  {
    id: 'svg-emerald-leaf-seal',
    name: 'Botanical Apothecary & Pantry Seal',
    theme: 'emerald-botanical',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="96" height="96"><defs><linearGradient id="emLeaf" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#6EE7B7"/><stop offset="100%" stop-color="#047857"/></linearGradient></defs><circle cx="60" cy="60" r="52" fill="#06140E" stroke="#10B981" stroke-width="1.5"/><path d="M60 20 C88 26 96 58 60 98 C24 58 32 26 60 20 Z" fill="url(#emLeaf)" opacity="0.9"/><path d="M60 28 V90 M60 48 L76 38 M60 64 L44 52 M60 74 L74 62" stroke="#ECFDF5" stroke-width="2" stroke-linecap="round"/></svg>`,
  },
  {
    id: 'svg-neural-reticle',
    name: 'Autonomous Agent Target Reticle',
    theme: 'cyan-telemetry',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="96" height="96"><circle cx="60" cy="60" r="48" fill="none" stroke="#06B6D4" stroke-width="1.5" stroke-dasharray="10 6"/><circle cx="60" cy="60" r="32" fill="#06B6D4" fill-opacity="0.08" stroke="#38BDF8" stroke-width="1.5"/><path d="M60 4 V24 M60 96 V116 M4 60 H24 M96 60 H116" stroke="#38BDF8" stroke-width="2" stroke-linecap="round"/><circle cx="60" cy="60" r="6" fill="#22D3EE"/></svg>`,
  },
  {
    id: 'svg-velvet-reserve',
    name: 'Midnight Velvet & Gold Chalice Emblem',
    theme: 'violet-luxury',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="96" height="96"><defs><linearGradient id="vvGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#C084FC"/><stop offset="100%" stop-color="#581C87"/></linearGradient></defs><rect x="14" y="14" width="92" height="92" rx="22" fill="#0E0718" stroke="#A855F7" stroke-width="1.5"/><path d="M38 32 H82 L72 64 C68 74 52 74 48 64 Z" fill="url(#vvGrad)"/><path d="M60 72 V92 M44 92 H76" stroke="#F5E6AB" stroke-width="3" stroke-linecap="round"/><circle cx="60" cy="46" r="5" fill="#FDE047"/></svg>`,
  },
];

/*
 * ==========================================================================
 * 6. High-Impact Motion Edit Templates (Claude Motion & @teknium Shaders)
 * ==========================================================================
 */
export interface MotionEditTemplate {
  id: string;
  name: string;
  badge: string;
  accent: string;
  icon: string;
  description: string;
  prompt: string;
}

export const MOTION_EDIT_TEMPLATES: MotionEditTemplate[] = [
  {
    id: 'claude-15s-showreel',
    name: '15s Claude Motion Showreel + Aperture Handoff',
    badge: '6-Scene Cinema Cut',
    accent: '#D4AF37',
    icon: 'i-ph:film-strip-fill',
    description:
      'Deterministic 15-second 6-scene product launch film with live timeline scrubber, kinetic canvas choreography, WebAudio tactile synth, and smooth aperture handoff into the interactive app.',
    prompt: `Build a world-class product launch web app featuring an interactive 15-second Claude Motion Showreel Hero (6 timed scenes: 01 Problem Provocation, 02 Anchor Morph, 03 Bento Architecture, 04 Live AST/Telemetry Proof, 05 Velocity Counters, 06 Final Sovereign Lockup) with a play/pause scrubber, fullscreen cinema toggle, procedural WebAudio tactile clicks, and a full interactive workspace below.`,
  },
  {
    id: 'teknium-uncommon-shader',
    name: '@teknium Uncommon Web Shader Stage (Braille / Dither / ASCII)',
    badge: '60fps Canvas Shader',
    accent: '#38BDF8',
    icon: 'i-ph:matrix-logo-fill',
    description:
      'Interactive 60fps HTML5 Canvas shader header with live mode pills switching between Unicode Braille Wave (U+2800), Bayer 4x4 Ordered Dither, Kinetic ASCII Matrix, and Constellation Graph.',
    prompt: `Build a high-craft web application featuring a @teknium Uncommon Web 60fps interactive Canvas Shader stage in the hero with live mode switcher pills (Braille Wave U+2800, Bayer 4x4 Ordered Dither, Kinetic ASCII Matrix, and Constellation Mesh), paired with bespoke multi-layered SVG illustrations and a responsive interactive Bento workspace.`,
  },
  {
    id: 'gameboy-pixel-cinema',
    name: '16-Bit Pixel Art & Retro CRT Motion Edit',
    badge: 'Pixel Art + Chiptune',
    accent: '#22C55E',
    icon: 'i-ph:game-controller-fill',
    description:
      'Crisp shape-rendering="crispEdges" 16x16 inline SVG pixel-art sprites, animated tilemap simulation stage, toggleable CRT phosphor scanlines, and WebAudio 8-bit chiptune sound effects.',
    prompt: `Build an interactive 16-bit Pixel Art & Retro Arcade web application featuring custom inline SVG pixel-art icons (shape-rendering="crispEdges"), an animated HTML5 canvas pixel simulation viewport with play/pause/speed controls, a CRT scanline toggle, and zero-dependency WebAudio 8-bit synth SFX.`,
  },
  {
    id: 'hermes-commerce-drop',
    name: 'Instant Delivery & Commerce Drop (Sprig / Hatch / Hush Grade)',
    badge: 'Bespoke SVG + Live ETA',
    accent: '#10B981',
    icon: 'i-ph:shopping-bag-open-fill',
    description:
      'Editorial neighborhood commerce experience with multi-layered gradient SVG product artwork, animated SVG delivery countdown ring, category filter pills, and non-blocking slide-over cart.',
    prompt: `Build an ultra-polished neighborhood instant delivery storefront featuring bespoke multi-layered gradient SVG hero and product card illustrations (never flat placeholder boxes), a live animated SVG delivery ETA ring, interactive category filters, instant search, and a non-blocking slide-over bag drawer ([hidden] { display: none !important; }).`,
  },
  {
    id: 'scroll-choreography-deck',
    name: '3D Isometric Exploded View & Scroll Choreography',
    badge: 'Spring Physics + SVG',
    accent: '#C084FC',
    icon: 'i-ph:cube-focus-fill',
    description:
      'Interactive multi-layer isometric hardware/architecture stack that explodes into annotated layers on scroll or slider scrub, with real-time latency/spec calculators.',
    prompt: `Build an interactive hardware & architecture showcase featuring a multi-layer isometric SVG exploded-view stage controlled by both scroll progress and an interactive layer-separation slider, complete with annotated callout lines, spring transitions, and a live performance spec calculator.`,
  },
  {
    id: 'sovereign-saas-funnel',
    name: 'Sovereign Micro-SaaS + Motion Hero + Dual Checkout',
    badge: 'Stripe + Solana Ready',
    accent: '#F59E0B',
    icon: 'i-ph:lightning-fill',
    description:
      'Complete client-side developer utility with a kinetic motion hero, real-time AST/linter gauges, above-the-fold founding member banner, frosted-glass output preview, and 1-click license unlock.',
    prompt: `Build a production-grade Sovereign Micro-SaaS web application with a kinetic canvas motion hero, a 100% working client-side analysis/compiler workspace, bespoke SVG gauges, an above-the-fold founding member banner ($19 lifetime), frosted-glass pro export modal, and instant 1-click client-side license activation.`,
  },
];

/*
 * ==========================================================================
 * 7. Free External Media Asset Connectors (Zero-Key & Open APIs)
 * ==========================================================================
 */
export const FREE_MEDIA_ASSET_SOURCES = [
  {
    id: 'iconify',
    name: 'Iconify REST API (200,000+ Icons)',
    searchUrl: 'https://api.iconify.design/search?query={query}&limit=24',
    svgUrl: 'https://api.iconify.design/{prefix}/{name}.svg?color=%23D4AF37',
    collections: ['lucide', 'ph', 'pixelarticons', 'game-icons', 'tabler', 'simple-icons', 'mdi'],
    description: 'Search and embed any vector or pixel-art SVG icon on the fly with custom hex color.',
  },
  {
    id: 'dicebear',
    name: 'DiceBear Procedural SVG Avatars & Pixel Art',
    svgUrl: 'https://api.dicebear.com/9.x/{style}/svg?seed={seed}',
    styles: ['pixel-art', 'bottts', 'identicon', 'shapes', 'rings', 'thumbs'],
    description: 'Zero-auth deterministic SVG sprites for agents, user profiles, and retro pixel characters.',
  },
  {
    id: 'unsplash-curated',
    name: 'Unsplash Verified High-Res Photography CDN',
    description: 'Curated 1600px architectural, tech, culinary, luxury, and craftsmanship photography with alt text.',
  },
  {
    id: 'webaudio-sfx',
    name: 'Procedural WebAudio Synthesizer',
    description: 'Zero-dependency in-browser sound effects (tactile clicks, triad chimes, CRT keystrokes, aperture swooshes).',
  },
];

