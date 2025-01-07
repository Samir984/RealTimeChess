"use client";
import { RiErrorWarningLine } from "react-icons/ri";
import { FaUserFriends } from "react-icons/fa";
import { TbArrowsRandom } from "react-icons/tb";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Loader from "@/components/Loader";
import ClipboardCopy from "@/components/ClipboardCopy";
import { User } from "next-auth";
import { useSocket } from "@/provider/SocketProvider";
import { socketCloseHandler } from "@/utils/helper";
import { useEffect, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { toast } from "react-toastify";

interface UserInfoProps {
  user: User;
  find: boolean;
}

interface UserCardProps {
  image?: string | null;
  name?: string | null;
  label: string;
}

export default function Page() {
  const { data: session } = useSession();

  return (
    <div className="text-white py-8 relative min-h-screen flex flex-col items-center">
      <ConnectionNote />
      <div className="flex flex-col justify-center items-center mt-32 px-4">
        <h1 className="text-2xl phone:text-3xl laptop:text-4xl text-slate-200 font-extrabold mb-5 phone:mb-10 text-center leading-tight">
          Connection with Player
        </h1>

        <ConnectionButtons userId={session?.user?.email} />

        <div className="flex flex-col items-center">
          {session?.user ? (
            <UserInfo user={session.user} find={true} />
          ) : (
            <div className="mt-8 p-4 bg-gray-800 text-white text-center rounded-lg shadow-lg">
              <p className="text-xl font-semibold">Please Login first</p>
              <p className="mt-2 text-slate-500">
                You need to log in to play online
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ConnectionButtons Component
const ConnectionButtons = ({
  userId,
}: {
  userId: string | null | undefined;
}) => {
  const [showCloseButton, setShowCloseButton] = useState(false);
  const {
    socket,
    setConnectionMode,
    setIsConnetingToSocket,
    connetionMode,
    isConnetingToSocket,
  } = useSocket();
  console.log(userId, "setInviterId\n\n\n");
  const handelSocketConnetion = function (connectMode: "R" | "F") {
    if (!userId) {
      toast.error("Please login first");
      return;
    }

    if (socket?.OPEN === 1 || connetionMode === connectMode) {
      setConnectionMode(undefined);
      socketCloseHandler(socket, connetionMode, userId);
      return;
    }
    setIsConnetingToSocket(true);
    setConnectionMode(connectMode);
  };

  useEffect(() => {
    let timeOut: NodeJS.Timeout;
    if (isConnetingToSocket) {
      timeOut = setTimeout(() => {
        if (isConnetingToSocket) {
          setShowCloseButton(true);
          toast.success(`Server is staring, it might take max 10-20 second`);
        }
      }, 4000);
    }

    return () => {
      setShowCloseButton(false);
      clearTimeout(timeOut);
    };
  }, [isConnetingToSocket]);

  return (
    <div>
      <div className="flex gap-6 mb-12 flex-wrap  items-center justify-center">
        <button
          className={`bg-blue-700 whitespace-nowrap text-white font-medium phone:font-semibold py-2 px-3  laptop:py-3 laptop:px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 flex items-center gap-3 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed ${
            socket?.OPEN && connetionMode === "R" && "bg-red-700"
          }`}
          onClick={() => handelSocketConnetion("R")}
          disabled={isConnetingToSocket}
        >
          <TbArrowsRandom size={24} className="text-blue-300" />
          <span className="text-lg">
            {socket?.OPEN ? "Close Socket Connetion " : "Connect with Random"}
          </span>
        </button>
        <button
          className={`bg-green-700 whitespace-nowrap text-white font-medium phone:font-semibold py-2 px-3  laptop:py-3 laptop:px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 flex items-center gap-3 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed ${
            socket?.OPEN && connetionMode === "F" && "bg-red-700"
          }`}
          onClick={() => handelSocketConnetion("F")}
          disabled={isConnetingToSocket}
        >
          <FaUserFriends size={24} className="text-green-300" />
          {socket?.OPEN ? "Close Socket Connetion " : "Connect with Friend"}
        </button>

        <button
          className={`flex flex-col items-center  bg-red-800   p-2 rounded-lg font-medium  absolute  transition-all duration-300 z-50 ${
            showCloseButton ? "top-20" : "-top-36"
          } `}
          onClick={() => {
            setConnectionMode(undefined);
            socket?.close();
          }}
        >
          <IoMdCloseCircle size={24} />
          <span className="text-[12px]">Close Requesting</span>
        </button>
      </div>
      {isConnetingToSocket && (
        <div className="flex flex-col mt-6 justify-center items-center mb-24 w-full h-full ">
          <p className="text-gray-400 mb-12">Connecting to websocket</p>
          <div className="socket-connecting-loader"> </div>
        </div>
      )}
    </div>
  );
};

// UserInfo Component
const UserInfo = ({ user }: UserInfoProps) => {
  const { connetionMode, socket, isConnetingToSocket, joiningLink } =
    useSocket();

  return (
    <div className="flex flex-col items-center gap-y-4 w-64 laptop:w-80">
      <div className="flex items-center justify-between w-full">
        <span className="text-base text-gray-400">You</span>
        <UserCard image={user?.image} name={user?.name} label="user" />
      </div>

      {connetionMode === "F" && joiningLink === null && !isConnetingToSocket ? (
        <Loader
          label="Generating Connection Link"
          loaderClassName="generating-link-loader"
        />
      ) : (
        connetionMode === "F" &&
        joiningLink !== null &&
        !isConnetingToSocket && (
          <div className="flex  flex-col items-center">
            <span className="text-gray-400 text-base">
              Share this link with your friend
            </span>
            <ClipboardCopy
              value={`${window?.location.origin}/connection-request${joiningLink}`}
            />
          </div>
        )
      )}

      {socket?.OPEN && (
        <Loader
          label={`${
            connetionMode === "F"
              ? "Waiting for friend to join"
              : connetionMode === "R"
              ? "Waiting for opponent"
              : ""
          } `}
          loaderClassName="waiting-to-join "
        />
      )}
    </div>
  );
};

const UserCard = ({ image, name, label }: UserCardProps) => (
  <div className="flex items-center px-2 py-3 gap-4 text-white bg-gray-800 rounded-lg shadow-md">
    <Image
      src={image || "/whiteP.png"}
      width={48}
      height={48}
      alt={`${label}-image`}
      className="rounded-full"
    />
    <span className="text-base">{name || "Player"}</span>
  </div>
);

// ConnectionNote Component
const ConnectionNote = () => {
  const [show, setShow] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setShow(false);
    }, 10000);
  }, []);
  if (!show) return;
  return (
    <div className="flex items-center line-clamp-5 gap-2 phone:gap-4 bg-gray-800 text-yellow-300 text-sm  font-normal phone:font-medium  px-3 py-2 phone:px-4 phone:py-3 laptop:px-6 laptop:py-4 rounded-lg shadow-lg absolute top-4 left-1/2 transform -translate-x-1/2 w-[90%]">
      <RiErrorWarningLine className="w-6 h-6 phone:w-7 phone:h-7  flex-shrink-0 " />
      <p>
        <strong>Note:</strong> Playing with a random person may occasionally
        result in connection issues, as our site is still growing. For a
        smoother and more reliable experience, we recommend playing with a
        friend.
      </p>
    </div>
  );
};
