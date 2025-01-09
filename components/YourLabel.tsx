"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import GameQuitButton from "./buttons/GameQuitButton";
import { useSocket } from "@/provider/SocketProvider";
import { useGameContext } from "./chess/ChessContextProvider";
import LoosePieces from "./LoosePieces";

export default function YourLabel({ yourSide }: { yourSide: "W" | "B" }) {
  const { socket } = useSocket();
  const side = yourSide;
  const { capturedPieces } = useGameContext();
  console.log(capturedPieces[side], "y");
  const loosePieces = capturedPieces[side];

  const { data: session } = useSession();
  const isUser = true;

  return (
    <div className="flex justify-between mt-2 w-[350px] phone:w-[450px] tablet:w-[550px] laptop:w-[660px] py-0 px-1 phone:p-2  bg-gray-600 text-white border border-gray-700 phone:rounded-lg shadow-lg">
      <div className="flex gap-2 sm-phone:gap-4 items-center">
        <Image
          src={session?.user?.image || "/whiteP.png"} // Fallback image
          width={30}
          height={30}
          alt="user-image"
          className="border-1 phone:w-12 phone:h-14  w-10 h-10 border-gray-700"
        />
        <div className="grid grid-rows-2 phone:gap-1 ">
          <span className="text-sm font-light phone:font-bold self-end phone:self-start">
            {session?.user?.name || "Player"}
          </span>
          <LoosePieces loosePieces={loosePieces} side={side} />
        </div>
      </div>
      {isUser && socket ? <GameQuitButton /> : ""}
    </div>
  );
}
