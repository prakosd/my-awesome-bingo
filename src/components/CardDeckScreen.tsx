import { useState, useRef, useCallback } from 'react';
import type { CardDeckState } from '../hooks/useCardDeck';

// ASCII card back art
const CARD_BACK_LINES = [
  '╔═══════════════════╗',
  '║  ? ? ? ? ? ? ? ?  ║',
  '║  ? ? ? ? ? ? ? ?  ║',
  '║  ? ? ? ? ? ? ? ?  ║',
  '║                   ║',
  '║   CARD_DECK v1.0  ║',
  '║                   ║',
  '║  ? ? ? ? ? ? ? ?  ║',
  '║  ? ? ? ? ? ? ? ?  ║',
  '║  ? ? ? ? ? ? ? ?  ║',
  '╚═══════════════════╝',
];

const SWIPE_THRESHOLD = 72; // px to trigger a swipe

interface CardDeckScreenProps extends CardDeckState {
  onBack: () => void;
}

export function CardDeckScreen({
  deck,
  drawnIndex,
  isFlipped,
  isAnimating,
  swipeDir,
  successCount,
  failCount,
  drawCard,
  swipeCard,
  resetDeck,
  onBack,
}: CardDeckScreenProps) {
  const remaining = deck.length - drawnIndex - 1;
  const hasDeck = drawnIndex < deck.length - 1;
  const currentQuestion = drawnIndex >= 0 ? deck[drawnIndex] : null;
  const deckExhausted = drawnIndex >= deck.length - 1 && drawnIndex >= 0;

  // Drag state
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<number | null>(null);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (isAnimating || !isFlipped) return;
    // Don't start dragging if the user tapped a button
    if ((e.target as HTMLElement).closest('button')) return;
    dragStart.current = e.clientX;
    setIsDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [isAnimating, isFlipped]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging || dragStart.current === null) return;
    setDragX(e.clientX - dragStart.current);
  }, [isDragging]);

  const handlePointerUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    const d = dragX;
    setDragX(0);
    dragStart.current = null;
    if (d > SWIPE_THRESHOLD) swipeCard('right');
    else if (d < -SWIPE_THRESHOLD) swipeCard('left');
  }, [isDragging, dragX, swipeCard]);

  const swipeRatio = Math.min(1, Math.abs(dragX) / SWIPE_THRESHOLD);
  const dragDir = dragX > 0 ? 'right' : dragX < 0 ? 'left' : null;

  const cardStyle: React.CSSProperties = isDragging && dragX !== 0
    ? { transform: `translateX(${dragX}px) rotate(${dragX * 0.07}deg)`, transition: 'none', cursor: 'grabbing' }
    : {};

  const swipeAnimClass =
    swipeDir === 'left'  ? 'animate-[cardSwipeLeft_0.35s_ease-in_forwards]' :
    swipeDir === 'right' ? 'animate-[cardSwipeRight_0.35s_ease-in_forwards]' :
    '';

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-4 bg-terminal-bg animate-[screenOn_0.6s_ease-out]">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="border border-terminal-dim p-3 mb-3 text-center animate-[flicker_4s_infinite]">
          <h1 className="font-terminal-heading text-3xl text-terminal-green [text-shadow:0_0_10px_#33ff00]">
            CARD_DECK<span className="animate-[blink_1s_step-end_infinite]">_</span>
          </h1>
          <p className="text-xs text-terminal-dim font-terminal-heading tracking-wide mt-0.5">
            // swipe or tap · left=fail · right=success
          </p>
        </div>

        {/* Score + deck counter */}
        <div className="border border-terminal-dim bg-terminal-surface px-3 py-2 mb-3 grid grid-cols-3 text-sm font-terminal-heading">
          <span className="text-red-500/80 [text-shadow:0_0_6px_#ef444488]">
            [✗] <span className="text-terminal-dim">{String(failCount).padStart(2, '0')}</span>
          </span>
          <span className="text-center text-terminal-dim">
            {deckExhausted ? '// EMPTY' : `${Math.max(0, remaining)} LEFT`}
          </span>
          <span className="text-right text-terminal-green [text-shadow:0_0_6px_#33ff0066]">
            <span className="text-terminal-dim">{String(successCount).padStart(2, '0')}</span> [✓]
          </span>
        </div>

        {/* Card area */}
        <div className="relative mb-4">

          {/* Deck stack depth */}
          {hasDeck && !deckExhausted && (
            <>
              <div className="absolute top-2 left-2 right-2 border border-terminal-dark bg-terminal-surface h-full opacity-40" />
              <div className="absolute top-1 left-1 right-1 border border-terminal-dark bg-terminal-surface h-full opacity-60" />
            </>
          )}

          {/* The card */}
          {!isFlipped || currentQuestion === null ? (
            <button
              disabled={isAnimating || deckExhausted}
              onClick={drawCard}
              className={`relative w-full border-2 border-terminal-green bg-terminal-surface p-5 cursor-pointer text-left transition-all
                ${isAnimating ? 'animate-[cardFlipOut_0.3s_ease-in-out]' : 'animate-[cardPulse_2s_ease-in-out_infinite]'}
                ${deckExhausted ? 'opacity-30 cursor-not-allowed' : 'hover:shadow-[0_0_24px_#33ff00]'}
              `}
              aria-label="Draw a card"
            >
              <pre className="font-terminal text-terminal-green text-center text-xs leading-tight [text-shadow:0_0_6px_#33ff0066] select-none">
                {CARD_BACK_LINES.join('\n')}
              </pre>
              {!deckExhausted && (
                <p className="text-center font-terminal-heading text-terminal-dim text-xs mt-2 tracking-widest">&gt; TAP_TO_DRAW</p>
              )}
              {deckExhausted && (
                <p className="text-center font-terminal-heading text-bingo text-xs mt-2 tracking-widest [text-shadow:0_0_8px_#ffcc00]">
                  *** DECK_EXHAUSTED ***
                </p>
              )}
            </button>
          ) : (
            /* Card front — swipeable */
            <div
              className={`relative w-full border-2 bg-terminal-surface p-5 select-none touch-none
                ${swipeAnimClass}
                ${!swipeDir ? 'animate-[cardFlipIn_0.5s_ease-out]' : ''}
                ${isDragging
                  ? dragDir === 'right' ? 'border-terminal-green' : 'border-red-500/70'
                  : 'border-terminal-green'
                }
              `}
              style={cardStyle}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              {/* Success overlay */}
              {isDragging && swipeRatio > 0.25 && dragDir === 'right' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                  style={{ opacity: Math.min(1, swipeRatio * 1.2) }}>
                  <span className="font-terminal-heading text-2xl text-terminal-green [text-shadow:0_0_16px_#33ff00] border-2 border-terminal-green px-4 py-1 -rotate-12">
                    [✓] SUCCESS
                  </span>
                </div>
              )}
              {/* Fail overlay */}
              {isDragging && swipeRatio > 0.25 && dragDir === 'left' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                  style={{ opacity: Math.min(1, swipeRatio * 1.2) }}>
                  <span className="font-terminal-heading text-2xl text-red-500 [text-shadow:0_0_16px_#ef4444] border-2 border-red-500/70 px-4 py-1 rotate-12">
                    [✗] FAIL
                  </span>
                </div>
              )}

              {/* Card header */}
              <div className="flex justify-between items-start mb-4">
                <span className="font-terminal-heading text-xs text-terminal-dim tracking-widest">
                  [{String(drawnIndex + 1).padStart(2, '0')}]
                </span>
                <span className="font-terminal-heading text-xs text-terminal-dim tracking-widest">SOC_PROMPT</span>
              </div>

              <div className="border-t border-terminal-dim mb-4" />

              {/* Question */}
              <p className="font-terminal text-xl text-terminal-green [text-shadow:0_0_8px_#33ff0099] leading-snug min-h-20 flex items-center">
                &gt;&nbsp;{currentQuestion}
              </p>

              <div className="border-t border-terminal-dim mt-4 mb-3" />

              {/* FAIL / SUCCESS buttons */}
              <div className="flex gap-2">
                <button
                  disabled={isAnimating}
                  onClick={() => swipeCard('left')}
                  className="flex-1 font-terminal-heading text-sm py-2 border border-red-500/60 text-red-500/80 hover:border-red-400 hover:text-red-400 hover:shadow-[0_0_12px_#ef444466] transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ← [✗] FAIL
                </button>
                <button
                  disabled={isAnimating}
                  onClick={() => swipeCard('right')}
                  className="flex-1 font-terminal-heading text-sm py-2 bg-terminal-green text-terminal-bg hover:shadow-[0_0_16px_#33ff00] transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  [✓] SUCCESS →
                </button>
              </div>

              <p className="text-center text-terminal-dim font-terminal-heading text-xs mt-2 tracking-widest opacity-40">
                // or drag left / right
              </p>
            </div>
          )}
        </div>

        {/* Session results when deck exhausted */}
        {deckExhausted && (successCount > 0 || failCount > 0) && (
          <div className="border border-terminal-dim bg-terminal-surface px-3 py-3 mb-3 font-terminal-heading text-sm space-y-1">
            <p className="text-terminal-dim text-xs tracking-widest">// SESSION_RESULTS</p>
            <div className="flex justify-between">
              <span className="text-terminal-green">[✓] <span className="text-terminal-dim">{successCount}</span></span>
              <span className="text-red-500/80">[✗] <span className="text-terminal-dim">{failCount}</span></span>
            </div>
            <div className="border-t border-terminal-dark pt-1">
              <span className="text-terminal-dim text-xs">
                SUCCESS_RATE:{' '}
                <span className={successCount >= failCount ? 'text-terminal-green' : 'text-red-500/80'}>
                  {Math.round((successCount / (successCount + failCount)) * 100)}%
                </span>
              </span>
            </div>
          </div>
        )}

        {/* Bottom controls */}
        <div className="flex gap-2">
          <button
            onClick={() => { resetDeck(); }}
            className="font-terminal-heading text-sm px-4 py-2 border border-terminal-dim text-terminal-dim hover:border-terminal-green hover:text-terminal-green transition-all cursor-pointer"
          >
            &gt; SHUFFLE_DECK
          </button>
          <button
            onClick={onBack}
            className="font-terminal-heading text-sm px-4 py-2 border border-terminal-dim text-terminal-dim hover:border-terminal-green hover:text-terminal-green transition-all cursor-pointer ml-auto"
          >
            &lt; BACK
          </button>
        </div>

      </div>
    </div>
  );
}
