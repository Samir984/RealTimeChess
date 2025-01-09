"use client";
import Image from "next/image";
import React from "react";
import GameQuitButton from "./buttons/GameQuitButton";
import { useGameContext } from "./chess/ChessContextProvider";
import LoosePieces from "./LoosePieces";

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
  const side = opponentSide;
  const { capturedPieces } = useGameContext();
  const loosePieces = capturedPieces[side];

  console.log(capturedPieces[side], "o");

  const { name, image } = opponentLabel;
  const isUser = false;

  return (
    <div className="flex justify-between mb-2 w-[350px] phone:w-[450px] tablet:w-[550px] laptop:w-[660px] py-0 px-1 phone:p-2  bg-gray-600 text-white border border-gray-700 phone:rounded-lg shadow-lg">
      <div className="flex  gap-2 sm-phone:gap-4  items-center ">
        <Image
          src={image || "/blackP.png"} // Fallback image
          width={42}
          height={42}
          alt="user-image"
          className="border-1 phone:w-12 phone:h-14 w-10 h-10  border-gray-700"
        />
        <div className="grid grid-rows-2 phone:gap-1 ">
          <span className="text-sm font-light phone:font-bold self-end phone:self-start ">
            {name || "Opponent"}
          </span>
          <LoosePieces loosePieces={loosePieces} side={side} />
        </div>
      </div>
      {isUser ? <GameQuitButton /> : ""}
    </div>
  );
}
