import { useCallback } from 'react';
import { useBingoGame } from './hooks/useBingoGame';
import { useScavengerHunt } from './hooks/useScavengerHunt';
import { StartScreen } from './components/StartScreen';
import { GameScreen } from './components/GameScreen';
import { BingoModal } from './components/BingoModal';
import { ScavengerScreen } from './components/ScavengerScreen';
import type { GameMode } from './types';

function App() {
  const {
    gameState,
    board,
    winningSquareIds,
    showBingoModal,
    startGame,
    handleSquareClick,
    resetGame,
    dismissModal,
  } = useBingoGame();

  const scavenger = useScavengerHunt();
  const { startGame: startScavengerGame } = scavenger;

  const handleStart = useCallback((mode: GameMode, target?: number) => {
    if (mode === 'bingo') startGame();
    else startScavengerGame(target ?? 12);
  }, [startGame, startScavengerGame]);

  if (gameState !== 'start') {
    return (
      <>
        <GameScreen
          board={board}
          winningSquareIds={winningSquareIds}
          hasBingo={gameState === 'bingo'}
          onSquareClick={handleSquareClick}
          onReset={resetGame}
        />
        {showBingoModal && <BingoModal onDismiss={dismissModal} />}
      </>
    );
  }

  if (scavenger.gameState !== 'start') {
    return (
      <ScavengerScreen
        items={scavenger.items}
        target={scavenger.target}
        gameState={scavenger.gameState}
        checkedCount={scavenger.checkedCount}
        showCompleteModal={scavenger.showCompleteModal}
        onToggle={scavenger.toggleItem}
        onReset={scavenger.resetGame}
        onDismissModal={scavenger.dismissModal}
      />
    );
  }

  return <StartScreen onStart={handleStart} />;
}

export default App;
