import type { BingoSquareData } from '../types';
import { BingoBoard } from './BingoBoard';

interface GameScreenProps {
  board: BingoSquareData[];
  winningSquareIds: Set<number>;
  hasBingo: boolean;
  onSquareClick: (squareId: number) => void;
  onReset: () => void;
}

export function GameScreen({
  board,
  winningSquareIds,
  hasBingo,
  onSquareClick,
  onReset,
}: GameScreenProps) {
  return (
    <div className="flex flex-col min-h-full bg-terminal-bg animate-[flicker_4s_infinite]">
      {/* Header */}
      <header className="flex items-center justify-between p-3 bg-terminal-surface border-b border-terminal-dark">
        <button
          onClick={onReset}
          className="text-terminal-dim font-terminal-heading text-sm px-3 py-1.5 tracking-wider transition-colors active:text-terminal-green"
        >
          &lt; BACK
        </button>
        <h1 className="font-terminal-heading text-terminal-green tracking-wider [text-shadow:0_0_8px_#33ff00]">SOC_OPS</h1>
        <div className="w-16"></div>
      </header>

      {/* Instructions */}
      <p className="text-center text-terminal-dim text-base py-2 px-4 font-terminal">
        // tap a square when you find a match
      </p>

      {/* Bingo indicator */}
      {hasBingo && (
        <div className="bg-terminal-dark text-bingo text-center py-2 font-terminal-heading text-sm tracking-widest animate-[glowPulse_1.5s_ease-in-out_infinite] [text-shadow:0_0_10px_#ffcc00]">
          *** BINGO — LINE COMPLETE ***
        </div>
      )}

      {/* Board */}
      <div className="flex-1 flex items-center justify-center p-3">
        <BingoBoard
          board={board}
          winningSquareIds={winningSquareIds}
          onSquareClick={onSquareClick}
        />
      </div>
    </div>
  );
}
