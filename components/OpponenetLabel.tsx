"use client";
import Image from "next/image";
import React from "react";
import GameQuitButton from "./buttons/GameQuitButton";
import { useGameContext } from "./chess/ChessContextProvider";
import OpponenetCapturePieces from "./OpponenetCapturePieces";
import { useSocket } from "@/provider/SocketProvider";

type OpponentLabelType = {
  name: string;
  image: string | null;
};

export default function OpponentLabel({
  opponentLabel,
  opponentSide,
}: {
  opponentLabel: OpponentLabelType;
  opponentSide: "W" | "B";
}) {
  //hard coded
  const { socket } = useSocket();
  const side = opponentSide;
  const { capturedPieces } = useGameContext();

  // reverse

  const anotherPlayerLoosePieces = capturedPieces[side];

  const { name, image } = opponentLabel;
  const isUser = false;

  return (
    <div className="flex mx-auto justify-between mb-2 w-[350px] phone:w-[450px] tablet:w-[550px] laptop:w-[660px] p-1 phone:p-2  bg-gray-600 text-white border border-gray-700 phone:rounded-lg shadow-lg">
      <div className="flex  gap-2 sm-phone:gap-4  items-center ">
        <Image
          src={image || "/blackP.png"} // Fallback image
          width={42}
          height={42}
          alt="user-image"
          className="border-1 phone:w-12 phone:h-14 w-10 h-10  border-gray-700"
        />
        <div className="grid grid-rows-2 phone:gap-1 ">
          <div className="text-sm flex gap-4 justify-center items-center font-light phone:font-bold self-end phone:self-start ">
            <span>{name || "Opponent"}</span>
            {socket && (
              <div className="flex items-center gap-2 self-start">
                <span className="w-3 h-3 bg-green-400 rounded-full self-center"></span>
                <span className="text-xs phone:text-sm font-light  text-gray-200">
                  online
                </span>
              </div>
            )}
          </div>

          <OpponenetCapturePieces
            pieces={anotherPlayerLoosePieces}
            side={side}
          />
        </div>
      </div>
      {isUser ? <GameQuitButton /> : ""}
    </div>
  );
}
