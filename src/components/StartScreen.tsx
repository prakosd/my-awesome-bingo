import { useState, useEffect } from 'react';
import type { GameMode } from '../types';
import { questions } from '../data/questions';

interface StartScreenProps {
  onStart: (mode: GameMode, target?: number) => void;
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
  const [selectedMode, setSelectedMode] = useState<'bingo' | 'scavenger' | null>(null);
  const [scavengerTarget, setScavengerTarget] = useState(12);
  const [customInput, setCustomInput] = useState('12');

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
              {selectedMode === 'scavenger' ? (
                <>
                  <div><span className="text-terminal-green">MODE:</span><span className="text-terminal-dim"> SCAVENGER</span></div>
                  <div><span className="text-terminal-green">ITEMS:</span><span className="text-terminal-dim"> 24</span></div>
                  <div><span className="text-terminal-green">WIN_COND:</span><span className="text-terminal-dim"> FIRST_N</span></div>
                  <div><span className="text-terminal-green">TARGET:</span><span className="text-terminal-dim"> {scavengerTarget}</span></div>
                </>
              ) : (
                <>
                  <div><span className="text-terminal-green">PROMPTS:</span><span className="text-terminal-dim"> {questions.length}</span></div>
                  <div><span className="text-terminal-green">GRID:</span><span className="text-terminal-dim"> 5x5</span></div>
                  <div><span className="text-terminal-green">WIN_COND:</span><span className="text-terminal-dim"> 5_IN_ROW</span></div>
                </>
              )}
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

        {/* Mode selection */}
        <div className="p-3">
          <div className="flex gap-4 mt-4">
            <button
              className="bg-terminal-green text-terminal-bg font-terminal-heading px-4 py-2 hover:shadow-[0_0_20px_#33ff00] transition-shadow cursor-pointer"
              onClick={() => onStart('bingo')}
            >
              &gt; BINGO_MODE
            </button>
            <button
              className={`font-terminal-heading px-4 py-2 transition-all cursor-pointer ${
                selectedMode === 'scavenger'
                  ? 'bg-terminal-green text-terminal-bg hover:shadow-[0_0_20px_#33ff00]'
                  : 'border border-terminal-green text-terminal-green bg-transparent hover:shadow-[0_0_10px_#33ff00]'
              }`}
              onClick={() => setSelectedMode('scavenger')}
            >
              &gt; SCAVENGER_MODE
            </button>
          </div>

          {selectedMode === 'scavenger' && (
            <div className="mt-4 space-y-2 border border-terminal-dark bg-terminal-surface p-4">
              <p className="font-terminal text-terminal-dim text-sm">// SET_TARGET: find first N of 24</p>
              <div className="flex items-center gap-2 flex-wrap">
                {[6, 12, 18, 24].map((n) => (
                  <button
                    key={n}
                    className={`font-terminal-heading px-3 py-1 text-sm transition-all cursor-pointer ${
                      scavengerTarget === n
                        ? 'bg-terminal-green text-terminal-bg'
                        : 'border border-terminal-dim text-terminal-dim hover:border-terminal-green hover:text-terminal-green'
                    }`}
                    onClick={() => { setScavengerTarget(n); setCustomInput(String(n)); }}
                  >
                    [{String(n).padStart(2, '0')}]
                  </button>
                ))}
                <span className="font-terminal text-terminal-dim text-xs">// OR</span>
                <input
                  type="number"
                  min={1}
                  max={24}
                  value={customInput}
                  className="border border-terminal-dim bg-terminal-surface text-terminal-green font-terminal w-16 text-center p-1 text-sm"
                  onChange={(e) => setCustomInput(e.target.value)}
                  onBlur={() => {
                    const n = Math.min(24, Math.max(1, parseInt(customInput, 10) || 1));
                    setScavengerTarget(n);
                    setCustomInput(String(n));
                  }}
                />
              </div>
              <p className="font-terminal text-terminal-dim text-sm">TARGET: {scavengerTarget}</p>
              <button
                className="bg-terminal-green text-terminal-bg font-terminal-heading px-6 py-2 hover:shadow-[0_0_20px_#33ff00] transition-shadow cursor-pointer"
                onClick={() => onStart('scavenger', scavengerTarget)}
              >
                &gt; START_HUNT
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

