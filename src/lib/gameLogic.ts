
// Game constants
export const BOARD_SIZE = {
  rows: 6,
  cols: 7
};

export const CANDY_TYPES = {
  BLUE: 'BLUE',   // Music note
  GREEN: 'GREEN', // Graduation cap
  YELLOW: 'YELLOW', // Guitar
  ORANGE: 'ORANGE', // Microphone
  BROWN: 'BROWN', // Blockers
};

export const INITIAL_MOVES = 64;

export type CANDY_TYPE = {
  type: string;
  isStriped?: boolean;
  stripeDirection?: 'horizontal' | 'vertical';
  toRemove?: boolean;
  old?: boolean;
} | null;

// Define the interface for matches to include special and direction properties
export interface MatchPosition {
  row: number;
  col: number;
  special?: boolean;
  direction?: 'horizontal' | 'vertical';
}

// Create a new game board
export const createBoard = (): CANDY_TYPE[][] => {
  const board: CANDY_TYPE[][] = [];
  const types = Object.values(CANDY_TYPES).filter(type => type !== CANDY_TYPES.BROWN);
  
  for (let row = 0; row < BOARD_SIZE.rows; row++) {
    const newRow: CANDY_TYPE[] = [];
    for (let col = 0; col < BOARD_SIZE.cols; col++) {
      let validTypes = [...types];
      
      // To prevent initial matches, eliminate types that would create a match
      if (row >= 2) {
        if (board[row-1][col]?.type === board[row-2][col]?.type) {
          validTypes = validTypes.filter(type => type !== board[row-1][col]?.type);
        }
      }
      
      if (col >= 2) {
        if (newRow[col-1]?.type === newRow[col-2]?.type) {
          validTypes = validTypes.filter(type => type !== newRow[col-1]?.type);
        }
      }
      
      // Add a 5% chance to create a blocker (brown)
      const randomNum = Math.random();
      if (randomNum < 0.05) {
        newRow.push({ type: CANDY_TYPES.BROWN });
      } else {
        // Randomly select a valid candy type
        const randomIndex = Math.floor(Math.random() * validTypes.length);
        newRow.push({ type: validTypes[randomIndex] });
      }
    }
    board.push(newRow);
  }
  
  return board;
};

// Swap two candies on the board
export const swapCandies = (board: CANDY_TYPE[][], row1: number, col1: number, row2: number, col2: number): CANDY_TYPE[][] => {
  const newBoard = JSON.parse(JSON.stringify(board)); // Deep copy to avoid reference issues
  const temp = newBoard[row1][col1];
  newBoard[row1][col1] = newBoard[row2][col2];
  newBoard[row2][col2] = temp;
  
  return newBoard;
};

// Check for matches on the board
export const checkMatches = (board: CANDY_TYPE[][]): MatchPosition[] => {
  const matches: MatchPosition[] = [];
  const matchedPositions = new Set<string>(); // Track positions already matched
  
  // Check for horizontal matches
  for (let row = 0; row < BOARD_SIZE.rows; row++) {
    for (let col = 0; col < BOARD_SIZE.cols - 2; col++) {
      const candyType = board[row][col]?.type;
      if (!candyType || candyType === CANDY_TYPES.BROWN) continue;
      
      let matchLength = 1;
      while (col + matchLength < BOARD_SIZE.cols && board[row][col + matchLength]?.type === candyType) {
        matchLength++;
      }
      
      if (matchLength >= 3) {
        // For a match of exactly 4, create a special candy
        const isSpecialMatch = matchLength === 4;
        
        for (let i = 0; i < matchLength; i++) {
          const position = `${row},${col + i}`;
          if (!matchedPositions.has(position)) {
            // For the first candy in a special match, mark it for special candy creation
            const isSpecialPosition = isSpecialMatch && i === 0;
            
            matches.push({
              row, 
              col: col + i, 
              special: isSpecialPosition,
              direction: isSpecialPosition ? 'horizontal' : undefined
            });
            matchedPositions.add(position);
          }
        }
        
        col += matchLength - 1; // Skip already matched candies
      }
    }
  }
  
  // Check for vertical matches
  for (let col = 0; col < BOARD_SIZE.cols; col++) {
    for (let row = 0; row < BOARD_SIZE.rows - 2; row++) {
      const candyType = board[row][col]?.type;
      if (!candyType || candyType === CANDY_TYPES.BROWN) continue;
      
      let matchLength = 1;
      while (row + matchLength < BOARD_SIZE.rows && board[row + matchLength][col]?.type === candyType) {
        matchLength++;
      }
      
      if (matchLength >= 3) {
        // For a match of exactly 4, create a special candy
        const isSpecialMatch = matchLength === 4;
        
        for (let i = 0; i < matchLength; i++) {
          const position = `${row + i},${col}`;
          if (!matchedPositions.has(position)) {
            // For the first candy in a special match, mark it for special candy creation
            const isSpecialPosition = isSpecialMatch && i === 0;
            
            matches.push({
              row: row + i, 
              col, 
              special: isSpecialPosition,
              direction: isSpecialPosition ? 'vertical' : undefined
            });
            matchedPositions.add(position);
          }
        }
        
        row += matchLength - 1; // Skip already matched candies
      }
    }
  }
  
  // Also check for adjacent blockers to remove them
  const blockerMatches: MatchPosition[] = [];
  
  for (const match of matches) {
    const { row, col } = match;
    
    // Check all adjacent positions for blockers
    const adjacentPositions = [
      { row: row - 1, col },
      { row: row + 1, col },
      { row, col: col - 1 },
      { row, col: col + 1 },
    ];
    
    for (const pos of adjacentPositions) {
      if (
        pos.row >= 0 && pos.row < BOARD_SIZE.rows &&
        pos.col >= 0 && pos.col < BOARD_SIZE.cols &&
        board[pos.row][pos.col]?.type === CANDY_TYPES.BROWN
      ) {
        const position = `${pos.row},${pos.col}`;
        if (!matchedPositions.has(position)) {
          blockerMatches.push({ row: pos.row, col: pos.col });
          matchedPositions.add(position);
        }
      }
    }
  }
  
  return [...matches, ...blockerMatches];
};

// Generate new candies to fill empty spaces on the board
export const generateNewCandies = (board: CANDY_TYPE[][]): CANDY_TYPE[][] => {
  const newBoard = JSON.parse(JSON.stringify(board)); // Deep copy
  const types = Object.values(CANDY_TYPES).filter(type => type !== CANDY_TYPES.BROWN);
  
  for (let col = 0; col < BOARD_SIZE.cols; col++) {
    for (let row = 0; row < BOARD_SIZE.rows; row++) {
      if (newBoard[row][col] === null) {
        // Add a 5% chance to create a blocker (brown)
        const randomNum = Math.random();
        if (randomNum < 0.05) {
          newBoard[row][col] = { type: CANDY_TYPES.BROWN, old: false };
        } else {
          // Randomly select a valid candy type
          const randomIndex = Math.floor(Math.random() * types.length);
          newBoard[row][col] = { type: types[randomIndex], old: false };
        }
      } else if (newBoard[row][col]) {
        newBoard[row][col] = { ...newBoard[row][col], old: true };
      }
    }
  }
  
  return newBoard;
};
