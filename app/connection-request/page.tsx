"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSocket } from "@/provider/SocketProvider";
import Loader from "@/components/Loader";
import { replaceUnderscores } from "@/utils/helper";
import { toast } from "react-toastify";

interface PlayerProps {
  image: string;
  name: string;
  label: string;
}

const PlayerCard = ({ image, name, label }: PlayerProps) => (
  <div className="flex flex-col items-center bg-gray-800 p-3 phone:p-4 laptop:p-6 rounded-lg shadow-lg w-44 phone:w-48">
    <div className="w-24 h-24 rounded-full border-4 border-gray-600 overflow-hidden  ">
      <Image src={image} width={100} height={100} alt={`${label}-image`} />
    </div>
    <h2 className="text-xl font-medium phone:font-semibold text-white mt-3 whitespace-nowrap line-clamp-1">
      {name || "Player"}
    </h2>
    <p className="text-gray-300 text-base">{label}</p>
  </div>
);

export default function Page() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const {
    setConnectionMode,
    socket,
    setIsConnetingToSocket,
    setInviterId,
    isConnetingToSocket,
  } = useSocket();
  const { userId, name, image } = session?.user || {};

  const inviterId = searchParams.get("inviterId") as string;
  const inviterName = replaceUnderscores(
    searchParams.get("inviterName") as string
  ) as string;
  const inviterImage = ("https://lh3.googleusercontent.com/a/" +
    searchParams.get("inviterImage")) as string;

  const handelJoining = function () {
    if (!userId) {
      toast.error("Please login  first to play");
      return;
    }
    setIsConnetingToSocket(true);
    setConnectionMode("J");
  };

  useEffect(() => {
    setInviterId(inviterId);
  }, [setInviterId, inviterId]);
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-12">
      <h1 className="text-2xl phone:text-3xl laptop:text-4xl font-extrabold mb-8 text-center text-gray-100">
        Match Request
      </h1>

      <div className="flex  gap-4 phone:gap-8 mb-12 flex-wrap items-center justify-center">
        <PlayerCard image={inviterImage} name={inviterName} label="Inviter" />
        <PlayerCard
          image={image || "/blackP.png"}
          name={name || "Player"}
          label="Invitee"
        />
      </div>

      <button
        className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 flex items-center gap-3"
        onClick={handelJoining}
        disabled={isConnetingToSocket}
      >
        <span className="text-lg">Send Connection Request</span>
      </button>

      {isConnetingToSocket && (
        <div className="flex flex-col mt-6 justify-center items-center mb-24 w-full h-full ">
          <p className="text-gray-400 mb-12">Connecting to websocket</p>
          <div className="socket-connecting-loader"> </div>
        </div>
      )}

      {socket?.OPEN && (
        <Loader label={"Joining to Play"} loaderClassName="waiting-to-join " />
      )}
    </div>
  );
}
