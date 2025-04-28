
import { useState, useEffect } from 'react';
import CandyPiece from './CandyPiece';
import { BOARD_SIZE, CANDY_TYPES, CANDY_TYPE, checkMatches, createBoard, generateNewCandies, swapCandies, MatchPosition } from '@/lib/gameLogic';
import { toast } from "sonner";

interface CandyBoardProps {
  score: number;
  setScore: (score: number) => void;
  moves: number;
  setMoves: (moves: number) => void;
}

const CandyBoard = ({ score, setScore, moves, setMoves }: CandyBoardProps) => {
  const [board, setBoard] = useState<CANDY_TYPE[][]>([]);
  const [selectedCandy, setSelectedCandy] = useState<{ row: number; col: number } | null>(null);
  const [animatingSwap, setAnimatingSwap] = useState(false);
  const [animatingRemove, setAnimatingRemove] = useState<{row: number, col: number}[]>([]);
  const [animatingFall, setAnimatingFall] = useState(false);

  // Initialize the board
  useEffect(() => {
    let initialBoard = createBoard();
    setBoard(initialBoard);
  }, []);

  // Handle selecting a candy piece
  const handleCandyClick = (row: number, col: number) => {
    if (animatingSwap || animatingRemove.length > 0 || animatingFall || moves <= 0) return;
    
    if (!selectedCandy) {
      setSelectedCandy({ row, col });
    } else {
      // Check if the clicked candy is adjacent to the selected candy
      const rowDiff = Math.abs(row - selectedCandy.row);
      const colDiff = Math.abs(col - selectedCandy.col);
      
      if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
        // Try to swap candies
        swapAndCheck(selectedCandy.row, selectedCandy.col, row, col);
      } else {
        // Select the new candy instead
        setSelectedCandy({ row, col });
      }
    }
  };

  // Swap candies and check for matches
  const swapAndCheck = async (row1: number, col1: number, row2: number, col2: number) => {
    setAnimatingSwap(true);
    // Create a new board with swapped candies
    const newBoard = swapCandies([...board], row1, col1, row2, col2);
    setBoard(newBoard);
    
    // Wait for swap animation
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Check for matches after swap
    const matches = checkMatches(newBoard);
    
    if (matches.length === 0) {
      // No matches, swap back
      const revertedBoard = swapCandies([...newBoard], row1, col1, row2, col2);
      setBoard(revertedBoard);
      await new Promise(resolve => setTimeout(resolve, 300));
      setAnimatingSwap(false);
      setSelectedCandy(null);
      return;
    }
    
    // Decrement moves since this was a valid move
    setMoves(moves - 1);
    setSelectedCandy(null);
    setAnimatingSwap(false);
    
    // Process matches and continue with cascades
    await processMatches(newBoard, matches);
  };

  // Process matches and handle cascading effects
  const processMatches = async (currentBoard: CANDY_TYPE[][], matches: MatchPosition[]) => {
    if (matches.length === 0) return;
    
    // Track candies to be removed for animation
    setAnimatingRemove(matches);
    
    // Add points based on matches
    const pointsEarned = matches.length * 10;
    setScore(score + pointsEarned);
    
    // Create a deep copy of the board to avoid reference issues
    let updatedBoard = JSON.parse(JSON.stringify(currentBoard));
    
    // Mark special candies and regular matched candies
    for (const match of matches) {
      if (match.special) {
        // Create striped candy
        updatedBoard[match.row][match.col] = {
          ...updatedBoard[match.row][match.col],
          isStriped: true,
          stripeDirection: match.direction || 'horizontal'
        };
      } else {
        // Mark regular matched candies for removal
        if (updatedBoard[match.row][match.col]) {
          updatedBoard[match.row][match.col] = { 
            ...updatedBoard[match.row][match.col], 
            toRemove: true 
          };
        }
      }
    }
    
    // Wait for removal animation
    await new Promise(resolve => setTimeout(resolve, 300));
    setAnimatingRemove([]);
    
    // Remove matched candies and refill the board
    updatedBoard = removeMatchedCandies(updatedBoard);
    setBoard(updatedBoard);
    setAnimatingFall(true);
    
    // Wait for falling animation
    await new Promise(resolve => setTimeout(resolve, 500));
    setAnimatingFall(false);
    
    // Check for any new matches created by falling candies
    const newMatches = checkMatches(updatedBoard);
    if (newMatches.length > 0) {
      // Chain reaction - process new matches
      await processMatches(updatedBoard, newMatches);
    }
  };

  // Remove matched candies and refill the board
  const removeMatchedCandies = (currentBoard: CANDY_TYPE[][]) => {
    // Remove matched candies (those marked with toRemove)
    let updatedBoard = currentBoard.map(row => 
      row.map(candy => candy?.toRemove ? null : candy)
    );
    
    // Move candies down to fill gaps
    for (let col = 0; col < BOARD_SIZE.cols; col++) {
      let emptyCount = 0;
      for (let row = BOARD_SIZE.rows - 1; row >= 0; row--) {
        if (updatedBoard[row][col] === null) {
          emptyCount++;
        } else if (emptyCount > 0) {
          updatedBoard[row + emptyCount][col] = updatedBoard[row][col];
          updatedBoard[row][col] = null;
        }
      }
    }
    
    // Generate new candies to fill the top
    return generateNewCandies(updatedBoard);
  };

  // Check if the game is over
  useEffect(() => {
    if (moves === 0) {
      toast.info("Game Over! Your final score is " + score);
    }
  }, [moves, score]);

  return (
    <div className="candy-board rounded-xl bg-candy-panel p-1.5 border-4 border-candy-border shadow-xl">
      {board.map((row, rowIdx) => (
        <div key={`row-${rowIdx}`} className="flex">
          {row.map((candy, colIdx) => (
            <CandyPiece
              key={`candy-${rowIdx}-${colIdx}`}
              type={candy?.type || CANDY_TYPES.BLUE}
              isSelected={selectedCandy?.row === rowIdx && selectedCandy?.col === colIdx}
              isStriped={candy?.isStriped}
              stripeDirection={candy?.stripeDirection}
              toRemove={animatingRemove.some(m => m.row === rowIdx && m.col === colIdx)}
              onClick={() => handleCandyClick(rowIdx, colIdx)}
              animateFall={animatingFall && candy && !candy.old}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default CandyBoard;
