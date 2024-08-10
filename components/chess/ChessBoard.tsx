"use client";
import { BOARD_WIDTH, getSquarePosition, SQUARE_SIZE } from "@/utils/helper";
import { useEffect } from "react";
import { Chessboard } from "react-chessboard";
import toast from "react-hot-toast";
import { useGameContext } from "./ChessContextProvider";
import { useSocket } from "@/provider/SocketProvider";

interface ChessboardProps {
  socket: WebSocket | null;
  playerSide: null | "B" | "W" | "noMove";
}

export default function ChessBoard() {
  const { socket, message } = useSocket();

  const {
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
    kingCustomePieces,
  } = useGameContext();

  console.log(message.side);
  useEffect(() => {
    console.log(message.side);

    setSide(message.side);
  }, [message.side, setSide]);

  return (
    <div className="relative min-h-[650px] ">
      <Chessboard
        boardWidth={BOARD_WIDTH}
        position={game.fen()}
        onPieceDrop={onDrop}
        onSquareClick={onSquareClick}
        onPieceClick={onPieceClick}
        customSquareStyles={{}}
        // customDarkSquareStyle={{ backgroundColor: "#0e7490" }}
        // customLightSquareStyle={{ backgroundColor: "#cbd5e1" }}
        customPieces={applyCustomStyles ? kingCustomePieces : undefined}
      />
      {validMoves.map((square) => {
        const { top, left } = getSquarePosition(square);
        return (
          <div
            key={square}
            style={{
              position: "absolute" as "absolute", // Explicit type assertion
              top: `${top + SQUARE_SIZE / 2}px`,
              left: `${left + SQUARE_SIZE / 2}px`,
              width: "16px",
              height: "16px",
              backgroundColor: "white",
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
            }}
          />
        );
      })}
    </div>
  );
}
