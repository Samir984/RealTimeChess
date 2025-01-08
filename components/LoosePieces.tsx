"use client";

import Image from "next/image";

type PieceType = "p" | "n" | "b" | "r" | "q" | "k";
type LoosePiecesProps = {
  loosePieces: string[];
  side: "W" | "B";
};

const pieceValues: Record<PieceType, number> = {
  p: 1, // Pawn
  n: 3, // Knight
  b: 3, // Bishop
  r: 5, // Rook
  q: 9, // Queen
  k: 0, // King (not counted in total score)
};

export default function LoosePieces({ loosePieces, side }: LoosePiecesProps) {
  // Calculate counts for each piece type
  const pieceCounts = loosePieces.reduce<Record<PieceType, number>>(
    (acc, piece) => {
      if (piece in acc) {
        acc[piece as PieceType]++;
      }
      return acc;
    },
    { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 }
  );

  // Calculate total score
  const totalScore = Object.entries(pieceCounts).reduce(
    (score, [piece, count]) => {
      return score + pieceValues[piece as PieceType] * count;
    },
    0
  );

  return (
    <div className="flex items-center">
      {/* Display Captured Pieces */}
      <div className="flex items-center">
        {Object.entries(pieceCounts).map(([piece, count]) =>
          count > 0 ? (
            <div key={piece} className="relative flex items-center">
              <Image
                src={`./pieces/${side}_${piece.toUpperCase()}.svg`}
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
      </div>

      {/* Display Total Score */}
      {totalScore > 0 && (
        <div className="text-sm font-light sm-phone:font-semibold rounded-full bg-red-600 py-1 px-2 ml-8">
          +{totalScore}
        </div>
      )}
    </div>
  );
}
