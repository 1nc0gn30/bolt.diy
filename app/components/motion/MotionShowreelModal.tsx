import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

interface MotionShowreelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SCENES = [
  {
    time: '0:00 - 0:02',
    title: 'Scene 1: Kinetic Provocation',
    copy: 'WHERE SOVEREIGN SOFTWARE BEGINS',
    detail: 'Oversized Syne typography slam with metallic gold light rays breaking darkness.',
    accent: '#D4AF37',
  },
  {
    time: '0:02 - 0:05',
    title: 'Scene 2: Paradigm Shift',
    copy: 'ZERO SERVERS. 100% IN-BROWSER WEBCONTAINER.',
    detail: 'Gold anchor hexagon expands into an interactive Vite runtime with 0ms compile latency.',
    accent: '#00F0FF',
  },
  {
    time: '0:05 - 0:08',
    title: 'Scene 3: Local Zero-Key Engines',
    copy: 'AGY • NOUS HERMES • CLAUDE CODE • OLLAMA',
    detail: 'Snap-zoom into local telemetry gauge showing zero cloud API keys and 100% private inference.',
    accent: '#10B981',
  },
  {
    time: '0:08 - 0:11',
    title: 'Scene 4: Autonomous MCP Bridge',
    copy: 'STDIO & SSE BIDIRECTIONAL CONTROL',
    detail: 'External AI agents drive real-time code synthesis and inspect AST files via MCP tool calls.',
    accent: '#C084FC',
  },
  {
    time: '0:11 - 0:13',
    title: 'Scene 5: Instant Realization',
    copy: 'ONE-CLICK LIFETIME ACTIVATION • $19',
    detail: 'Dual Stripe + Solana DePay rails dissolve output paywall blur in real-time.',
    accent: '#D4AF37',
  },
  {
    time: '0:13 - 0:15',
    title: 'Scene 6: Branded Resolve',
    copy: 'ZOTH WEBGEN FOUNDRY • NEAL FRAZIER TECH',
    detail: 'Golden anchor shape docks into Zoth logo lockup with white-hot specular glare.',
    accent: '#F5E6AB',
  },
];

export const MotionShowreelModal: React.FC<MotionShowreelModalProps> = ({ isOpen, onClose }) => {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-advance scene simulator
  useEffect(() => {
    if (!isOpen || !isPlaying) {
      return undefined;
    }

    const timer = setInterval(() => {
      setActiveSceneIndex((prev) => (prev + 1) % SCENES.length);
    }, 2500);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying]);

  if (!isOpen) {
    return null;
  }

  const showreelPrompt = `Act as a world-class motion graphics director and lead designer. Make a dynamic 15-second motion graphics video that shows what an incredible motion designer you are, like it's your showreel for a creative director résumé. Go all out.

Product: Zoth WebGen Foundry (Where Sovereign Software Begins)
Hero Anchor: The #D4AF37 Imperial Gold glowing hexagon from the logo leads every shot with zero visual dead space.

Scene Breakdown & Exact On-Screen Copy:
- Scene 1 (0:00 - 0:02): Explosive kinetic typography drop. Text: "WHERE SOVEREIGN SOFTWARE BEGINS"
- Scene 2 (0:02 - 0:05): Speed transition. Anchor hexagon morphs into in-browser WebContainer UI. Text: "ZERO SERVERS. 100% IN-BROWSER WEBCONTAINER."
- Scene 3 (0:05 - 0:08): High-contrast feature blitz. Camera snap zoom into telemetry gauge. Text: "AGY • NOUS HERMES • CLAUDE CODE • OLLAMA"
- Scene 4 (0:08 - 0:11): 3D isometric perspective shift. Text: "STDIO & SSE BIDIRECTIONAL CONTROL"
- Scene 5 (0:11 - 0:13): Climax unlock. Paywall blur dissolves into pristine code. Text: "ONE-CLICK LIFETIME ACTIVATION • $19"
- Scene 6 (0:13 - 0:15): Branded resolve. Hexagon docks into logo. Text: "ZOTH WEBGEN FOUNDRY • Engineered by Neal Frazier Tech (@1nc0gn30)"

Style & Animation Constraints:
- Background: Pitch black (#08080B) with subtle ambient mesh glow (#D4AF37 and #00F0FF).
- Typography: Bold grotesque font (Syne and Space Grotesk), tracking tight, uppercase punchlines.
- Motion curves: cubic-bezier(0.16, 1, 0.3, 1), micro-rotations (±4deg), and kinetic letter spacing.
- Audio sync: Every cut and punch snaps exactly on the 120 BPM audio beat.`;

  const copyPrompt = () => {
    navigator.clipboard.writeText(showreelPrompt);
    toast.success('Copied 15s Claude Motion Graphics prompt to clipboard!');
  };

  const currentScene = SCENES[activeSceneIndex];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-fade-in"
    >
      <div className="relative w-full max-w-2xl rounded-2xl border border-[#D4AF37]/35 bg-[#0D0D14] p-6 shadow-[0_0_60px_rgba(212,175,55,0.18)]">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <div className="i-ph:film-strip-fill text-lg" />
            </div>
            <div>
              <h2 id="modal-title" className="text-base font-bold text-white flex items-center gap-2">
                Claude Motion Graphics Showreel
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37]">
                  2026 REVID SPEC
                </span>
              </h2>
              <p className="text-xs text-white/50">15-Second Viral Launch Reel Blueprint & Interactive Preview</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            <div className="i-ph:x-bold text-sm" />
          </button>
        </div>

        {/* Live Motion Visualizer Screen */}
        <div className="my-5 relative overflow-hidden rounded-xl border border-white/15 bg-black/90 p-6 min-h-[160px] flex flex-col justify-between shadow-inner">
          <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-[#D4AF37]/15 blur-2xl pointer-events-none" />

          {/* Top Bar: Scene Index & Timestamp */}
          <div className="flex items-center justify-between z-10">
            <span className="font-mono text-xs font-bold text-[#D4AF37]">{currentScene.time}</span>
            <div className="flex items-center gap-1.5">
              {SCENES.map((s, idx) => (
                <button
                  key={s.title}
                  type="button"
                  onClick={() => setActiveSceneIndex(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === activeSceneIndex ? 'w-6 bg-[#D4AF37]' : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Jump to scene ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Kinetic Copy Punchline */}
          <div className="my-auto py-3 z-10">
            <p className="text-[11px] font-mono uppercase tracking-widest text-white/50 mb-1">{currentScene.title}</p>
            <h3 className="font-syne text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight">
              {currentScene.copy}
            </h3>
            <p className="text-xs text-white/70 mt-1">{currentScene.detail}</p>
          </div>

          {/* Bottom Bar: Play/Pause and Next/Prev */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10 z-10">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white font-mono transition-colors"
            >
              <div className={isPlaying ? 'i-ph:pause-fill' : 'i-ph:play-fill'} />
              <span>{isPlaying ? 'Pause Sim' : 'Play Sim'}</span>
            </button>
            <span className="text-[11px] font-mono text-emerald-400">120 BPM Beat-Synced</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={copyPrompt}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#D4AF37]/40 bg-gradient-to-r from-[#D4AF37]/20 to-[#997B1A]/20 text-[#D4AF37] hover:border-[#D4AF37] text-xs font-bold transition-all shadow-[0_0_15px_rgba(212,175,55,0.15)]"
          >
            <div className="i-ph:copy-fill text-xs" />
            <span>Copy Full Revid / Claude Prompt</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 text-white font-medium text-xs hover:bg-white/20 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
