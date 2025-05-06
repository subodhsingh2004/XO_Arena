import { Server, Socket } from "socket.io";
import { Game } from "../types.js";
import { checkWinner, startGameTimeout, clearGameTimeout } from "../utils/GameUtil.js";
import { UserModel } from "../models/user.model.js";
import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js";
import cookie from "cookie"

const games = new Map<string, Game>();
const playAgainRequests = new Map<string, Set<string>>();
const playerRoom = new Map<string, string>();
let waitingPlayer: { id: string; name: string } | null = null;

export const registerSocketHandlers = (io: Server) => {

  io.use((socket, next) => {

    const { token } = cookie.parse(socket.request.headers.cookie || '');

    if (!token) {
      throw new ApiError(401, "unauthorized request: token required", [])
    }

    const SECRET = process.env.ACCESS_TOKEN_SECRET
    if (!SECRET) throw new ApiError(401, "unauthorized request", [])

    try {
      const decoded = jwt.verify(token, SECRET) as { _id: string, username: string };
      socket.data.userId = decoded._id;
      next();
    } catch (err) {
      console.error('JWT verification failed:', err);
      next(new Error('Authentication error: Invalid token'));
    }
  })

  io.on('connection', (socket: Socket) => {

    // socket.onAny((event, ...args) => {
    //   console.log('Received event:', event, args);
    // });


    // find the user and save its socketid
    (async function () {
      const user = await UserModel.findOne({ _id: socket.data.userId })
      if (user) {
        user.socketId = socket.id
        await user.save({ validateBeforeSave: false })
      }
    })()

    socket.on('createRoom', ({ name, roomId }) => {
      socket.join(roomId);
      playerRoom.set(socket.id, roomId);
      socket.data.name = name
      socket.emit('roomCreated', { roomId, symbol: 'X' });
    });

    socket.on('joinRoom', ({ name, roomId }) => {
      const room = io.sockets.adapter.rooms.get(roomId);
      if (!room) {
        socket.emit('roomNotFound');
        return;
      }

      if (room.size > 1) {
        socket.emit('roomFull');
        return;
      }

      socket.join(roomId);
      playerRoom.set(socket.id, roomId);

      // get the previous player name
      const firstPlayerId = Array.from(room)[0]
      const firstPlayerName = io.sockets.sockets.get(firstPlayerId)

      const players = {
        X: { id: firstPlayerId, name: firstPlayerName?.data.name },
        O: { id: socket.id, name },
      };

      const board = Array(9).fill('');
      const turn = 'X';

      games.set(roomId, { board, players, turn });

      io.to(players.X.id).emit('opponentName', players.O.name)
      io.to(players.O.id).emit('opponentName', players.X.name)

      io.to(roomId).emit('gameState', board);

      io.to(players.X.id).emit('yourSymbol', 'X');
      io.to(players.O.id).emit('yourSymbol', 'O');

      io.to(roomId).emit('turn', turn);
    });

    socket.on('cellClick', (index: number) => {
      const roomId = playerRoom.get(socket.id);
      if (!roomId) return;

      const game = games.get(roomId);
      if (!game) return;

      const { board, players, turn } = game;
      const playerSymbol = Object.keys(players).find(sym => players[sym as 'X' | 'O'].id === socket.id) as 'X' | 'O';

      if (playerSymbol !== turn || board[index]) return;

      board[index] = turn;
      const result = checkWinner(board);

      if (result === 'X' || result === 'O') {

        (async function () {

          const playerX = await UserModel.findOne({ socketId: players.X.id })
          const playerO = await UserModel.findOne({ socketId: players.O.id })

          if (playerX && playerO) {
            if (result === 'X') {
              playerX.totalPoints = playerX?.totalPoints + 5
              playerX.gamesWon = playerX.gamesWon + 1

              playerO.totalPoints = playerO?.totalPoints - 2

            }
            else if (result === 'O') {
              playerO.totalPoints = playerO?.totalPoints + 5
              playerO.gamesWon = playerO.gamesWon + 1
              playerX.totalPoints = playerX?.totalPoints - 2
            }

            playerX.gamesPlayed = playerX.gamesPlayed + 1;
            playerO.gamesPlayed = playerO.gamesPlayed + 1;

            await playerX.save({ validateBeforeSave: false })
            await playerO.save({ validateBeforeSave: false })

          }
        })()


        io.to(roomId).emit('gameState', board);
        io.to(roomId).emit('gameOver', { winner: result, disconnected: false });
        startGameTimeout(roomId, games);

      } else if (result === 'draw') {

        (async function () {

          const playerX = await UserModel.findOne({ socketId: players.X.id })
          const playerO = await UserModel.findOne({ socketId: players.O.id })

          if (playerX && playerO) {

            playerX.gamesPlayed = playerX.gamesPlayed + 1;
            playerO.gamesPlayed = playerO.gamesPlayed + 1;

            await playerX.save({ validateBeforeSave: false })
            await playerO.save({ validateBeforeSave: false })
          }
        })()

        io.to(roomId).emit('gameState', board);
        io.to(roomId).emit('gameOver', { winner: 'over', disconnected: false });
        startGameTimeout(roomId, games);

      } else {

        game.turn = turn === 'X' ? 'O' : 'X';
        io.to(roomId).emit('gameState', board);
        io.to(roomId).emit('turn', game.turn);

      }
    });

    socket.on('playAgain', () => {
      const roomId = playerRoom.get(socket.id);
      if (!roomId) return;

      const requests = playAgainRequests.get(roomId) ?? new Set<string>();
      requests.add(socket.id);
      playAgainRequests.set(roomId, requests);

      if (requests.size === 2) {
        const game = games.get(roomId);
        if (!game) return;

        const board = Array(9).fill('');
        const newGame: Game = {
          board,
          players: game.players,
          turn: 'X',
        };

        games.set(roomId, newGame);
        playAgainRequests.delete(roomId);

        io.to(roomId).emit('gameState', board);
        io.to(game.players.X.id).emit('yourSymbol', 'X');
        io.to(game.players.O.id).emit('yourSymbol', 'O');
        io.to(roomId).emit('turn', 'X');

        clearGameTimeout(roomId, games);
      }
    });

    socket.on('disconnect', () => {

      if (waitingPlayer?.id === socket.id) {
        waitingPlayer = null;
      }

      for (const [roomId, game] of games.entries()) {
        if (Object.values(game.players).some(player => player.id === socket.id)) {
          io.to(roomId).emit('gameOver', { winner: null, disconnected: true });
          games.delete(roomId);
        }
      }
    });
  });
};
