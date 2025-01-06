"use client";
import { Chessboard } from "react-chessboard";
import { useGameContext } from "./ChessContextProvider";
import { useEffect, useState, useCallback, useMemo } from "react";
import CustomeKingPieces, { KingStatus } from "./CustomeKingPieces";
import { Chess } from "chess.js";
import { toast } from "react-toastify";

export default function ChessBoard({
  orientation,
}: {
  orientation: "white" | "black";
}) {
  const [boardWidth, setBoardWidth] = useState<number>(660);
  const [applyCustomeKingPieces, setApplyCustomeKingPieces] = useState(false);
  const [applyCustomeSquareStyle, setApplyCustomeSquareStyle] = useState(false);

  const squareSize = useMemo(() => boardWidth / 8, [boardWidth]);

  const { game, validMoves, onDrop, onSquareClick, onPieceClick } =
    useGameContext();

  const getKingPosition = useCallback(
    (game: Chess, color: "w" | "b"): string => {
      const board = game.board().flat();
      const kingIndex = board.findIndex(
        (piece) => piece && piece.type === "k" && piece.color === color
      );

      const rank = Math.floor(kingIndex / 8);
      const file = kingIndex % 8;

      // Convert to chess notation
      const fileLetter = String.fromCharCode(97 + file);
      const square = `${fileLetter}${8 - rank}`;
      return square;
    },
    []
  );
  console.log(applyCustomeKingPieces, applyCustomeSquareStyle, "render\n\n\n");

  const getKingStatus = useCallback(
    (game: Chess, kingColor: "w" | "b"): KingStatus => {
      if (game.isGameOver()) {
        if (game.isDraw()) {
          toast("game is draw");
          return "D";
        }
        return game.isCheckmate() && game.turn() === kingColor ? "L" : "W";
      }
      return null;
    },
    []
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

  const customSquareStyles = useMemo(() => {
    const styles: { [key: string]: React.CSSProperties } = {};

    if (game.isCheck()) {
      const kingColor = game.turn();
      const kingSquare = getKingPosition(game, kingColor);

      if (kingSquare) {
        styles[kingSquare] = {
          background: "linear-gradient(135deg, #feb2b2, #f56565)",
          border: "2px solid #e53e3e",
          borderRadius: "6px",
          boxShadow: "0 0 10px rgba(245, 101, 101, 0.6)",
        };
      }
      return styles;
    }

    return styles;
  }, [game, getKingPosition]);

  const kingCustomPieces = useMemo(
    () => ({
      wK: ({ squareWidth }: { squareWidth: number }) => (
        <CustomeKingPieces
          color="white"
          status={getKingStatus(game, "w")}
          squareWidth={squareWidth}
        />
      ),
      bK: ({ squareWidth }: { squareWidth: number }) => (
        <CustomeKingPieces
          color="black"
          status={getKingStatus(game, "b")}
          squareWidth={squareWidth}
        />
      ),
    }),
    [game, getKingStatus]
  );

  // apply side effect with deplay
  useEffect(() => {
    setTimeout(() => {
      console.log("running \n\n\n");
      game.isCheck()
        ? setApplyCustomeSquareStyle(true)
        : setApplyCustomeSquareStyle(false);
      game.isGameOver()
        ? setApplyCustomeKingPieces(true)
        : setApplyCustomeKingPieces(false);
    }, 300);
  }, [game]);

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
        customSquareStyles={
          applyCustomeSquareStyle ? customSquareStyles : undefined
        }
        customDarkSquareStyle={{ backgroundColor: "#0e7490" }}
        customLightSquareStyle={{ backgroundColor: "#cbd5e1" }}
        customPieces={applyCustomeKingPieces ? kingCustomPieces : undefined}
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
