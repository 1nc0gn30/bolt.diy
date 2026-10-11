import React, { useState } from 'react';
import { toast } from 'react-toastify';

interface ZothBentoFeaturesProps {
  onSelectCloudModel?: () => void;
  onSelectStarter?: () => void;
}

export const ZothBentoFeatures: React.FC<ZothBentoFeaturesProps> = ({ onSelectCloudModel, onSelectStarter }) => {
  const [showMcpModal, setShowMcpModal] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const mcpConfigSnippet = JSON.stringify(
    {
      mcpServers: {
        'zoth-webgen': {
          command: 'node',
          args: ['/home/zoth/NullAITech/bolt.diy/packages/mcp-server/index.mjs'],
          env: {
            WEBGEN_BASE_URL: 'http://localhost:5173',
          },
        },
      },
    },
    null,
    2,
  );

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success('Copied MCP configuration to clipboard!');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="w-full max-w-chat mx-auto px-4 mb-2.5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Card 1: Frontier Cloud Models */}
        <div
          onClick={onSelectCloudModel}
          className="group relative overflow-hidden rounded-2xl border border-[#D4AF37]/20 bg-gradient-to-b from-[#14141E]/90 to-[#0A0A0F]/90 p-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/50 hover:shadow-[0_8px_30px_rgba(212,175,55,0.15)] cursor-pointer"
        >
          <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-br from-[#D4AF37]/10 to-transparent blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform">
              <div className="i-ph:sparkle-fill text-base" />
            </div>
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400">
              Frontier LLMs
            </span>
          </div>
          <h3 className="text-sm font-bold text-white group-hover:text-[#F5E6AB] transition-colors flex items-center gap-1.5">
            Frontier Cloud Models
            <span className="i-ph:arrow-right text-xs opacity-0 group-hover:opacity-100 transition-opacity text-[#D4AF37]" />
          </h3>
          <p className="text-xs text-bolt-elements-textSecondary mt-1 leading-relaxed">
            Architect with Gemini 2.5 Flash, Grok CLI, Nous Hermes, AGY, and frontier runners.
          </p>
        </div>

        {/* Card 2: WebContainer Runtime */}
        <div
          onClick={onSelectStarter}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#14141E]/90 to-[#0A0A0F]/90 p-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-[0_8px_30px_rgba(6,182,212,0.12)] cursor-pointer"
        >
          <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-br from-cyan-500/10 to-transparent blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <div className="i-ph:browsers-duotone text-base" />
            </div>
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
              In-Browser
            </span>
          </div>
          <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
            Full WebContainer
            <span className="i-ph:arrow-right text-xs opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
          </h3>
          <p className="text-xs text-bolt-elements-textSecondary mt-1 leading-relaxed">
            Zero-server client-side Node.js execution. Instant Vite dev servers with live HMR previews.
          </p>
        </div>

        {/* Card 3: Autonomous MCP Bridge */}
        <div
          onClick={() => setShowMcpModal(true)}
          className="group relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-b from-[#14141E]/90 to-[#0A0A0F]/90 p-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/50 hover:shadow-[0_8px_30px_rgba(168,85,247,0.15)] cursor-pointer"
        >
          <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-br from-purple-500/10 to-transparent blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <div className="i-ph:plug-charging-fill text-base" />
            </div>
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              Stdio & SSE Live
            </span>
          </div>
          <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors flex items-center gap-1.5">
            MCP Autonomous API
            <span className="i-ph:arrow-right text-xs opacity-0 group-hover:opacity-100 transition-opacity text-purple-400" />
          </h3>
          <p className="text-xs text-bolt-elements-textSecondary mt-1 leading-relaxed">
            Grok CLI, Hermes, OpenCode, Cline, and Aider sit next to the cloud models. MCP still lets an outside agent
            drive a build.
          </p>
        </div>
      </div>

      {/* MCP Quick Connect Modal */}
      {showMcpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-xl rounded-2xl border border-[#D4AF37]/30 bg-[#0D0D14] p-6 shadow-[0_0_50px_rgba(212,175,55,0.15)]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                  <div className="i-ph:plug-charging-fill text-lg" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Model Context Protocol (MCP) Bridge</h2>
                  <p className="text-xs text-[#D4AF37] font-mono">Autonomous AI Agent Control System</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowMcpModal(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              >
                <div className="i-ph:x-bold text-sm" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-bolt-elements-textSecondary">
              <p>
                Connect Grok CLI, Hermes, OpenCode, Cline, Aider, Antigravity, or Claude Code to this Zoth WebGen
                instance. External agents can prompt builds, run commands, and read generated source code.
              </p>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-white font-mono">JSON Config (mcp_config.json):</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(mcpConfigSnippet, 'json')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/30 transition-all font-mono font-bold"
                  >
                    {copiedKey === 'json' ? (
                      <>
                        <div className="i-ph:check text-xs" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <div className="i-ph:copy text-xs" />
                        <span>Copy Config</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-black/60 border border-white/10 text-emerald-400 font-mono text-[11px] overflow-x-auto">
                  {mcpConfigSnippet}
                </pre>
              </div>

              <div>
                <span className="font-semibold text-white block mb-1.5">Available Autonomous Tools:</span>
                <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px]">
                  <div className="p-1.5 rounded bg-white/5 border border-white/5 text-white/90">
                    ⚡ <code>webgen_prompt_and_build</code>
                  </div>
                  <div className="p-1.5 rounded bg-white/5 border border-white/5 text-white/90">
                    🔍 <code>webgen_get_status</code>
                  </div>
                  <div className="p-1.5 rounded bg-white/5 border border-white/5 text-white/90">
                    📂 <code>webgen_list_files</code>
                  </div>
                  <div className="p-1.5 rounded bg-white/5 border border-white/5 text-white/90">
                    📖 <code>webgen_read_file</code>
                  </div>
                  <div className="p-1.5 rounded bg-white/5 border border-white/5 text-white/90">
                    ✏️ <code>webgen_write_file</code>
                  </div>
                  <div className="p-1.5 rounded bg-white/5 border border-white/5 text-white/90">
                    🌐 <code>webgen_get_preview_url</code>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setShowMcpModal(false)}
                className="px-4 py-1.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs hover:bg-[#F5E6AB] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
