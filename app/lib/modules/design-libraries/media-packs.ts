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
];
