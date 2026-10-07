import React from 'react';
import type { Template } from '~/types/template';
import { STARTER_TEMPLATES } from '~/utils/constants';

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
];

const StarterTemplates: React.FC<StarterTemplatesProps> = ({ onSelectPrompt }) => {
  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-chat mx-auto px-4 mt-2">
      {/* 2026 Curated Design Archetypes */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            2026 Avant-Garde Design Stacks
          </span>
          <span className="text-[10px] font-mono text-white/40">Zero-Config Architectures</span>
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

      {/* Framework Starters Row */}
      <div className="flex flex-col items-center gap-2 pt-1 border-t border-white/5 w-full">
        <span className="text-[11px] text-bolt-elements-textTertiary font-mono">
          Or start from a base full-stack runtime:
        </span>
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
