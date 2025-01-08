"use client";
import Image from "next/image";
import React from "react";
import GameQuitButton from "./buttons/GameQuitButton";
import { useGameContext } from "./chess/ChessContextProvider";

type OpponentLabelType = {
  name: string;
  image: string | null;
};

export default function OpponentLabel({
  opponentLabel,
}: {
  opponentLabel: OpponentLabelType;
}) {
  const { capturedPieces } = useGameContext();
  const { name, image } = opponentLabel;
  const isUser = false;

  return (
    <div className="flex justify-between w-[350px] phone:w-[450px] tablet:w-[550px] laptop:w-[660px] p-1 sm-phone:p-2  bg-black text-white border border-gray-700 rounded-lg shadow-lg">
      <div className="flex  gap-4 sm-phone:gap-10 items-center ">
        <Image
          src={image || "/blackP.png"} // Fallback image
          width={42}
          height={42}
          alt="user-image"
          className="rounded-full border-2 w-10 h-10 border-gray-700"
        />
        <span className="text-lg font-semibold">{name || "Opponent"}</span>
      </div>
      {isUser ? <GameQuitButton /> : ""}
    </div>
  );
}
