import Image from "next/image";
import { useMemo } from "react";
import { PieceType, useGameContext } from "./chess/ChessContextProvider";

type LoosePiecesProps = {
  pieces: string[];
  anotherside: "W" | "B";
};

const pieceImages: Record<PieceType, { W: string; B: string }> = {
  p: { W: "/pieces/W_P.svg", B: "/pieces/B_P.svg" },
  n: { W: "/pieces/W_N.svg", B: "/pieces/B_N.svg" },
  b: { W: "/pieces/W_B.svg", B: "/pieces/B_B.svg" },
  r: { W: "/pieces/W_R.svg", B: "/pieces/B_R.svg" },
  q: { W: "/pieces/W_Q.svg", B: "/pieces/B_Q.svg" },
  k: { W: "/pieces/W_K.svg", B: "/pieces/B_K.svg" },
};

const piecePoint: Record<PieceType, number> = {
  p: 1, // Pawn
  n: 3, // Knight
  b: 3, // Bishop
  r: 5, // Rook
  q: 9, // Queen
  k: 0, // King (not counted in total score)
};

export default function OpponenetCapturePieces({ pieces, anotherside }: LoosePiecesProps) {
  const { capturedPiecePoints } = useGameContext();
  // Calculate counts for each piece type
  const pieceCounts = useMemo(() => {
    return pieces.reduce<Record<PieceType, number>>(
      (acc, piece) => {
        if (piece in acc) {
          console.log(piece, acc);
          acc[piece as PieceType]++;
        }
        return acc;
      },
      { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 }
    );
  }, [pieces]);

  return (
    <div className="flex items-center phone:h-auto h-[18px]">
      {Object.entries(pieceCounts).map(([piece, count]) =>
        count > 0 ? (
          <div key={piece} className="relative flex items-center">
            <Image
              src={pieceImages[piece as PieceType][anotherside]} // Dynamically choose the image based on side
              alt={piece}
              width={28}
              height={28}
            />
            <span className="absolute text-[8px] text-white sm:phone:font-semibold z-10">
              <sup className="text-xs">{count}</sup>
            </span>
          </div>
        ) : null
      )}
      {/* Display Total Score */}
      {capturedPiecePoints[anotherside] > 0 && (
        <div className="text-[12px] flex items-center justify-center font-light sm-phone:font-semibold  bg-gray-900 p-1 ml-8">
          +{capturedPiecePoints[anotherside]}
        </div>
      )}
    </div>
  );
}
