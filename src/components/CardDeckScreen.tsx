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

interface CardDeckScreenProps extends CardDeckState {
  onBack: () => void;
}

export function CardDeckScreen({
  deck,
  drawnIndex,
  isFlipped,
  isAnimating,
  drawCard,
  resetDeck,
  onBack,
}: CardDeckScreenProps) {
  const remaining = deck.length - drawnIndex - 1;
  const hasDeck = drawnIndex < deck.length - 1;
  const currentQuestion = drawnIndex >= 0 ? deck[drawnIndex] : null;
  const deckExhausted = drawnIndex >= deck.length - 1 && drawnIndex >= 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-4 bg-terminal-bg animate-[screenOn_0.6s_ease-out]">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="border border-terminal-dim p-3 mb-3 text-center animate-[flicker_4s_infinite]">
          <h1 className="font-terminal-heading text-3xl text-terminal-green [text-shadow:0_0_10px_#33ff00]">
            CARD_DECK<span className="animate-[blink_1s_step-end_infinite]">_</span>
          </h1>
          <p className="text-xs text-terminal-dim font-terminal-heading tracking-wide mt-0.5">
            // tap to draw · pass to next player
          </p>
        </div>

        {/* Deck counter row */}
        <div className="border border-terminal-dim bg-terminal-surface px-3 py-2 mb-3 flex justify-between text-sm font-terminal-heading">
          <span className="text-terminal-green">
            DECK: <span className="text-terminal-dim">{Math.max(0, remaining)} / {deck.length}</span>
          </span>
          <span className="text-terminal-dim">
            {deckExhausted ? '// DECK_EMPTY' : drawnIndex >= 0 ? `// CARD_${String(drawnIndex + 1).padStart(2, '0')}` : '// READY'}
          </span>
        </div>

        {/* Card area */}
        <div className="relative mb-4">

          {/* Deck stack shadow (visual depth) */}
          {hasDeck && !deckExhausted && (
            <>
              <div className="absolute top-2 left-2 right-2 border border-terminal-dark bg-terminal-surface h-full opacity-40" />
              <div className="absolute top-1 left-1 right-1 border border-terminal-dark bg-terminal-surface h-full opacity-60" />
            </>
          )}

          {/* The card itself */}
          {!isFlipped || currentQuestion === null ? (
            /* Card back — tap to flip */
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
                <p className="text-center font-terminal-heading text-terminal-dim text-xs mt-2 tracking-widest">
                  &gt; TAP_TO_DRAW
                </p>
              )}
              {deckExhausted && (
                <p className="text-center font-terminal-heading text-bingo text-xs mt-2 tracking-widest [text-shadow:0_0_8px_#ffcc00]">
                  *** DECK_EXHAUSTED ***
                </p>
              )}
            </button>
          ) : (
            /* Card front — shows the question */
            <div
              className={`relative w-full border-2 border-terminal-green bg-terminal-surface p-5
                ${isAnimating ? 'animate-[cardFlipIn_0.5s_ease-out]' : 'animate-[cardFlipIn_0.5s_ease-out]'}
              `}
            >
              {/* Card number badge */}
              <div className="flex justify-between items-start mb-4">
                <span className="font-terminal-heading text-xs text-terminal-dim tracking-widest">
                  [{String(drawnIndex + 1).padStart(2, '0')}]
                </span>
                <span className="font-terminal-heading text-xs text-terminal-dim tracking-widest">
                  SOC_PROMPT
                </span>
              </div>

              {/* Divider */}
              <div className="border-t border-terminal-dim mb-4" />

              {/* Question text */}
              <p className="font-terminal text-xl text-terminal-green [text-shadow:0_0_8px_#33ff0099] leading-snug min-h-20 flex items-center">
                &gt;&nbsp;{currentQuestion}
              </p>

              {/* Bottom divider */}
              <div className="border-t border-terminal-dim mt-4 mb-3" />

              {/* Action row */}
              <div className="flex gap-2">
                <button
                  disabled={isAnimating || !hasDeck}
                  onClick={drawCard}
                  className={`flex-1 font-terminal-heading text-sm py-2 transition-all cursor-pointer
                    ${hasDeck
                      ? 'bg-terminal-green text-terminal-bg hover:shadow-[0_0_16px_#33ff00]'
                      : 'border border-terminal-dim text-terminal-dim cursor-not-allowed opacity-40'}
                  `}
                >
                  &gt; DRAW_NEXT
                </button>
              </div>
            </div>
          )}
        </div>

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
