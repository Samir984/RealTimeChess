"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import GameQuitButton from "./buttons/GameQuitButton";
import { useSocket } from "@/provider/SocketProvider";
import { useGameContext } from "./chess/ChessContextProvider";

export default function YourLabel() {
  const { capturedPieces } = useGameContext();
  const { data: session } = useSession();
  const { socket } = useSocket();
  const isUser = true;

  return (
    <div className="flex justify-between w-[350px] phone:w-[450px] tablet:w-[550px] laptop:w-[660px] p-1 sm-phone:p-2 phone:py-3  text-white bg-gray-800 rounded-lg shadow-lg">
      <div className="flex gap-4 sm-phone:gap-10 items-center">
        <Image
          src={session?.user?.image || "/whiteP.png"} // Fallback image
          width={42}
          height={4}
          alt="user-image"
          className="rounded-full border-2 w-10 h-10 border-gray-700"
        />
        <span className="text-base">{session?.user?.name || "Player"}</span>
      </div>
      {isUser && socket ? <GameQuitButton /> : ""}
    </div>
  );
}
