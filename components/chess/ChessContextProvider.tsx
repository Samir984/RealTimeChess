'use client';
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { Chess, Move, Square } from 'chess.js';
import { MakeSound } from '@/utils/sound';
import { useSocket } from '@/provider/SocketProvider';
import { toast } from 'react-toastify';
import { calculatePoints } from '@/utils/helper';

// Type Definitions
interface PreviousGameState {
  chessFen: string;
  move: { from: string; to: string; promotion?: string };
  capturePieces: { W: string[]; B: string[] };
  capturedPiecePoints: { W: number; B: number };
}

interface ChessContextType {
  game: Chess;
  side: undefined | 'B' | 'W' | 'noMove';
  validMoves: string[];
  targetSquare: string;
  setSide: React.Dispatch<
    React.SetStateAction<'B' | 'W' | 'noMove' | undefined>
  >;
  makeAMove: (
    move: { from: string; to: string; promotion?: string },
    send: boolean
  ) => Move | null;
  onDrop: (sourceSquare: string, targetSquare: string) => boolean;
  previousGameState: PreviousGameState[];
  capturedPieces: { W: string[]; B: string[] };
  viewPreviousGameState: (prevGs: PreviousGameState, idx: number) => void;
  onSquareClick: (square: string) => void;
  onPieceClick: (piece: string, square: Square) => void;
  capturedPiecePoints: { W: number; B: number };
}

export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';

export const piecePoint: Record<PieceType, number> = {
  p: 1, // Pawn
  n: 3, // Knight
  b: 3, // Bishop
  r: 5, // Rook
  q: 9, // Queen
  k: 0, // King (not counted in total score)
};

// Context
const ChessContext = createContext<ChessContextType | undefined>(undefined);

export default function ChesstContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { socket, joinMessage } = useSocket();
  const [side, setSide] = useState<undefined | 'B' | 'W' | 'noMove'>(undefined);
  const [restrictMove, setRestrictMove] = useState(false);

  const [game, setGame] = useState<Chess>(new Chess());
  const [validMoves, setValidMoves] = useState<string[]>([]);
  const [targetSquare, setTargetSquare] = useState<string>('');
  const [capturedPieces, setCapturedPieces] = useState<{
    W: string[];
    B: string[];
  }>({
    W: [],
    B: [],
  });

  const [moveCount, setMoveCount] = useState(0);
  // State for storing the game points
  const [capturedPiecePoints, setcapturedPiecePoints] = useState<{
    W: number;
    B: number;
  }>({
    W: 0,
    B: 0,
  });
  // Recent Steps
  const [previousGameState, setPreviousGameState] = useState<
    PreviousGameState[]
  >([]);
  // console.log(
  //   `--- Current State ---\n
  //   Socket: ${socket}\n
  //   Join Message: ${joinMessage}\n
  //   Side: ${side}\n
  //   turn: ${game.turn()}\n
  //   Valid Moves: ${JSON.stringify(validMoves)}\n
  //   Target Square: ${targetSquare}\n
  //   CapturedPieces: ${JSON.stringify(capturedPieces)}\n
  //   RestrictMove: ${restrictMove}\n

  //   `
  // );

  const updateCapturedPieces = useCallback(
    (move: Move, currentTurn: 'b' | 'w') => {
      console.log(move, move.captured, 'top\n\n');

      // Check if there's a captured piece
      if (move && move.captured === undefined) {
        const cpp = calculatePoints(capturedPieces);
        console.log(capturedPieces, capturedPiecePoints, 'nocapture\n\n\n\n');
        return { cp: capturedPieces, cpp };
      } else {
        // If there is no captured piece, handle the regular move
        const capturedSide = currentTurn === 'w' ? 'W' : 'B';
        const capturedPiece = move.captured;

        // Update the captured pieces state
        const cp = {
          ...capturedPieces,
          [capturedSide]: [...capturedPieces[capturedSide], capturedPiece],
        };
        setCapturedPieces(cp);

        console.log(cp, 'c');
        const cpp = calculatePoints(cp);
        setcapturedPiecePoints(cpp);

        return { cp, cpp };
      }
    },
    [capturedPiecePoints, capturedPieces]
  );

  const viewPreviousGameState = useCallback(
    function (prevGs: PreviousGameState, idx: number) {
      console.log(prevGs, 'view \n\n');

      if (prevGs.chessFen.split(' ')[0] === game.fen().split(' ')[0]) return;
      if (previousGameState.length - 1 === idx) {
        setRestrictMove(false);
      } else {
        setRestrictMove(true);
      }
      setCapturedPieces(prevGs.capturePieces);
      setcapturedPiecePoints(prevGs.capturedPiecePoints);
      setGame(new Chess(prevGs.chessFen));
      new MakeSound(new Chess(prevGs.chessFen));
    },
    [game, previousGameState.length]
  );

  const makeAMove = useCallback(
    (
      move: { from: string; to: string; promotion?: string },
      send: boolean
    ): Move | null => {
      console.log('make move function');
      const gameCopy = new Chess(game.fen());

      let result: Move | null = null;
      try {
        result = gameCopy.move(move);
      } catch (err) {
        toast.error('Invalid move');
      }

      if (result) {
        // result of move and previous game state
        const { cp, cpp } = updateCapturedPieces(result, game.turn());
        // updateCapturedPiecesFromCurrentFEN(gameCopy);
        console.log(cp, cpp, 'return\n\n');

        if (send) {
          socket?.send(
            JSON.stringify({
              type: 'move',
              data: {
                nextTurn: game.turn() === 'w' ? 'B' : 'W',
                gameId: joinMessage?.gameId,
                move,
              },
            })
          );
        }

        setMoveCount((prev) => prev + 1);

        // Ensure property names match the expected type
        setPreviousGameState((prev) => {
          const newState = {
            move,
            capturePieces: cp,
            chessFen: gameCopy.fen(),
            capturedPiecePoints: cpp,
          };
          return [...prev, newState];
        });

        setGame(gameCopy);
        new MakeSound(gameCopy);
      }

      return result;
    },
    [game, updateCapturedPieces, socket, joinMessage?.gameId]
  );

  function onDrop(sourceSquare: string, targetSquare: string): boolean {
    if (side === 'noMove') return true;
    console.log(side);
    if (restrictMove) return true;

    if (game.turn() === 'w' && side === 'B') return false;
    if (game.turn() === 'b' && side === 'W') return false;

    const move = makeAMove(
      {
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q',
      },
      true
    );

    if (move === null) return false;
    setValidMoves([]);
    return true;
  }

  function onSquareClick(square: string): void {
    if (validMoves.includes(square)) {
      onDrop(targetSquare, square);
    }
  }

  function onPieceClick(piece: string, square: Square) {
    if (side === 'noMove') return;
    if (restrictMove) return;
    if (game.turn() === 'w' && side === 'B') return;
    if (game.turn() === 'b' && side === 'W') return;

    const moves = game.moves({ square, verbose: true });

    const uniqueMoves = moves.filter(
      (move, index, self) => index === self.findIndex((m) => m.to === move.to)
    );

    setValidMoves(uniqueMoves.map((move) => move.to));
    setTargetSquare(square);
  }

  // for communcation after connetion
  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data as string);

      switch (data.type) {
        case 'move':
          toast.success('move');
          if (restrictMove) {
            const presentGameState = new Chess(
              previousGameState[previousGameState.length - 1].chessFen
            );

            alert('r');
            setGame(presentGameState);
            setTimeout(() => {
              makeAMove(data.move, false);
            }, 200);
          } else {
            alert('n');
            makeAMove(data.move, false);
          }
          break;
        case 'gameOver':
          console.log(data);
          toast.error(`Connection closed: ${data.message}`);
          break;

        case 'unknown':
          console.log(data);
          toast.error(`Connection closed: ${data.message}`);
          break;
        case 'quit':
          console.log(data);
          toast.error(`Connection closed: ${data.message}`);
      }
    };
  }, [socket, makeAMove, previousGameState, restrictMove]);

  const handelGameTermination = useCallback(() => {
    if (side === 'W')
      socket?.send(
        JSON.stringify({
          type: 'gameOver',
          data: {
            gameId: joinMessage?.gameId,
          },
        })
      );
  }, [side, socket, joinMessage?.gameId]);

  // check for gameOver case
  useEffect(() => {
    if (game.isGameOver()) {
      toast.success('game over');
      handelGameTermination();
    }
  }, [game, handelGameTermination]);

  // to set side
  useEffect(() => {
    console.log('game side effect', joinMessage?.side);
    setSide(joinMessage?.side as 'B' | 'W');
  }, [joinMessage?.side]);

  return (
    <ChessContext.Provider
      value={{
        game,
        side,
        validMoves,
        targetSquare,
        capturedPieces,
        capturedPiecePoints,
        previousGameState,
        viewPreviousGameState,
        setSide,
        makeAMove,
        onDrop,
        onSquareClick,
        onPieceClick,
      }}
    >
      {children}
    </ChessContext.Provider>
  );
}

export const useGameContext = () => {
  const context = useContext(ChessContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a ChessContext');
  }
  return context;
};
