import React from 'react';

const EXAMPLE_PROMPTS = [
  { text: 'Build a sleek dark-glassmorphic SaaS landing page' },
  { text: 'Build a high-converting portfolio with Bento grid layout' },
  { text: 'Build a realtime financial dashboard in React' },
  { text: 'Build a modern markdown blog with Astro' },
  { text: 'Make an interactive retro arcade game in Canvas' },
  { text: 'Create a luxury automotive concierge web app' },
];

export function ExamplePrompts(sendMessage?: { (event: React.UIEvent, messageInput?: string): void | undefined }) {
  return (
    <div id="examples" className="relative flex flex-col gap-9 w-full max-w-3xl mx-auto flex justify-center mt-6">
      <div
        className="flex flex-wrap justify-center gap-2"
        style={{
          animation: '.25s ease-out 0s 1 _fade-and-move-in_g2ptj_1 forwards',
        }}
      >
        {EXAMPLE_PROMPTS.map((examplePrompt, index: number) => {
          return (
            <button
              key={index}
              onClick={(event) => {
                sendMessage?.(event, examplePrompt.text);
              }}
              className="group border border-bolt-elements-borderColor/70 hover:border-[#D4AF37]/60 rounded-full bg-[#08080B]/60 hover:bg-[#0E0E14] text-bolt-elements-textSecondary hover:text-white px-3.5 py-1.5 text-xs transition-all duration-200 hover:shadow-[0_0_18px_rgba(212,175,55,0.2)] flex items-center gap-1.5"
            >
              <span>{examplePrompt.text}</span>
              <div className="i-ph:arrow-up-right text-[10px] text-[#D4AF37] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
