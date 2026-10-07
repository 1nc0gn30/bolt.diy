import React, { useState, useEffect, useRef } from 'react';
import { Button } from '~/components/ui/Button';
import { Dialog, DialogTitle, DialogDescription, DialogRoot } from '~/components/ui/Dialog';

interface LocalTool {
  name: string;
  command: string;
  isAvailable: boolean;
  path?: string;
  version?: string;
}

interface CommandHistoryEntry {
  command: string;
  output: string;
  exitCode: number;
  durationMs: number;
  timestamp: number;
}

export interface AgyTerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AgyTerminalModal: React.FC<AgyTerminalModalProps> = ({ isOpen, onClose }) => {
  const [command, setCommand] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const [history, setHistory] = useState<CommandHistoryEntry[]>([
    {
      command: 'agy --version',
      output:
        'Antigravity CLI (agy) v2.0 - DeepMind Autonomous Agent Architecture\nEnvironment: Linux (x86_64) • Host: zothos\nStatus: Sovereign Bridge Active',
      exitCode: 0,
      durationMs: 45,
      timestamp: Date.now() - 60000,
    },
  ]);

  const [tools, setTools] = useState<LocalTool[]>([]);
  const [cwd, setCwd] = useState('~/NullAITech/bolt.diy');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentStreamOutput, setCurrentStreamOutput] = useState('');

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch host tools diagnostics
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    fetch('/api/agy/terminal')
      .then((res) => res.json())
      .then((data: any) => {
        if (data.tools) {
          setTools(data.tools);
        }

        if (data.cwd) {
          setCwd(data.cwd);
        }
      })
      .catch(() => {
        // Ignore fetch errors
      });
  }, [isOpen]);

  // Focus input and scroll to bottom
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, currentStreamOutput]);

  const runCommand = async (cmdToRun: string) => {
    const trimmed = cmdToRun.trim();

    if (!trimmed || isRunning) {
      return;
    }

    setIsRunning(true);
    setCurrentStreamOutput('');
    setCommand('');
    setHistoryIndex(-1);

    const startTime = Date.now();

    try {
      const response = await fetch('/api/agy/terminal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
        },
        body: JSON.stringify({
          command: trimmed,
          stream: true,
          cwd,
        }),
      });

      if (!response.body) {
        throw new Error('No streaming response body available');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let accumulatedOutput = '';
      let exitCode = 0;

      while (true) {
        const { value, done } = await reader.read();

        if (done) {
          break;
        }

        const textChunk = decoder.decode(value, { stream: true });
        const lines = textChunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const event = JSON.parse(line.slice(6));

              if (event.type === 'stdout' || event.type === 'stderr') {
                accumulatedOutput += event.text;
                setCurrentStreamOutput(accumulatedOutput);
              } else if (event.type === 'exit') {
                exitCode = event.code;
              } else if (event.type === 'error') {
                accumulatedOutput += `\n[Error: ${event.message}]`;
                setCurrentStreamOutput(accumulatedOutput);
              }
            } catch {
              // Ignore partial SSE parsing issues
            }
          }
        }
      }

      setHistory((prev: CommandHistoryEntry[]) => [
        ...prev,
        {
          command: trimmed,
          output: accumulatedOutput || '[Completed with zero output]',
          exitCode,
          durationMs: Date.now() - startTime,
          timestamp: Date.now(),
        },
      ]);
      setCurrentStreamOutput('');
    } catch (err: any) {
      setHistory((prev: CommandHistoryEntry[]) => [
        ...prev,
        {
          command: trimmed,
          output: `Error executing command: ${err.message}`,
          exitCode: 1,
          durationMs: Date.now() - startTime,
          timestamp: Date.now(),
        },
      ]);
      setCurrentStreamOutput('');
    } finally {
      setIsRunning(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      runCommand(command);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();

      if (history.length > 0) {
        const nextIndex = historyIndex + 1 < history.length ? historyIndex + 1 : historyIndex;
        setHistoryIndex(nextIndex);
        setCommand(history[history.length - 1 - nextIndex]?.command || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();

      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setCommand(history[history.length - 1 - nextIndex]?.command || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommand('');
      }
    }
  };

  const clearHistory = () => {
    setHistory([]);
    setCurrentStreamOutput('');
  };

  const presetChips = [
    { label: 'agy --help', cmd: 'agy --help' },
    { label: 'agy models', cmd: 'agy models' },
    { label: 'agy agent', cmd: 'agy agent' },
    { label: 'agy mcp list', cmd: 'agy mcp list' },
    { label: 'hermes --help', cmd: 'hermes --help' },
    { label: 'claude --version', cmd: 'claude --version' },
    { label: 'ollama list', cmd: 'ollama list' },
    { label: 'git status', cmd: 'git status' },
  ];

  return (
    <DialogRoot open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog className="!w-[96vw] !max-w-5xl !rounded-2xl border-amber-500/20 bg-[#08080B] text-bolt-elements-textPrimary">
        <div className="p-4 sm:p-6 w-full max-h-[90vh] flex flex-col gap-4 overflow-hidden font-mono">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3 font-sans">
            <div>
              <div className="flex items-center gap-2">
                <span className="i-ph:terminal-window text-amber-400 text-2xl" />
                <DialogTitle className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  AGY & ZothOS Host Terminal
                </DialogTitle>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Host Shell
                </span>
              </div>
              <DialogDescription className="text-xs sm:text-sm text-gray-400 mt-1 font-mono">
                Execute Antigravity CLI (agy), Nous Hermes, Claude Code, and Linux host commands directly from Zoth
                WebGen.
              </DialogDescription>
            </div>

            {/* Local Engine Status Pills */}
            <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono">
              {tools.slice(0, 4).map((t: LocalTool) => (
                <div
                  key={t.command}
                  className={`px-2 py-1 rounded-md border flex items-center gap-1.5 whitespace-nowrap ${
                    t.isAvailable
                      ? 'bg-white/5 border-emerald-500/30 text-emerald-300'
                      : 'bg-white/5 border-white/10 text-gray-500'
                  }`}
                  title={t.path ? `${t.name}: ${t.path}` : `${t.name} (Not found)`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${t.isAvailable ? 'bg-emerald-400' : 'bg-gray-600'}`} />
                  <span>{t.command}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Command Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono custom-scrollbar">
            <span className="text-gray-500 whitespace-nowrap flex items-center gap-1 font-sans">
              <span className="i-ph:lightning text-amber-400" /> Presets:
            </span>
            {presetChips.map((chip) => (
              <button
                key={chip.cmd}
                disabled={isRunning}
                onClick={() => runCommand(chip.cmd)}
                className="whitespace-nowrap px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/50 text-gray-300 hover:text-amber-300 transition-all text-xs flex items-center gap-1"
              >
                <span>{chip.label}</span>
              </button>
            ))}
          </div>

          {/* Terminal Console Viewport */}
          <div className="flex-1 min-h-[350px] max-h-[50vh] bg-[#050508] border border-white/10 rounded-xl p-4 overflow-y-auto custom-scrollbar font-mono text-xs sm:text-sm text-gray-300 space-y-4 shadow-inner">
            {history.map((entry: CommandHistoryEntry, idx: number) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400/90 font-semibold select-none">
                  <span className="text-emerald-400">zoth@zothos</span>
                  <span className="text-gray-500">:</span>
                  <span className="text-blue-400">{cwd.split('/').slice(-2).join('/')}</span>
                  <span className="text-gray-500">$</span>
                  <span className="text-white">{entry.command}</span>
                  <span className="ml-auto text-[10px] text-gray-600 font-normal">
                    {entry.durationMs}ms {entry.exitCode !== 0 && `(exit ${entry.exitCode})`}
                  </span>
                </div>
                <pre className="whitespace-pre-wrap font-mono text-xs text-gray-300 pl-4 border-l-2 border-white/10 leading-relaxed overflow-x-auto">
                  {entry.output}
                </pre>
              </div>
            ))}

            {/* Active Streaming Chunk */}
            {isRunning && (
              <div className="space-y-1.5 animate-pulse">
                <div className="flex items-center gap-2 text-amber-400 font-semibold">
                  <span className="text-emerald-400">zoth@zothos</span>
                  <span className="text-gray-500">$</span>
                  <span className="text-white flex items-center gap-2">
                    Executing...
                    <span className="i-ph:spinner animate-spin text-amber-400 text-xs" />
                  </span>
                </div>
                {currentStreamOutput && (
                  <pre className="whitespace-pre-wrap font-mono text-xs text-gray-300 pl-4 border-l-2 border-amber-500/50 leading-relaxed">
                    {currentStreamOutput}
                  </pre>
                )}
              </div>
            )}

            <div ref={terminalEndRef} />
          </div>

          {/* Command Prompt Input Bar */}
          <div className="flex items-center gap-2 bg-[#0c0c12] p-2 rounded-xl border border-white/10">
            <span className="text-amber-400 font-semibold text-xs sm:text-sm pl-2 select-none">agy$</span>
            <input
              ref={inputRef}
              type="text"
              value={command}
              disabled={isRunning}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type any agy, hermes, claude, or bash command (e.g. agy models)..."
              className="flex-1 bg-transparent border-none text-xs sm:text-sm text-white placeholder:text-gray-600 focus:outline-none font-mono"
            />
            {command && (
              <button
                type="button"
                onClick={() => setCommand('')}
                className="text-gray-500 hover:text-gray-300 text-xs px-2"
              >
                Clear
              </button>
            )}
            <Button
              variant="secondary"
              disabled={isRunning || !command.trim()}
              onClick={() => runCommand(command)}
              className="bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 font-sans"
            >
              {isRunning ? (
                <>
                  <span className="i-ph:spinner animate-spin text-xs" /> Running
                </>
              ) : (
                <>
                  <span className="i-ph:play text-xs" /> Execute
                </>
              )}
            </Button>
          </div>

          {/* Terminal Footer Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-gray-500 font-sans">
            <div className="flex items-center gap-3">
              <span>Use ↑ / ↓ arrow keys for command history</span>
              <span>•</span>
              <button onClick={clearHistory} className="hover:text-gray-300 flex items-center gap-1 transition-colors">
                <span className="i-ph:trash text-xs" /> Clear Terminal
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={onClose} className="text-xs px-3 py-1.5 font-sans">
                Close
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </DialogRoot>
  );
};
