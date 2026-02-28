import { useState, useEffect } from 'react';
import { questions } from '../data/questions';

interface StartScreenProps {
  onStart: () => void;
}

const APP_VERSION = 'v2.1.0';

const GRID_ROWS = [
  '┌─┬─┬─┬─┬─┐',
  '│ │ │ │ │ │',
  '├─┼─┼─┼─┼─┤',
  '│ │ │ │ │ │',
  '├─┼─┼─┼─┼─┤',
  '│ │ │★│ │ │',
  '├─┼─┼─┼─┼─┤',
  '│ │ │ │ │ │',
  '├─┼─┼─┼─┼─┤',
  '│ │ │ │ │ │',
  '└─┴─┴─┴─┴─┘',
];

export function StartScreen({ onStart }: StartScreenProps) {
  const [promptIdx, setPromptIdx] = useState(0);
  const [promptVisible, setPromptVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setPromptVisible(false);
      setTimeout(() => {
        setPromptIdx((i) => (i + 1) % questions.length);
        setPromptVisible(true);
      }, 350);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-4 bg-terminal-bg animate-[screenOn_0.6s_ease-out]">
      <div className="w-full max-w-sm border border-terminal-dim animate-[flicker_4s_infinite]">

        {/* Header */}
        <div className="border-b border-terminal-dim p-3 text-center">
          <h1 className="font-terminal-heading text-4xl text-terminal-green [text-shadow:0_0_10px_#33ff00,0_0_30px_#33ff0044]">
            SOC_OPS<span className="animate-[blink_1s_step-end_infinite]">_</span>
            <span className="text-terminal-dim text-xl ml-2">{APP_VERSION}</span>
          </h1>
          <p className="text-sm text-terminal-dim font-terminal-heading tracking-wide">// social bingo terminal</p>
        </div>

        {/* Dashboard panels */}
        <div className="flex border-b border-terminal-dim">

          {/* Grid preview */}
          <div className="p-3 border-r border-terminal-dim">
            <div className="text-xs text-terminal-dim font-terminal-heading mb-1 tracking-wider">GRID_PREVIEW</div>
            <pre className="text-terminal-green font-terminal text-sm leading-tight [text-shadow:0_0_6px_#33ff0066]">{GRID_ROWS.join('\n')}</pre>
          </div>

          {/* System info + sample prompt */}
          <div className="flex-1 p-3">
            <div className="text-xs text-terminal-dim font-terminal-heading mb-1 tracking-wider">SYS_INFO</div>
            <div className="font-terminal text-base space-y-0.5 mb-3">
              <div><span className="text-terminal-green">STATUS:</span><span className="text-terminal-dim"> RDY</span></div>
              <div><span className="text-terminal-green">PROMPTS:</span><span className="text-terminal-dim"> {questions.length}</span></div>
              <div><span className="text-terminal-green">GRID:</span><span className="text-terminal-dim"> 5x5</span></div>
              <div><span className="text-terminal-green">WIN_COND:</span><span className="text-terminal-dim"> 5_IN_ROW</span></div>
            </div>
            <div className="text-xs text-terminal-dim font-terminal-heading mb-1 tracking-wider">SAMPLE_PROMPT</div>
            <div
              className="font-terminal text-sm text-terminal-green [text-shadow:0_0_6px_#33ff0066]"
              style={{ animation: promptVisible ? 'none' : 'promptCycle 0.35s ease-in-out forwards' }}
            >
              &gt; &quot;{questions[promptIdx]}&quot;
            </div>
          </div>

        </div>

        {/* Start button */}
        <div className="p-3">
          <button
            onClick={onStart}
            className="w-full bg-terminal-green text-terminal-bg font-terminal-heading py-3 px-8 text-xl tracking-widest transition-all duration-150 active:bg-accent-light hover:[box-shadow:0_0_20px_#33ff00,0_0_40px_#33ff0033]"
          >
            &gt; START_GAME
          </button>
        </div>

      </div>
    </div>
  );
}

