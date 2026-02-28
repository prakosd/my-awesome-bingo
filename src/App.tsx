import { useCallback, useState } from 'react';
import { useBingoGame } from './hooks/useBingoGame';
import { useScavengerHunt } from './hooks/useScavengerHunt';
import { useCardDeck } from './hooks/useCardDeck';
import { StartScreen } from './components/StartScreen';
import { GameScreen } from './components/GameScreen';
import { BingoModal } from './components/BingoModal';
import { ScavengerScreen } from './components/ScavengerScreen';
import { CardDeckScreen } from './components/CardDeckScreen';
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

  const cardDeck = useCardDeck();
  const [cardDeckActive, setCardDeckActive] = useState(false);

  const handleStart = useCallback((mode: GameMode, target?: number) => {
    if (mode === 'bingo') startGame();
    else if (mode === 'scavenger') startScavengerGame(target ?? 12);
    else if (mode === 'card-deck') setCardDeckActive(true);
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

  if (cardDeckActive) {
    return (
      <CardDeckScreen
        {...cardDeck}
        onBack={() => { cardDeck.resetDeck(); setCardDeckActive(false); }}
      />
    );
  }

  return <StartScreen onStart={handleStart} />;
}

export default App;
