"use client";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { Chess, Move, Square } from "chess.js";
import toast from "react-hot-toast";
import { MakeSound } from "@/utils/sound";
import { useSocket } from "@/provider/SocketProvider";

interface ChessContextType {
  game: Chess;
  side: null | "B" | "W" | "noMove";
  validMoves: string[];
  targetSquare: string;
  applyCustomStyles: boolean;
  setSide: (side: null | "B" | "W" | "noMove") => void;
  makeAMove: (
    move: {
      from: string;
      to: string;
      promotion?: string;
    },
    send: boolean
  ) => Move | null;
  onDrop: (sourceSquare: string, targetSquare: string) => boolean;
  onSquareClick: (square: string) => void;
  onPieceClick: (piece: string, square: Square) => void;
}

const ChessContext = createContext<ChessContextType | undefined>(undefined);

export default function ChesstContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { socket, joinMessage } = useSocket();
  const [side, setSide] = useState<null | "B" | "W" | "noMove">(null);
  const [game, setGame] = useState<Chess>(new Chess());
  const [validMoves, setValidMoves] = useState<string[]>([]);
  const [targetSquare, setTargetSquare] = useState<string>("");
  const [applyCustomStyles, setApplyCustomStyles] = useState(true);

  console.log(
    `--- Current State ---\n
    Socket: ${socket}\n
    Join Message: ${joinMessage}\n
    Side: ${side}\n
    turn: ${game.turn()}\n
    Valid Moves: ${JSON.stringify(validMoves)}\n
    Target Square: ${targetSquare}\n
    Apply Custom Styles: ${applyCustomStyles}`
  );

  const makeAMove = useCallback(
    (
      move: { from: string; to: string; promotion?: string },
      send: boolean
    ): Move | null => {
      console.log("make move function");
      const gameCopy = new Chess(game.fen());
      let result: Move | null = null;
      try {
        result = gameCopy.move(move);
        console.log(
          `\n--- MakeMove ---\nResult: ${result}\n\nGame Copy:`,
          gameCopy,
          result,
          `\nCurrent FEN: ${game.fen()}\n`
        );
      } catch (err) {
        toast.error("invalid move");
      }

      if (result) {
        if (send) {
          socket?.send(
            JSON.stringify({
              type: "move",
              data: {
                nextTurn: game.turn() === "w" ? "B" : "W",
                gameId: joinMessage?.gameId,
                move,
              },
            })
          );
        }
        setGame(gameCopy);
        new MakeSound(gameCopy);
      }

      return result;
    },
    [game, socket, joinMessage?.gameId]
  );

  function onDrop(sourceSquare: string, targetSquare: string): boolean {
    if (side === "noMove") return true;
    console.log(side);
    if (game.turn() === "w" && side === "B") return false;
    if (game.turn() === "b" && side === "W") return false;

    const move = makeAMove(
      {
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
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
    if (side === "noMove") return;
    if (game.turn() === "w" && side === "B") return;
    if (game.turn() === "b" && side === "W") return;

    const moves = game.moves({ square, verbose: true });
    console.log(
      `--- onPieceClick ---\nMoves:`,
      moves,
      "\npiece: ",
      piece,
      "\nsquare: ",

      square,
      "\n"
    );
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
        case "move":
          toast.success("move");
          makeAMove(data.move, false);
          break;
        case "gameOver":
          console.log(data);
          toast.error(`Connection closed: ${data.message}`);
          break;

        case "unknown":
          console.log(data);
          toast.error(`Connection closed: ${data.message}`);
          break;
        case "quit":
          console.log(data);
          toast.error(`Connection closed: ${data.message}`);
      }
    };
  }, [socket, makeAMove]);

  const handelGameTermination = useCallback(() => {
    if (side === "W")
      socket?.send(
        JSON.stringify({
          type: "gameOver",
          data: {
            gameId: joinMessage?.gameId,
          },
        })
      );
  }, [side, socket, joinMessage?.gameId]);

  // check for gameOver case
  useEffect(() => {
    if (game.isGameOver()) {
      toast.success("game over");
      handelGameTermination();
    }
  }, [game, handelGameTermination]);

  // to set side
  useEffect(() => {
    console.log("game side effect", joinMessage?.side);
    setSide(joinMessage?.side as "B" | "W");
  }, [joinMessage?.side]);

  return (
    <ChessContext.Provider
      value={{
        game,
        side,
        validMoves,
        targetSquare,
        applyCustomStyles,
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
    throw new Error("useGameContext must be used within a ChessContext");
  }
  return context;
};
