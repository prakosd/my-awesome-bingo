import type { ScavengerItem, ScavengerHuntPhase } from '../types';
import { ScavengerCompleteModal } from './ScavengerCompleteModal';

interface ScavengerScreenProps {
  items: ScavengerItem[];
  target: number;
  gameState: ScavengerHuntPhase;
  checkedCount: number;
  showCompleteModal: boolean;
  onToggle: (id: number) => void;
  onReset: () => void;
  onDismissModal: () => void;
}

export function ScavengerScreen({
  items,
  target,
  gameState,
  checkedCount,
  showCompleteModal,
  onToggle,
  onReset,
  onDismissModal,
}: ScavengerScreenProps) {
  const filled = Math.min(Math.round((checkedCount / Math.max(target, 1)) * 20), 20);
  const fillWidth = Math.min((checkedCount / Math.max(target, 1)) * 100, 100);

  return (
    <div className="flex flex-col h-screen bg-terminal-bg text-terminal-green">
      {/* Header */}
      <header className="flex items-center gap-4 p-4 border-b border-terminal-dark">
        <button
          className="text-terminal-dim font-terminal-heading hover:text-terminal-green transition-colors cursor-pointer text-sm"
          onClick={onReset}
        >
          &lt; BACK
        </button>
        <h1 className="font-terminal-heading text-terminal-green text-xl [text-shadow:0_0_8px_#33ff00]">
          SCAVENGER_HUNT.EXE
        </h1>
      </header>

      {/* Progress section */}
      <div className="p-4 border-b border-terminal-dark space-y-2">
        <p className="font-terminal text-terminal-dim text-sm">// find first {target} items</p>
        <div className="font-terminal-heading text-terminal-green">
          PROGRESS: {checkedCount}/{target}
        </div>
        <div className="font-terminal text-terminal-green text-sm">
          [{'\u2588'.repeat(filled)}{'\u2591'.repeat(20 - filled)}]
        </div>
        <div className="w-full border border-terminal-dark bg-terminal-surface h-2">
          <div
            className="bg-terminal-green h-full transition-[width] duration-300"
            style={{ width: `${fillWidth}%` }}
          />
        </div>
      </div>

      {/* Win banner */}
      {gameState === 'complete' && (
        <div
          className="p-3 text-center font-terminal-heading text-bingo"
          style={{ animation: 'glowPulse 1s ease-in-out infinite', textShadow: '0 0 10px #ffcc00' }}
        >
          *** HUNT COMPLETE &mdash; {target} FOUND ***
        </div>
      )}

      {/* Checklist */}
      <div className="flex-1 overflow-y-auto">
        <ul className="divide-y divide-terminal-dark">
          {items.map((item) => (
            <li key={item.id}>
              <button
                className="flex items-start gap-3 w-full text-left p-3 hover:bg-terminal-dark transition-colors cursor-pointer"
                aria-pressed={item.isChecked}
                onClick={() => onToggle(item.id)}
              >
                <span
                  className={`font-terminal font-bold shrink-0 ${item.isChecked ? 'text-terminal-green' : 'text-terminal-dim'}`}
                  style={item.isChecked ? { textShadow: '0 0 6px #33ff00' } : undefined}
                >
                  {item.isChecked ? '[X]' : '[ ]'}
                </span>
                <span className={`font-terminal text-sm flex-1 ${item.isChecked ? 'text-terminal-green' : 'text-terminal-dim'}`}>
                  {item.text}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {showCompleteModal && (
        <ScavengerCompleteModal target={target} onDismiss={onDismissModal} />
      )}
    </div>
  );
}
