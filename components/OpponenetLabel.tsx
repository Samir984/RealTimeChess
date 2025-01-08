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
    <div className="flex justify-between w-[350px] phone:w-[450px] tablet:w-[550px] laptop:w-[660px] p-1 sm-phone:p-2  bg-gray-600 text-white border border-gray-700 rounded-lg shadow-lg">
      <div className="flex  gap-2 sm-phone:gap-4  items-center ">
        <Image
          src={image || "/blackP.png"} // Fallback image
          width={42}
          height={42}
          alt="user-image"
          className="border-1 w-12 h-14 border-gray-700"
        />
        <div className="flex flex-col  gap-1">
          <span className="text-sm font-bold">{name || "Opponent"}</span>
          <LoosePieces loosePieces={loosePieces} side={side} />
        </div>
      </div>
      {isUser ? <GameQuitButton /> : ""}
    </div>
  );
}
