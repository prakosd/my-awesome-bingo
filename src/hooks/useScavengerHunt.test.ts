import { renderHook, act } from '@testing-library/react';
import { useScavengerHunt } from '../hooks/useScavengerHunt';

const STORAGE_KEY = 'scavenger-game-state';

describe('useScavengerHunt', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('initial state', () => {
    it('starts in "start" gameState', () => {
      const { result } = renderHook(() => useScavengerHunt());
      expect(result.current.gameState).toBe('start');
    });

    it('items is empty array before startGame', () => {
      const { result } = renderHook(() => useScavengerHunt());
      expect(result.current.items).toEqual([]);
    });

    it('target is 0 before startGame', () => {
      const { result } = renderHook(() => useScavengerHunt());
      expect(result.current.target).toBe(0);
    });

    it('showCompleteModal is false', () => {
      const { result } = renderHook(() => useScavengerHunt());
      expect(result.current.showCompleteModal).toBe(false);
    });

    it('checkedCount is 0', () => {
      const { result } = renderHook(() => useScavengerHunt());
      expect(result.current.checkedCount).toBe(0);
    });
  });

  describe('startGame', () => {
    it('transitions gameState to "playing"', () => {
      const { result } = renderHook(() => useScavengerHunt());
      act(() => {
        result.current.startGame(5);
      });
      expect(result.current.gameState).toBe('playing');
    });

    it('sets target to the provided value', () => {
      const { result } = renderHook(() => useScavengerHunt());
      act(() => {
        result.current.startGame(10);
      });
      expect(result.current.target).toBe(10);
    });

    it('generates 24 items', () => {
      const { result } = renderHook(() => useScavengerHunt());
      act(() => {
        result.current.startGame(5);
      });
      expect(result.current.items).toHaveLength(24);
    });

    it('all items start unchecked', () => {
      const { result } = renderHook(() => useScavengerHunt());
      act(() => {
        result.current.startGame(5);
      });
      result.current.items.forEach((item) => {
        expect(item.isChecked).toBe(false);
      });
    });

    it('clamps target to minimum 1 if 0 or negative is passed', () => {
      const { result } = renderHook(() => useScavengerHunt());
      act(() => {
        result.current.startGame(0);
      });
      expect(result.current.target).toBeGreaterThanOrEqual(1);

      act(() => {
        result.current.resetGame();
      });
      act(() => {
        result.current.startGame(-5);
      });
      expect(result.current.target).toBeGreaterThanOrEqual(1);
    });

    it('clamps target to maximum 24 if > 24 is passed', () => {
      const { result } = renderHook(() => useScavengerHunt());
      act(() => {
        result.current.startGame(30);
      });
      expect(result.current.target).toBeLessThanOrEqual(24);
    });
  });

  describe('toggleItem', () => {
    it('marks an unchecked item as checked', () => {
      const { result } = renderHook(() => useScavengerHunt());
      act(() => {
        result.current.startGame(5);
      });
      const firstId = result.current.items[0].id;
      act(() => {
        result.current.toggleItem(firstId);
      });
      const toggled = result.current.items.find((i) => i.id === firstId);
      expect(toggled?.isChecked).toBe(true);
    });

    it('unmarks a checked item (toggle)', () => {
      const { result } = renderHook(() => useScavengerHunt());
      act(() => {
        result.current.startGame(5);
      });
      const firstId = result.current.items[0].id;
      act(() => {
        result.current.toggleItem(firstId);
      });
      act(() => {
        result.current.toggleItem(firstId);
      });
      const toggled = result.current.items.find((i) => i.id === firstId);
      expect(toggled?.isChecked).toBe(false);
    });

    it('does not affect other items', () => {
      const { result } = renderHook(() => useScavengerHunt());
      act(() => {
        result.current.startGame(5);
      });
      const firstId = result.current.items[0].id;
      const secondId = result.current.items[1].id;
      act(() => {
        result.current.toggleItem(firstId);
      });
      const other = result.current.items.find((i) => i.id === secondId);
      expect(other?.isChecked).toBe(false);
    });

    it('updates checkedCount', () => {
      const { result } = renderHook(() => useScavengerHunt());
      act(() => {
        result.current.startGame(5);
      });
      expect(result.current.checkedCount).toBe(0);
      const firstId = result.current.items[0].id;
      act(() => {
        result.current.toggleItem(firstId);
      });
      expect(result.current.checkedCount).toBe(1);
    });
  });

  describe('win condition', () => {
    it('transitions to "complete" when checkedCount reaches target', () => {
      const { result } = renderHook(() => useScavengerHunt());
      act(() => {
        result.current.startGame(2);
      });
      const [id0, id1] = result.current.items.map((i) => i.id);
      act(() => {
        result.current.toggleItem(id0);
      });
      act(() => {
        result.current.toggleItem(id1);
      });
      expect(result.current.gameState).toBe('complete');
    });

    it('sets showCompleteModal to true when complete', () => {
      const { result } = renderHook(() => useScavengerHunt());
      act(() => {
        result.current.startGame(1);
      });
      const firstId = result.current.items[0].id;
      act(() => {
        result.current.toggleItem(firstId);
      });
      expect(result.current.showCompleteModal).toBe(true);
    });

    it('does not trigger complete if checkedCount < target', () => {
      const { result } = renderHook(() => useScavengerHunt());
      act(() => {
        result.current.startGame(3);
      });
      const firstId = result.current.items[0].id;
      act(() => {
        result.current.toggleItem(firstId);
      });
      expect(result.current.gameState).toBe('playing');
      expect(result.current.showCompleteModal).toBe(false);
    });
  });

  describe('dismissModal', () => {
    it('sets showCompleteModal to false', () => {
      const { result } = renderHook(() => useScavengerHunt());
      act(() => {
        result.current.startGame(1);
      });
      const firstId = result.current.items[0].id;
      act(() => {
        result.current.toggleItem(firstId);
      });
      expect(result.current.showCompleteModal).toBe(true);
      act(() => {
        result.current.dismissModal();
      });
      expect(result.current.showCompleteModal).toBe(false);
    });

    it('gameState remains "complete" after dismissModal', () => {
      const { result } = renderHook(() => useScavengerHunt());
      act(() => {
        result.current.startGame(1);
      });
      const firstId = result.current.items[0].id;
      act(() => {
        result.current.toggleItem(firstId);
      });
      act(() => {
        result.current.dismissModal();
      });
      expect(result.current.gameState).toBe('complete');
    });
  });

  describe('resetGame', () => {
    it('resets gameState to "start"', () => {
      const { result } = renderHook(() => useScavengerHunt());
      act(() => {
        result.current.startGame(5);
      });
      act(() => {
        result.current.resetGame();
      });
      expect(result.current.gameState).toBe('start');
    });

    it('clears items', () => {
      const { result } = renderHook(() => useScavengerHunt());
      act(() => {
        result.current.startGame(5);
      });
      act(() => {
        result.current.resetGame();
      });
      expect(result.current.items).toEqual([]);
    });

    it('resets target to 0', () => {
      const { result } = renderHook(() => useScavengerHunt());
      act(() => {
        result.current.startGame(5);
      });
      act(() => {
        result.current.resetGame();
      });
      expect(result.current.target).toBe(0);
    });

    it('resets showCompleteModal to false', () => {
      const { result } = renderHook(() => useScavengerHunt());
      act(() => {
        result.current.startGame(1);
      });
      const firstId = result.current.items[0].id;
      act(() => {
        result.current.toggleItem(firstId);
      });
      expect(result.current.showCompleteModal).toBe(true);
      act(() => {
        result.current.resetGame();
      });
      expect(result.current.showCompleteModal).toBe(false);
    });
  });

  describe('localStorage persistence', () => {
    it('saves state to localStorage key "scavenger-game-state" after startGame', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
      const { result } = renderHook(() => useScavengerHunt());
      act(() => {
        result.current.startGame(5);
      });
      expect(setItemSpy).toHaveBeenCalledWith(
        STORAGE_KEY,
        expect.any(String)
      );
    });

    it('saves state after toggleItem', () => {
      const { result } = renderHook(() => useScavengerHunt());
      act(() => {
        result.current.startGame(5);
      });
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
      const firstId = result.current.items[0].id;
      act(() => {
        result.current.toggleItem(firstId);
      });
      expect(setItemSpy).toHaveBeenCalledWith(
        STORAGE_KEY,
        expect.any(String)
      );
    });

    it('restores items, target, and gameState on remount', () => {
      const { result: first } = renderHook(() => useScavengerHunt());
      act(() => {
        first.current.startGame(7);
      });
      const firstItemId = first.current.items[0].id;
      act(() => {
        first.current.toggleItem(firstItemId);
      });

      // Remount — should restore from localStorage
      const { result: second } = renderHook(() => useScavengerHunt());
      expect(second.current.gameState).toBe('playing');
      expect(second.current.target).toBe(7);
      expect(second.current.items).toHaveLength(24);
      const restoredItem = second.current.items.find((i) => i.id === firstItemId);
      expect(restoredItem?.isChecked).toBe(true);
    });

    it('resets state if localStorage data is invalid/corrupt', () => {
      localStorage.setItem(STORAGE_KEY, 'not-valid-json{{{{');
      const { result } = renderHook(() => useScavengerHunt());
      expect(result.current.gameState).toBe('start');
      expect(result.current.items).toEqual([]);
      expect(result.current.target).toBe(0);
    });
  });
});
