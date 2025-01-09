"use client";
import { useSocket } from "@/provider/SocketProvider";
import React from "react";

export default function GameQuitButton() {
  const { socket, joinMessage } = useSocket();
  const quithandler = function () {
    console.log("quit handler running");
    socket?.send(
      JSON.stringify({
        type: "quit",
        data: {
          gameId: joinMessage?.gameId,
          quitter: joinMessage?.side,
        },
      })
    );
  };
  return (
    <button
      className="bg-red-500 text-white px-6 py-1 h-fit rounded hover:bg-red-600 self-center"
      onClick={quithandler}
    >
      Quit
    </button>
  );
}
