"use client";
import { Chessboard } from "react-chessboard";
import { useGameContext } from "./ChessContextProvider";
import { useEffect, useState, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import CustomeKingPieces, { KingStatus } from "./CustomeKingPieces";

export default function ChessBoard({
  orientation,
}: {
  orientation: "white" | "black";
}) {
  const [boardWidth, setBoardWidth] = useState<number>(660);
  const squareSize = useMemo(() => boardWidth / 8, [boardWidth]);

  const {
    game,
    validMoves,
    applyCustomStyles,
    onDrop,
    onSquareClick,
    onPieceClick,
  } = useGameContext();

  const getKingStatus = useCallback(
    (kingColor: "w" | "b"): KingStatus => {
      if (game.isGameOver()) {
        if (game.isDraw()) {
          toast.success("game is draw");
          return "D";
        }
        return game.isCheckmate() && game.turn() === kingColor ? "L" : "W";
      }
      return null;
    },
    [game]
  );

  const getSquarePosition = useCallback(
    (square: string): { top: number; left: number } => {
      const file = square[0];
      const rank = parseInt(square[1], 10);
      const fileIndex = "abcdefgh".indexOf(file);
      const rankIndex = 8 - rank;
      return {
        top: rankIndex * squareSize,
        left: fileIndex * squareSize,
      };
    },
    [squareSize]
  );

  const kingCustomPieces = useMemo(
    () => ({
      wK: ({ squareWidth }: { squareWidth: number }) => (
        <CustomeKingPieces
          color="white"
          status={getKingStatus("w")}
          squareWidth={squareWidth}
        />
      ),
      bK: ({ squareWidth }: { squareWidth: number }) => (
        <CustomeKingPieces
          color="black"
          status={getKingStatus("b")}
          squareWidth={squareWidth}
        />
      ),
    }),
    [getKingStatus]
  );

  useEffect(() => {
    const updateBoardWidth = () => {
      console.log("poll");
      const width = window.innerWidth;
      if (width < 640) {
        setBoardWidth(350);
      } else if (width < 768) {
        setBoardWidth(450);
      } else if (width < 1024) {
        setBoardWidth(550);
      } else {
        setBoardWidth(660);
      }
    };

    const handleResize = () => {
      updateBoardWidth();
    };

    updateBoardWidth();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const adjustedValidMoves = useMemo(
    () =>
      validMoves.map((square) => {
        const file = square[0];
        const rank = parseInt(square[1], 10);
        if (orientation === "black") {
          const flippedFile = String.fromCharCode(
            "h".charCodeAt(0) - (file.charCodeAt(0) - "a".charCodeAt(0))
          );
          const flippedRank = 9 - rank;
          return flippedFile + flippedRank;
        }
        return square;
      }),
    [orientation, validMoves]
  );

  return (
    <div
      className="relative"
      style={{ minWidth: `${boardWidth}px`, minHeight: `${boardWidth}px` }}
    >
      <Chessboard
        boardWidth={boardWidth}
        boardOrientation={orientation}
        position={game.fen()}
        onPieceDrop={onDrop}
        onSquareClick={onSquareClick}
        onPieceClick={onPieceClick}
        customSquareStyles={{}}
        customDarkSquareStyle={{ backgroundColor: "#0e7490" }}
        customLightSquareStyle={{ backgroundColor: "#cbd5e1" }}
        customPieces={applyCustomStyles ? kingCustomPieces : undefined}
      />
      {adjustedValidMoves.map((square) => {
        const { top, left } = getSquarePosition(square);

        return (
          <div
            key={square}
            style={{
              position: "absolute",
              top: `${top + squareSize / 2}px`,
              left: `${left + squareSize / 2}px`,
              width: `${squareSize / 4}px`,
              height: `${squareSize / 4}px`,
              backgroundColor: "green",
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              border: "2px solid rgba(255, 215, 0, 0.9)",
            }}
          />
        );
      })}
    </div>
  );
}
