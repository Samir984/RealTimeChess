import { useSocket } from "@/provider/SocketProvider";
// import { FaCrown } from "react-icons/fa";

export type KingStatus = "W" | "L" | "D" | null;

interface KingPieceProps {
  color: string;
  status: KingStatus;
  squareWidth: number;
}

export default function CustomeKingPieces({
  color,
  status,
  squareWidth,
}: KingPieceProps) {
  const kingColor =
    status === "L" ? "#c2410c" : status === "W" ? "#15803d" : "#606060";

  return (
    <div
      style={{ position: "relative", width: squareWidth, height: squareWidth }}
    >
      <svg
        viewBox="1 1 43 43"
        width={`${squareWidth}`}
        height={`${squareWidth}`}
        className="block"
      >
        <g>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            width="45"
            height="45"
          >
            <g
              style={{
                fill: kingColor,
                stroke: "rgb(0, 0, 0)",
                strokeWidth: 1.5,
              }}
            >
              <path d="M 22.5,11.63 L 22.5,6" />
              <path d="M 20,8 L 25,8" />
              <path d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25" />
              <path d="M 12.5,37 C 18,40.5 27,40.5 32.5,37 L 32.5,30 C 32.5,30 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,23.5 L 22.5,27 L 22.5,23.5 C 20,16 10.5,13 6.5,19.5 C 3.5,25.5 12.5,30 12.5,30 L 12.5,37" />
              <path d="M 12.5,30 C 18,27 27,27 32.5,30" />
              <path d="M 12.5,33.5 C 18,30.5 27,30.5 32.5,33.5" />
              <path d="M 12.5,37 C 18,34 27,34 32.5,37" />
            </g>
          </svg>
        </g>
      </svg>
      {status && (
        <div
          className="absolute top-0 left-[80%] -translate-x-1/2 text-xs font-meidum phone:text-sm phone:font-semibold tablet:text-base tablet:font-bold -z-10"
          style={{ color: kingColor }}
        >
          {status}
        </div>
      )}
    </div>
  );
}
