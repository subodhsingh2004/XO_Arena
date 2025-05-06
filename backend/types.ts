// export type Game = {
//     board: string[]; 
//     currentPlayer: 'X' | 'O'; 
//     players: {
//         X: string; // player id
//         O: string; // player id
//     };
//     turn: 'X' | 'O';
//     winner: 'X' | 'O' | null;
//     timeout?: NodeJS.Timeout; 
// };

export interface Game {
    board: string[];
    players: Record<'X' | 'O', { id: string, name: string }>;
    turn: 'X' | 'O';
    timeout?: NodeJS.Timeout;
}

export interface PlayAgainRequestMap {
    [roomId: string]: Set<string>;
}
