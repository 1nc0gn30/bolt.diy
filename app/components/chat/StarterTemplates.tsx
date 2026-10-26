import React from 'react';
import type { Template } from '~/types/template';
import { STARTER_TEMPLATES } from '~/utils/constants';
import { MOTION_EDIT_TEMPLATES } from '~/lib/modules/design-libraries/media-packs';

interface FrameworkLinkProps {
  template: Template;
}

const FrameworkLink: React.FC<FrameworkLinkProps> = ({ template }) => (
  <a
    href={`/git?url=https://github.com/${template.githubRepo}.git`}
    data-state="closed"
    data-discover="true"
    className="items-center justify-center p-2 rounded-xl bg-white/5 border border-white/5 hover:border-[#D4AF37]/30 hover:bg-white/10 transition-all group"
  >
    <div
      className={`inline-block ${template.icon} w-6 h-6 text-2xl transition-all grayscale group-hover:grayscale-0 group-hover:scale-110 group-hover:text-[#D4AF37]`}
      title={template.label}
    />
  </a>
);

interface StarterTemplatesProps {
  onSelectPrompt?: (prompt: string) => void;
}

const CORE_FRAMEWORKS = [
  {
    id: 'astro',
    label: 'Astro (Latest 5+)',
    icon: 'i-bolt:astro',
    badge: 'Islands • 0-JS',
    accent: '#FF5D01',
    prompt:
      'Scaffold a production Astro 5 web application using component islands, Tailwind CSS, content collections, and responsive layout.',
  },
  {
    id: 'vite-react',
    label: 'Vite + React 19',
    icon: 'i-bolt:react',
    badge: 'React 19 • Fast HMR',
    accent: '#00D8FF',
    prompt:
      'Scaffold a modern Vite + React 19 single-page application with TypeScript, Tailwind CSS, and Lucide icons.',
  },
  {
    id: 'vanilla-js',
    label: 'Vanilla JS',
    icon: 'i-bolt:vite',
    badge: 'Pure JS • 0-Bloat',
    accent: '#F7DF1E',
    prompt:
      'Build a pure Vanilla JavaScript (ES Modules) web application using Vite with modular DOM manipulation and zero heavy frameworks.',
  },
  {
    id: 'html-css-js',
    label: 'HTML5 + CSS3 + JS',
    icon: 'i-bolt:html5',
    badge: 'Zero-Build • Static',
    accent: '#E34F26',
    prompt:
      'Create a clean, zero-build static web application featuring semantic HTML5, modern CSS3 styling, and vanilla JavaScript without any node build dependencies.',
  },
  {
    id: 'nextjs',
    label: 'Next.js + shadcn',
    icon: 'i-bolt:nextjs',
    badge: 'Fullstack App Router',
    accent: '#FFFFFF',
    prompt:
      'Scaffold a Next.js App Router application integrated with shadcn/ui components, Tailwind CSS, and Lucide icons.',
  },
];

const DESIGN_2026_STACKS = [
  {
    id: 'avant-garde',
    name: 'Avant-Garde Portfolio 2026',
    icon: 'i-ph:paint-brush-broad-fill',
    badge: 'Syne • Aurora • Bento',
    accent: '#D4AF37',
    prompt:
      'Build a cutting-edge 2026 Avant-Garde portfolio web app featuring Syne & Space Grotesk typography, ambient Aurora mesh gradients, an interactive Bento grid, pure CSS conic border-beams, and in-browser kinetic canvas motion.',
  },
  {
    id: 'sovereign-saas',
    name: 'Sovereign Micro-SaaS 2026',
    icon: 'i-ph:currency-circle-dollar-fill',
    badge: 'Stripe + Solana • Dark Glass',
    accent: '#10B981',
    prompt:
      'Build a production-grade 2026 Micro-SaaS with obsidian glassmorphic UI, dual Stripe + Solana DePay payment rails, an interactive above-the-fold sales banner, frosted-glass output paywall, and 1-click license activation.',
  },
  {
    id: 'agent-orchestrator',
    name: 'Autonomous AI Agent Hub 2026',
    icon: 'i-ph:robot-fill',
    badge: 'MCP • SSE • Terminal HUD',
    accent: '#C084FC',
    prompt:
      'Build an autonomous AI agent control hub featuring Model Context Protocol (MCP) tool integration, live Server-Sent Events (SSE) streaming, telemetry gauges, and interactive terminal logs.',
  },
  {
    id: 'zoth-foundry-deck',
    name: 'Zoth Foundry Control Deck',
    icon: 'i-ph:cpu-fill',
    badge: 'OS · Studio · Gold',
    accent: '#D4AF37',
    prompt:
      'Build a Zoth foundry control deck: gold #D4AF37 on obsidian, Space Grotesk + Inter, live status for Studio :3000, civilization :9393, and a soul/memory pane. Honest labels only.',
  },
  {
    id: 'editorial-atelier',
    name: 'Editorial Atelier',
    icon: 'i-ph:book-open-fill',
    badge: 'Print • Measure',
    accent: '#F5E6AB',
    prompt:
      'Build an editorial atelier site: oversized headlines, 60ch measure, cream or ink, one photograph band, no card grid.',
  },
  {
    id: 'local-desk',
    name: 'Local City Desk',
    icon: 'i-ph:map-pin-fill',
    badge: 'Facts only',
    accent: '#38BDF8',
    prompt:
      'Build a finished local city-desk site using only facts supplied in the prompt. One contact form is the contact line. 390px first.',
  },
];

const StarterTemplates: React.FC<StarterTemplatesProps> = ({ onSelectPrompt }) => {
  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-chat mx-auto px-4 mt-2">
      {/* 1. Core Framework Selection Options (Astro, Vite React, Vanilla JS, HTML/CSS/JS) */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-white/80 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Framework Architecture Options
          </span>
          <span className="text-[10px] font-mono text-white/40">Adds onto the prompt</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {CORE_FRAMEWORKS.map((fw) => (
            <button
              key={fw.id}
              type="button"
              onClick={() => onSelectPrompt?.(fw.prompt)}
              className="group flex flex-col items-start p-2.5 rounded-xl border border-white/10 bg-[#0F0F16]/90 hover:border-cyan-400/50 hover:bg-[#161622] transition-all duration-200 cursor-pointer text-left"
            >
              <div className="flex items-center gap-1.5 mb-1 w-full justify-between">
                <div className={`${fw.icon} text-lg text-white/80 group-hover:text-cyan-400 transition-colors`} />
                <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-white/5 border border-white/5 text-white/60">
                  {fw.badge}
                </span>
              </div>
              <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                {fw.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. 2026 Curated Design Archetypes */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            2026 Avant-Garde Design Stacks
          </span>
          <span className="text-[10px] font-mono text-white/40">Adds onto the prompt</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {DESIGN_2026_STACKS.map((stack) => (
            <button
              key={stack.id}
              type="button"
              onClick={() => onSelectPrompt?.(stack.prompt)}
              className="group text-left p-3 rounded-xl border border-white/10 bg-gradient-to-b from-[#14141E]/80 to-[#0A0A0F]/80 hover:border-[#D4AF37]/50 hover:bg-[#1A1A26] transition-all duration-200 cursor-pointer relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform">
                  <div className={`${stack.icon} text-sm`} />
                </div>
                <span className="text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded border border-white/10 bg-white/5 text-white/70">
                  {stack.badge}
                </span>
              </div>
              <h4 className="text-xs font-bold text-white group-hover:text-[#F5E6AB] transition-colors flex items-center justify-between">
                <span>{stack.name}</span>
                <span className="i-ph:arrow-right text-[10px] opacity-0 group-hover:opacity-100 transition-opacity text-[#D4AF37]" />
              </h4>
            </button>
          ))}
        </div>
      </div>

      {/* 2.5. Motion Edit & Cinema Showreel Templates */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Motion Edit &amp; Uncommon Shader Templates
          </span>
          <span className="text-[10px] font-mono text-white/40">15s Showreels · @teknium · Pixel Art</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {MOTION_EDIT_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => onSelectPrompt?.(tpl.prompt)}
              className="group text-left p-3 rounded-xl border border-white/10 bg-gradient-to-b from-[#10181D]/90 to-[#090C10]/90 hover:border-emerald-400/50 hover:bg-[#141F26] transition-all duration-200 cursor-pointer relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <div className={`${tpl.icon} text-sm`} />
                </div>
                <span className="text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                  {tpl.badge}
                </span>
              </div>
              <h4 className="text-xs font-bold text-white group-hover:text-emerald-200 transition-colors flex items-center justify-between">
                <span>{tpl.name}</span>
                <span className="i-ph:arrow-right text-[10px] opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
              </h4>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Base Full-Stack Runtime Links */}
      <div className="flex flex-col items-center gap-2 pt-1 border-t border-white/5 w-full">
        <span className="text-[11px] text-bolt-elements-textTertiary font-mono">Or load WebContainer base repo:</span>
        <div className="flex flex-wrap justify-center items-center gap-2">
          {STARTER_TEMPLATES.map((template) => (
            <FrameworkLink key={template.name} template={template} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StarterTemplates;
