import { useState, useEffect } from 'react';
import { questions } from '../data/questions';

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  const [promptIndex, setPromptIndex] = useState(0);

  useEffect(() => {
    if (questions.length === 0) return;
    const id = setInterval(() => {
      setPromptIndex((i) => (i + 1) % questions.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-full p-6 bg-[radial-gradient(circle_at_center,#111111_0%,#0a0a0a_100%)] animate-[screenOn_0.6s_ease-out]">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(51,255,0,0.1) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="relative text-center max-w-sm animate-[flicker_4s_infinite]">
        <h1 className="font-terminal-heading text-7xl text-terminal-green mb-1 animate-[breathe_5s_ease-in-out_infinite]">
          SOC_OPS<span className="animate-[blink_1s_step-end_infinite]">_</span>
        </h1>
        <p className="text-lg text-terminal-dim mb-8 font-terminal-heading tracking-wide">// social bingo terminal</p>

        <div className="mb-8 text-left" aria-live="polite">
          <div className="font-terminal-heading text-terminal-dim text-sm mb-1">SAMPLE_PROMPT &gt;</div>
          <div
            key={promptIndex}
            className="font-terminal text-xl text-terminal-green animate-[promptFade_3s_ease-in-out_forwards]"
          >
            {questions[promptIndex]}
          </div>
        </div>

        <div className="text-terminal-dim font-terminal-heading text-sm mb-6 tracking-wider">
          ════════════════════════
        </div>

        <p className="text-terminal-dim font-terminal text-lg mb-8">
          // find matches. tap squares. get 5 in a row.
        </p>

        <button
          onClick={onStart}
          className="w-full bg-terminal-green text-terminal-bg font-terminal-heading py-4 px-8 text-xl tracking-widest transition-all duration-150 active:bg-accent-light hover:[box-shadow:0_0_20px_#33ff00,0_0_40px_#33ff0033]"
        >
          &gt; START_GAME
        </button>
      </div>
    </div>
  );
}
