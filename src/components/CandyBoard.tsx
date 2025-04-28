import { useState, useEffect } from 'react';
import CandyPiece from './CandyPiece';
import { BOARD_SIZE, CANDY_TYPES, CANDY_TYPE, checkMatches, createBoard, generateNewCandies, swapCandies } from '@/lib/gameLogic';
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
    const newBoard = JSON.parse(JSON.stringify(board)); // Deep clone board
    const temp = { ...newBoard[row1][col1] };
    newBoard[row1][col1] = { ...newBoard[row2][col2] };
    newBoard[row2][col2] = temp;
    
    setBoard(newBoard);
    
    // Wait for swap animation
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Check for matches after swap
    const matches = checkMatches(newBoard);
    
    if (matches.length === 0) {
      // No matches, swap back
      const revertedBoard = JSON.parse(JSON.stringify(newBoard)); // Deep clone
      const temp = { ...revertedBoard[row1][col1] };
      revertedBoard[row1][col1] = { ...revertedBoard[row2][col2] };
      revertedBoard[row2][col2] = temp;
      
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

  // Update processMatches to remove the special and direction properties
  const processMatches = async (currentBoard: CANDY_TYPE[][], matches: {row: number, col: number}[]) => {
    if (matches.length === 0) return;
    
    setAnimatingRemove(matches);
    
    const pointsEarned = matches.length * 10;
    setScore(score + pointsEarned);
    
    const updatedBoard = JSON.parse(JSON.stringify(currentBoard));
    
    for (const match of matches) {
      // Mark matched candies for removal
      if (updatedBoard[match.row][match.col]) {
        updatedBoard[match.row][match.col].toRemove = true;
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
    setAnimatingRemove([]);
    
    const boardAfterRemoval = removeMatchedCandies(updatedBoard);
    setBoard(boardAfterRemoval);
    setAnimatingFall(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setAnimatingFall(false);
    
    const newMatches = checkMatches(boardAfterRemoval);
    if (newMatches.length > 0) {
      await processMatches(boardAfterRemoval, newMatches);
    }
  };

  // Remove matched candies and refill the board
  const removeMatchedCandies = (currentBoard: CANDY_TYPE[][]) => {
    // Create a deep copy of the board
    const updatedBoard = JSON.parse(JSON.stringify(currentBoard));
    
    // Remove matched candies (those marked with toRemove)
    for (let row = 0; row < BOARD_SIZE.rows; row++) {
      for (let col = 0; col < BOARD_SIZE.cols; col++) {
        if (updatedBoard[row][col]?.toRemove) {
          updatedBoard[row][col] = null;
        }
      }
    }
    
    // Move candies down to fill gaps (column by column)
    for (let col = 0; col < BOARD_SIZE.cols; col++) {
      let emptySpaces = 0;
      
      // Start from bottom, count empty spaces and shift pieces down
      for (let row = BOARD_SIZE.rows - 1; row >= 0; row--) {
        if (updatedBoard[row][col] === null) {
          emptySpaces++;
        } else if (emptySpaces > 0) {
          // Move piece down by emptySpaces
          updatedBoard[row + emptySpaces][col] = updatedBoard[row][col];
          updatedBoard[row][col] = null;
        }
      }
    }
    
    // Generate new candies to fill the top
    const types = Object.values(CANDY_TYPES).filter(type => type !== CANDY_TYPES.BROWN);
    
    for (let col = 0; col < BOARD_SIZE.cols; col++) {
      for (let row = 0; row < BOARD_SIZE.rows; row++) {
        if (updatedBoard[row][col] === null) {
          // Add a 5% chance to create a blocker (brown)
          const randomNum = Math.random();
          if (randomNum < 0.05) {
            updatedBoard[row][col] = { type: CANDY_TYPES.BROWN, old: false };
          } else {
            // Randomly select a valid candy type
            const randomIndex = Math.floor(Math.random() * types.length);
            updatedBoard[row][col] = { type: types[randomIndex], old: false };
          }
        } else if (updatedBoard[row][col]) {
          updatedBoard[row][col] = { ...updatedBoard[row][col], old: true };
        }
      }
    }
    
    return updatedBoard;
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
