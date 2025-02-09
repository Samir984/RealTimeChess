"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";

export interface JoinedMessage {
  type: "joined";
  gameId: string;
  side: "W" | "B";
  opponent: {
    name: string;
    image: string | null;
  };
}

export type GameModeType = "R" | "F" | "J" | undefined;

interface SocketContext {
  socket: WebSocket | null;
  inviterId: string | null;
  setConnectionMode: React.Dispatch<React.SetStateAction<GameModeType>>;
  connetionMode: GameModeType;
  joinMessage: JoinedMessage | null;
  isConnetingToSocket: boolean;
  joiningLink: null | string;
  setInviterId: React.Dispatch<React.SetStateAction<string | null>>;
  setIsConnetingToSocket: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultSocketContext: SocketContext = {
  socket: null,
  setConnectionMode: () => {},
  connetionMode: undefined,
  joinMessage: null,
  isConnetingToSocket: false,
  inviterId: null,
  setInviterId: () => {},
  setIsConnetingToSocket: () => {},
  joiningLink: null,
};

const SocketContext = createContext<SocketContext>(defaultSocketContext);

export default function SocketProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isConnetingToSocket, setIsConnetingToSocket] = useState(false);
  const [inviterId, setInviterId] = useState<string | null>(null);
  const [joiningLink, setJoiningLink] = useState<string | null>(null);
  const [connetionMode, setConnectionMode] = useState<GameModeType>(undefined);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [joinMessage, setJoinMessage] = useState<JoinedMessage | null>(null);
  const { email,userId, name, image } = session?.user || {};

  const resetState = () => {
    setIsConnetingToSocket(false);
    setInviterId(null);
    setJoiningLink(null);
    setConnectionMode(undefined);
    setJoinMessage(null);
  };

  useEffect(() => {
    if (!connetionMode || !userId) return;

    // const ws = new WebSocket(
    //   `wss://shine-holy-society.glitch.me/?userId=${userId}&name=${name}&image=${image}&mode=${connetionMode}&inviterId=${inviterId}`
    // );

    const ws = new WebSocket(
      `ws://localhost:8080?userId=${userId}&name=${name}&image=${image}&mode=${connetionMode}&inviterId=${inviterId}`
    );

    ws.onopen = () => {
      console.log("WebSocket connection opened");
      toast.success("Connected successfully");
      setIsConnetingToSocket(false);
      setSocket(ws);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnetingToSocket(false);
      toast.error("Error connecting");
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data as string);
      console.log(data);

      switch (data.type) {
        case "joined":
          toast.success("Join successfully");
          setJoinMessage(data);
          router.push(`online/${data.gameId}`);
          break;
        case "joiningLink":
          console.log(data.joiningLink);
          setJoiningLink(data.joiningLink);
          toast.success("Inviter link received: Send to your friend");
          break;

        case "expiredJoiningLink":
          console.log(data.message);
          toast.error(
            "Expired connection link: Inviter is no longer connected"
          );
          break;
      }
    };

    ws.onclose = (e) => {
      console.log(e.reason); // Log the reason for closure to the console

      setIsConnetingToSocket(false);

      if (ws.CLOSED === 3) {
        console.log("Socket closed:", ws.CLOSED);
        setConnectionMode(undefined);
      }

      toast.error(
        `WebSocket connection closed: ${e.reason || "Unknown reason"}`
      );

      setSocket(null);
      resetState();
    };

    return () => {
      ws.close();
    };
  }, [connetionMode, email, name, image, router, inviterId]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        joinMessage,
        inviterId,
        setInviterId,
        setConnectionMode,
        connetionMode,
        isConnetingToSocket,
        joiningLink,
        setIsConnetingToSocket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
