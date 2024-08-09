"use client";
import ChessBoard from "@/components/chess/ChessBoard";
import OpponenetLabel from "@/components/OpponenetLabel";
import YourLabel from "@/components/YourLabel";
import { Socket } from "dgram";
import email from "next-auth/providers/email";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function PlayOnline() {

  return (
    <div className="flex gap-2  flex-col  justify-center h-screen ">
      <OpponenetLabel opponentLabel={{ name: "Opponent", image: null }} />
      <ChessBoard chessOptions={{ playerSide: null }} />
      <YourLabel />
    </div>
  );
}
