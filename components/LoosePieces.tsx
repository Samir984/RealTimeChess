import Image from "next/image";

type PieceType = "p" | "n" | "b" | "r" | "q" | "k";
type LoosePiecesProps = {
  loosePieces: string[];
  side: "W" | "B";
};

const pieceImages: Record<PieceType, { W: string; B: string }> = {
  p: { W: "/pieces/W_P.svg", B: "/pieces/B_P.svg" },
  n: { W: "/pieces/W_N.svg", B: "/pieces/B_N.svg" },
  b: { W: "/pieces/W_B.svg", B: "/pieces/B_B.svg" },
  r: { W: "/pieces/W_R.svg", B: "/pieces/B_R.svg" },
  q: { W: "/pieces/W_Q.svg", B: "/pieces/B_Q.svg" },
  k: { W: "/pieces/W_K.svg", B: "/pieces/B_K.svg" },
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

  return (
    <div className="flex items-center">
      {Object.entries(pieceCounts).map(([piece, count]) =>
        count > 0 ? (
          <div key={piece} className="relative flex items-center">
            <Image
              src={pieceImages[piece as PieceType][side]} // Dynamically choose the image based on side
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
  );
}
