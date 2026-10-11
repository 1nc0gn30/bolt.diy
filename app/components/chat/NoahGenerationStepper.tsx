import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect } from 'react';

interface NoahGenerationStepperProps {
  isStreaming: boolean;
  activeModel?: string;
}

export const NoahGenerationStepper: React.FC<NoahGenerationStepperProps> = ({
  isStreaming,
  activeModel = 'Gemini 2.5 Flash',
}) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isStreaming) {
      setSeconds(0);
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setSeconds(0);
    }

    return () => clearInterval(interval);
  }, [isStreaming]);

  if (!isStreaming) {
    return null;
  }

  // Determine stage based on elapsed generation time
  const currentStep = seconds < 3 ? 1 : seconds < 8 ? 2 : seconds < 18 ? 3 : 4;

  const STEPS = [
    { id: 1, label: 'Architecture & Scaffolding', icon: 'i-ph:tree-structure' },
    { id: 2, label: 'Design Tokens & FX Injected', icon: 'i-ph:paint-brush' },
    { id: 3, label: 'React Components & Hooks', icon: 'i-ph:code' },
    { id: 4, label: 'WebContainer Port 5173 Live', icon: 'i-ph:rocket-launch' },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        className="w-full max-w-chat mx-auto mb-2 p-3 rounded-xl border border-white/10 bg-[#0B0F17]/90 backdrop-blur-md shadow-xl flex flex-col gap-2 font-mono text-xs select-none"
      >
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-white tracking-wider">Autonomous WebGen Pipeline Active</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-neutral-400">
            <span className="px-2 py-0.5 rounded border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]">
              {activeModel}
            </span>
            <span className="font-bold text-emerald-400">{seconds}s elapsed</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {STEPS.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div
                key={step.id}
                className={`p-2 rounded-lg border transition-all flex items-center gap-2 ${
                  isCompleted
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                    : isCurrent
                      ? 'border-blue-500/50 bg-blue-500/15 text-blue-200 shadow-[0_0_12px_rgba(59,130,246,0.2)]'
                      : 'border-white/5 bg-white/[0.02] text-neutral-500'
                }`}
              >
                <div className="text-sm shrink-0">
                  {isCompleted ? (
                    <span className="i-ph:check-circle-fill text-emerald-400" />
                  ) : isCurrent ? (
                    <span className="i-svg-spinners:90-ring-with-bg text-blue-400 animate-spin" />
                  ) : (
                    <span className={step.icon} />
                  )}
                </div>
                <span className="text-[10px] font-medium leading-tight truncate">{step.label}</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
