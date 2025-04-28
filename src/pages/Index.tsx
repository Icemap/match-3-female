
import { useState } from 'react';
import CandyBoard from '@/components/CandyBoard';
import GameHeader from '@/components/GameHeader';
import GameMenu from '@/components/GameMenu';
import { INITIAL_MOVES } from '@/lib/gameLogic';

const Index = () => {
  const [score, setScore] = useState<number>(0);
  const [moves, setMoves] = useState<number>(INITIAL_MOVES);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  
  const handleMenuClick = () => {
    setIsMenuOpen(true);
  };
  
  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };
  
  const handleNewGame = () => {
    setScore(0);
    setMoves(INITIAL_MOVES);
    setIsMenuOpen(false);
    window.location.reload(); // Simple way to reset the board
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ 
        backgroundImage: `url('${import.meta.env.BASE_URL}lovable-uploads/7fd245be-2b68-4dfa-a6ee-ed009e99db02.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="game-container max-w-sm w-full py-4 px-2">
        <GameHeader 
          score={score}
          moves={moves}
          onMenuClick={handleMenuClick}
        />
        
        <CandyBoard 
          score={score}
          setScore={setScore}
          moves={moves}
          setMoves={setMoves}
        />
        
        <GameMenu
          isOpen={isMenuOpen}
          onClose={handleMenuClose}
          onNewGame={handleNewGame}
          score={score}
        />
      </div>
    </div>
  );
};

export default Index;
