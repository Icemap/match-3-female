
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Music } from "lucide-react";

interface GameMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNewGame: () => void;
  score: number;
}

const GameMenu = ({ isOpen, onClose, onNewGame, score }: GameMenuProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-b from-violet-100 to-blue-100 border-2 border-violet-300">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center font-bold text-violet-800 flex items-center justify-center gap-2">
            <Music size={24} />
            <span>Melody Match</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 text-center">
          <p className="text-lg mb-4 text-violet-700">Current Score: <span className="font-bold">{score}</span></p>
          
          <div className="space-y-2 text-violet-800">
            <p>Match 3 or more candies in a row or column to earn points!</p>
            <p>Match 4 candies to create special striped candy pieces.</p>
            <p>Clear as many candies as you can before running out of moves.</p>
          </div>
        </div>
        
        <DialogFooter className="flex justify-center gap-4">
          <Button 
            onClick={onClose} 
            variant="outline" 
            className="border-violet-400 text-violet-700 hover:bg-violet-100"
          >
            Continue
          </Button>
          <Button 
            onClick={onNewGame} 
            className="bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700"
          >
            New Game
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GameMenu;
