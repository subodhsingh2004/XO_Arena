import { Game } from "../types.js";

export const checkWinner = (board: string[]): 'X' | 'O' | 'draw' | null => {
    const wins = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],     // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8],     // cols
      [0, 4, 8], [2, 4, 6],                // diags
    ];
  
    for (const [a, b, c] of wins) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a] as 'X' | 'O';
      }
    }
  
    return board.includes('') ? null : 'draw';
  };
  
  export const startGameTimeout = (
    roomId: string,
    games: Map<string, Game>
  ): void => {
    const timeout = setTimeout(() => {
      games.delete(roomId);
      // console.log(`Game in room ${roomId} deleted due to inactivity.`);
    }, 5 * 60 * 1000); // 5 minutes
  
    const game = games.get(roomId);
    if (game) {
      game.timeout = timeout;
    }
  };
  
  export const clearGameTimeout = (
    roomId: string,
    games: Map<string, Game>
  ): void => {
    const game = games.get(roomId);
    if (game?.timeout) {
      clearTimeout(game.timeout);
      delete game.timeout;
      // console.log(`Timeout for room ${roomId} cleared.`);
    }
  };
  