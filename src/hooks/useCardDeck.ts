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

export type SwipeDir = 'left' | 'right' | null;

export interface CardDeckState {
  deck: string[];
  drawnIndex: number;
  isFlipped: boolean;
  isAnimating: boolean;
  swipeDir: SwipeDir;
  successCount: number;
  failCount: number;
  drawCard: () => void;
  swipeCard: (dir: 'left' | 'right') => void;
  resetDeck: () => void;
}

export function useCardDeck(): CardDeckState {
  const [deck, setDeck] = useState<string[]>(() => shuffle(questions));
  const [drawnIndex, setDrawnIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeDir, setSwipeDir] = useState<SwipeDir>(null);
  const [successCount, setSuccessCount] = useState(0);
  const [failCount, setFailCount] = useState(0);

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

  const swipeCard = useCallback((dir: 'left' | 'right') => {
    if (isAnimating || !isFlipped) return;
    if (dir === 'right') setSuccessCount((c) => c + 1);
    else setFailCount((c) => c + 1);

    setIsAnimating(true);
    setSwipeDir(dir);

    // After swipe-out animation, load next card
    setTimeout(() => {
      setSwipeDir(null);
      setIsFlipped(false);
      const nextIndex = drawnIndex + 1;
      if (nextIndex < deck.length) {
        setDrawnIndex(nextIndex);
        setIsFlipped(true);
        setTimeout(() => setIsAnimating(false), 450);
      } else {
        setIsAnimating(false);
      }
    }, 350);
  }, [deck.length, drawnIndex, isAnimating, isFlipped]);

  const resetDeck = useCallback(() => {
    setIsFlipped(false);
    setIsAnimating(false);
    setSwipeDir(null);
    setTimeout(() => {
      setDeck(shuffle(questions));
      setDrawnIndex(0);
      setIsFlipped(true);
      setSuccessCount(0);
      setFailCount(0);
    }, 300);
  }, []);

  return { deck, drawnIndex, isFlipped, isAnimating, swipeDir, successCount, failCount, drawCard, swipeCard, resetDeck };
}
