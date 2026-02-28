import { useState, useCallback } from 'react';
import { questions } from '../data/questions';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export interface CardDeckState {
  deck: string[];
  drawnIndex: number;
  isFlipped: boolean;
  isAnimating: boolean;
  drawCard: () => void;
  resetDeck: () => void;
}

export function useCardDeck(): CardDeckState {
  const [deck, setDeck] = useState<string[]>(() => shuffle(questions));
  const [drawnIndex, setDrawnIndex] = useState<number>(-1);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const drawCard = useCallback(() => {
    if (isAnimating) return;

    const nextIndex = drawnIndex + 1;
    if (nextIndex >= deck.length) return;

    // Flip back first if a card is showing
    if (isFlipped) {
      setIsAnimating(true);
      setIsFlipped(false);
      setTimeout(() => {
        setDrawnIndex(nextIndex);
        setIsFlipped(true);
        setTimeout(() => setIsAnimating(false), 500);
      }, 300);
    } else {
      setIsAnimating(true);
      setDrawnIndex(nextIndex);
      setIsFlipped(true);
      setTimeout(() => setIsAnimating(false), 500);
    }
  }, [deck.length, drawnIndex, isAnimating, isFlipped]);

  const resetDeck = useCallback(() => {
    setIsFlipped(false);
    setIsAnimating(false);
    setTimeout(() => {
      setDeck(shuffle(questions));
      setDrawnIndex(-1);
    }, 300);
  }, []);

  return { deck, drawnIndex, isFlipped, isAnimating, drawCard, resetDeck };
}
