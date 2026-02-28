import { useState, useCallback, useMemo, useEffect } from 'react';
import type { ScavengerItem, ScavengerHuntPhase } from '../types';
import { generateChecklist } from '../utils/bingoLogic';

export interface ScavengerGameState {
  gameState: ScavengerHuntPhase;
  items: ScavengerItem[];
  target: number;
  showCompleteModal: boolean;
  checkedCount: number;
}

export interface ScavengerGameActions {
  startGame: (requestedTarget: number) => void;
  toggleItem: (id: number) => void;
  resetGame: () => void;
  dismissModal: () => void;
}

const STORAGE_KEY = 'scavenger-game-state';
const STORAGE_VERSION = 1;
const MAX_ITEMS = 24;
const MIN_TARGET = 1;

interface StoredData {
  version: number;
  gameState: ScavengerHuntPhase;
  items: ScavengerItem[];
  target: number;
}

function validateStoredData(data: unknown): data is StoredData {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  if (obj.version !== STORAGE_VERSION) return false;
  if (
    typeof obj.gameState !== 'string' ||
    !['start', 'playing', 'complete'].includes(obj.gameState)
  ) return false;
  if (!Array.isArray(obj.items)) return false;
  if (typeof obj.target !== 'number') return false;
  return true;
}

function loadGameState(): Pick<ScavengerGameState, 'gameState' | 'items' | 'target'> | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    const parsed: unknown = JSON.parse(saved);
    if (validateStoredData(parsed)) {
      return {
        gameState: parsed.gameState,
        items: parsed.items,
        target: parsed.target,
      };
    }
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to load scavenger hunt state:', error);
    if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY);
  }
  return null;
}

const saveGameState = (gameState: ScavengerHuntPhase, items: ScavengerItem[], target: number): void => {
  if (typeof window === 'undefined') return;
  try {
    const data: StoredData = { version: STORAGE_VERSION, gameState, items, target };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save scavenger hunt state:', error);
  }
};

export function useScavengerHunt(): ScavengerGameState & ScavengerGameActions {
  const loadedState = useMemo(() => loadGameState(), []);

  const [gameState, setGameState] = useState<ScavengerHuntPhase>(
    () => loadedState?.gameState ?? 'start'
  );
  const [items, setItems] = useState<ScavengerItem[]>(
    () => loadedState?.items ?? []
  );
  const [target, setTarget] = useState<number>(
    () => loadedState?.target ?? 0
  );
  // showCompleteModal is always false on load — the modal was already dismissed
  // before the state was persisted, so we never restore it as true.
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const checkedCount = useMemo(() => items.filter((i) => i.isChecked).length, [items]);

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    saveGameState(gameState, items, target);
  }, [gameState, items, target]);

  const startGame = useCallback((requestedTarget: number) => {
    const clamped = Math.min(MAX_ITEMS, Math.max(MIN_TARGET, requestedTarget));
    setTarget(clamped);
    setItems(generateChecklist());
    setGameState('playing');
    setShowCompleteModal(false);
  }, []);

  const toggleItem = useCallback((id: number) => {
    setItems((current) => {
      const newItems = current.map((item) =>
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      );
      const newCheckedCount = newItems.filter((i) => i.isChecked).length;
      if (newCheckedCount >= target && target > 0) {
        queueMicrotask(() => {
          setGameState('complete');
          setShowCompleteModal(true);
        });
      }
      return newItems;
    });
  }, [target]);

  const resetGame = useCallback(() => {
    setGameState('start');
    setItems([]);
    setTarget(0);
    setShowCompleteModal(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const dismissModal = useCallback(() => {
    setShowCompleteModal(false);
  }, []);

  return {
    gameState,
    items,
    target,
    showCompleteModal,
    checkedCount,
    startGame,
    toggleItem,
    resetGame,
    dismissModal,
  };
}
