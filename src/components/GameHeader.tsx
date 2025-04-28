
import { Menu, Music } from "lucide-react";

interface GameHeaderProps {
  score: number;
  moves: number;
  onMenuClick: () => void;
}

const GameHeader = ({ score, moves, onMenuClick }: GameHeaderProps) => {
  return (
    <div className="game-header flex items-center justify-between w-full bg-violet-600 rounded-lg px-4 py-2 mb-2 text-white shadow-md border-2 border-violet-500">
      <div className="menu-button">
        <button 
          onClick={onMenuClick}
          className="flex flex-col justify-center p-1"
        >
          <Menu size={24} className="text-white" />
        </button>
      </div>
      
      <div className="title-display flex items-center gap-2 font-bold">
        <Music size={20} className="text-yellow-300" />
        <span className="text-lg">Melody Match</span>
      </div>
      
      <div className="score-display text-center font-bold">
        <div className="text-sm text-violet-100">SCORE</div>
        <div className="text-2xl text-yellow-300 drop-shadow-md">{score}</div>
      </div>
      
      <div className="moves-display text-right font-bold">
        <div className="text-sm text-violet-100">MOVES</div>
        <div className="text-2xl text-white">{moves}</div>
      </div>
    </div>
  );
};

export default GameHeader;
