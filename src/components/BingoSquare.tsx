import type { BingoSquareData } from '../types';

interface BingoSquareProps {
  square: BingoSquareData;
  isWinning: boolean;
  onClick: () => void;
}

export function BingoSquare({ square, isWinning, onClick }: BingoSquareProps) {
  const baseClasses =
    'relative flex items-center justify-center p-1 text-center border transition-all duration-150 select-none min-h-[60px] text-xs leading-tight font-terminal';

  const stateClasses = square.isMarked
    ? isWinning
      ? 'bg-terminal-dark border-bingo text-bingo animate-[glowPulse_1.5s_ease-in-out_infinite] [text-shadow:0_0_8px_#ffcc00]'
      : 'bg-terminal-dark border-terminal-green text-terminal-green [text-shadow:0_0_6px_#33ff00]'
    : 'bg-terminal-surface border-terminal-dark text-terminal-dim hover:[box-shadow:0_0_8px_#33ff0044] active:text-terminal-green active:border-terminal-dim';

  const freeSpaceClasses = square.isFreeSpace
    ? 'font-terminal-heading text-sm text-terminal-green [text-shadow:0_0_6px_#33ff00]'
    : '';

  return (
    <button
      onClick={onClick}
      disabled={square.isFreeSpace}
      className={`${baseClasses} ${stateClasses} ${freeSpaceClasses}`}
      aria-pressed={square.isMarked}
      aria-label={square.isFreeSpace ? 'Free space' : square.text}
    >
      <span className="wrap-break-word hyphens-auto">{square.text}</span>
      {square.isMarked && !square.isFreeSpace && (
        <span className="absolute top-0.5 right-0.5 text-terminal-green text-[10px] font-terminal-heading">[X]</span>
      )}
    </button>
  );
}
