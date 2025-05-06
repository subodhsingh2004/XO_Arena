import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { GridBackgroundDemo } from "../components/GridBackgroundDemo";
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from "react-redux";
import Confetti from "react-confetti"
import useWindowSize from "../hooks/WindowSize";
import { updateStats } from "../slice/userSlice";
import RoomCodePopup from "../components/RoomCodePopup";
import { useNavigate } from "react-router-dom";

function Gameplay() {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { width, height } = useWindowSize();

  const userDetails = useSelector((state: any) => state.user.userDetails)
  const [score, setScore] = useState<number>(0)
  const [step, setStep] = useState<'chooseAction' | 'createRoom' | 'joinRoom' | 'inGame'>('chooseAction');
  const [roomId, setRoomId] = useState('');
  const [roomCreator, setRoomCreator] = useState<boolean>(false)
  const [roomIdInput, setRoomIdInput] = useState('');
  const [connected, setConnected] = useState(false);
  const [gameState, setGameState] = useState<string[]>(Array(9).fill(''));
  const [symbol, setSymbol] = useState<'X' | 'O' | null>(null);
  const [opponent, setOpponent] = useState<string>("")
  const [opponentScore, setOppenentScore] = useState<number>(0)
  const [currentTurn, setCurrentTurn] = useState<'X' | 'O' | null>(null);
  const [winner, setWinner] = useState<null | 'X' | 'O' | 'over'>(null);
  const [winningCelebration, setWinningCelebration] = useState(false)
  const [disconnected, setDisconnected] = useState(false);


  const socket = useRef<Socket | null>(null);
  const symbolRef = useRef(symbol)

  useEffect(() => {
    symbolRef.current = symbol;
  }, [symbol]);

  useEffect(() => {

    socket.current = io(import.meta.env.VITE_API, {
      withCredentials: true
    })

    socket.current.on('connect', () => {
      // console.log('Socket connected:', socket.current?.id);
    })

    setupSocketListeners()

    return () => {
      socket.current?.disconnect();
      socket.current?.removeAllListeners()
      socket.current = null
    };
  }, []);


  const createRoom = () => {

    const newRoomId = uuidv4();
    setRoomId(newRoomId);

    setRoomCreator(true)

    socket.current?.emit('createRoom', { name: userDetails.username, roomId: newRoomId });
    setConnected(true);
    setStep('createRoom');

  };

  const joinRoom = () => {
    if (!roomIdInput.trim()) return;

    setRoomId(roomIdInput);

    socket.current?.emit('joinRoom', { name: userDetails.username, roomId: roomIdInput });
    setConnected(true);
    setStep('inGame');

  };

  const setupSocketListeners = () => {
    socket.current?.on('gameState', (state: string[]) => {
      setGameState(state);
      setStep("inGame")
    });

    socket.current?.on('opponentName', (name) => {
      setOpponent(name)
    })

    socket.current?.on('yourSymbol', (s: 'X' | 'O') => {
      setSymbol(s);
    });

    socket.current?.on('turn', (turn: 'X' | 'O') => {
      setCurrentTurn(turn);
    });

    socket.current?.on('gameOver', ({ winner, disconnected }) => {
      setWinner(winner);
      // console.log(winner)
      if (winner != null) {
        if (winner == symbolRef.current) {
          setScore(prev => prev + 1)
          setWinningCelebration(true)
          setTimeout(() => setWinningCelebration(false), 10000)
          dispatch(updateStats({ point: 5, winner: true }))
        }
        else if (winner != 'over' && winner != symbolRef.current) {
          setOppenentScore(prev => prev + 1)
          dispatch(updateStats({ point: -2, winner: false }))
        }
      }
      // setSymbol(null);
      setDisconnected(disconnected || false);
    });

    socket.current?.on('disconnect', () => {
      setConnected(false);
      setWinner(null);
      setDisconnected(true);
    });

    socket.current?.on('errorMessage', (msg) => {
      alert(msg);
      setStep('joinRoom');
    });
  };

  const handleCellClick = (index: number) => {
    if (!socket.current) return;
    if (!connected) return
    if (gameState[index] !== '') return;
    if (winner) return;
    if (symbol !== currentTurn) return;
    socket.current.emit('cellClick', index);
  };

  const handlePlayAgain = () => {
    setGameState(Array(9).fill(''));
    setWinner(null);
    setDisconnected(false);
    setSymbol(null);
    setCurrentTurn(null);
    socket.current?.emit('playAgain');
  }

  const handleGameExit = () => {
    if (socket.current?.connected) {
      socket.current.disconnect();
    }
    socket.current = null;
    navigate("/")
  }

  const renderStatus = () => {

    if (disconnected) return opponent + " exit the game";
    if (winner) return winner === symbol ? "You won!" : winner === 'over' ? "It's a draw!" : opponent + " won"
    if (symbol && currentTurn) {
      return symbol === currentTurn ? "Your turn" : opponent + "'s turn";
    }
    return "Waiting for opponent to join...";
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#010101] text-white">
      <GridBackgroundDemo />

      <div className="w-full h-dvh z-20 flex items-center justify-center relative overflow-hidden">

        {winningCelebration && <Confetti width={width} height={height} />}

        {/* LOGO */}
        <div className="w-full p-4 fixed top-0 flex items-start justify-center sm:justify-start">
          <h1 className='font-bold font-[poppins] leading-none text-[30px] text-transparent bg-clip-text bg-gradient-to-r from-blue-600  to-red-500 select-none'>XO Arena</h1>
        </div>

        {step === 'chooseAction' && (
          <div className="flex flex-col md:flex-row gap-20">

            <div className="flex flex-col w-[210px] items-center gap-2">
              <button onClick={createRoom} className="p-2 w-[130px] cursor-pointer bg-blue-600 hover:bg-blue-700 rounded font-[JetBrains_Mono]">Create Room</button>
              <p className="text-sm font-[poppins] text-gray-400 text-center">Create a game Room to start playing with your friend</p>
            </div>

            <div className="flex flex-col w-[210px] items-center gap-2">
              <button onClick={() => setStep('joinRoom')} className="p-2 w-[130px] cursor-pointer bg-red-500 hover:bg-red-700 rounded font-[JetBrains_Mono]">Join Room</button>
              <p className="text-sm font-[poppins] text-gray-400 text-center">Enter your's friend room code to join them in the game</p>
            </div>

          </div>
        )}

        {(step === "createRoom" && roomCreator) ?
          <RoomCodePopup roomId={roomId} />
          : null
        }


        {step === 'joinRoom' && (
          <form onSubmit={joinRoom}>
            <div className="flex flex-col w-[300px] items-center gap-4">
              <input
                type="text"
                placeholder="Enter Room Code"
                value={roomIdInput}
                required
                onChange={(e) => setRoomIdInput(e.target.value)}
                className="p-2 font-[JetBrains_Mono] w-[295px] border-none rounded-md text-white focus:outline-gray-400 focus:outline-[3.5px] outline-[3.5px] outline-[#515151] outline-offset-0"
              />

              <div className="flex space-x-2 w-full">
                <button
                  onClick={() => {
                    setStep("chooseAction")
                  }}
                  className="w-[50px] flex items-center justify-center font-[JetBrains_Mono] bg-[#212121] text-gray-300 border border-gray-400 rounded-md cursor-pointer">
                  <img src="/back.png" alt="" className="w-[25px] h-[25px]" />
                </button>
                <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-red-500 text-white text-lg font-[JetBrains_Mono] font-bold py-1.5 rounded-md hover:bg-gradient-to-l transition-colors duration-500 cursor-pointer">
                  Join
                </button>
              </div>
            </div>
          </form>

        )}

        {step === 'inGame' && (
          <div className="h-full w-full py-10 flex flex-col items-center justify-center gap-4">

            <div className="flex flex-col w-75 md:w-90">

              <div className="font-[JetBrains_Mono] font-medium text-[18px] text-center text-gray-400">{renderStatus()}</div>

              <div className="mt-2 sm:mt-6 flex justify-between w-full text-white font-[poppins]">

                <div className={`bg-[#212121] py-1 px-2 flex flex-col items-center rounded-md ${currentTurn && currentTurn == symbol ? "border" : null}`}>
                  <span>
                    {userDetails.username}
                  </span>
                  <span className="font-[JetBrains_Mono]">{score}</span>
                </div>

                <div className={`bg-[#212121] py-1 px-2 flex flex-col items-center rounded-md ${currentTurn && currentTurn == symbol ? null : "border"}`}>
                  <span>
                    {opponent}
                  </span>
                  <span className="font-[JetBrains_Mono]">{opponentScore}</span>
                </div>

              </div>


              <div className="mt-2 sm:mt-6 flex flex-col w-full items-center gap-4">

                {!disconnected && <div className="w-75 md:w-90 grid grid-cols-3">
                  {gameState.map((cell, index) => (
                    <div
                      key={index}
                      onClick={() => handleCellClick(index)}
                      className={`w-25 h-25 md:w-30 md:h-30 flex items-center justify-center text-5xl font-extrabold font-[poppins] border border-gray-400 cursor-pointer ${cell === 'X' ? 'text-blue-600' : cell === 'O' ? 'text-red-500' : ''
                        }`}
                    >
                      {cell}
                    </div>
                  ))}
                </div>}

                <button
                  onClick={handleGameExit}
                  className="w-full p-2 mt-2 sm:mt-5 font-[JetBrains_Mono] rounded-md cursor-pointer border border-[#313131] bg-[#121212] hover:bg-[#212121] text-white">
                  Exit
                </button>
              </div>


              {winner && (
                <button
                  onClick={handlePlayAgain}
                  className="p-2 mt-3 sm:mt-5 font-[JetBrains_Mono] bg-gradient-to-r from-blue-600 to-red-500 rounded-md cursor-pointer hover:bg-gradient-to-l transition-colors duration-500 text-white"
                >
                  Play Again
                </button>
              )}
            </div>
          </div>
        )}
      </div>

    </div >
  );
}

export default Gameplay