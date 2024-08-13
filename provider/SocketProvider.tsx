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
import toast from "react-hot-toast";

export interface JoinedMessage {
  type: "joined";
  gameId: string;
  side: "W" | "B";
  opponent: {
    name: string;
    image: string | null;
  };
}

export type GameModeType = "R" | "F" | undefined;

interface SocketContext {
  socket: WebSocket | null;
  setConnectionMode: React.Dispatch<React.SetStateAction<GameModeType>>;
  connetionMode: GameModeType;
  joinMessage: JoinedMessage | null;
  isConnetingToSocket: boolean;
  joiningLink: null | string;
  setIsConnetingToSocket: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultSocketContext: SocketContext = {
  socket: null,
  setConnectionMode: () => {}, // Placeholder function, will be overwritten by provider
  connetionMode: undefined,
  joinMessage: null,
  isConnetingToSocket: false,
  setIsConnetingToSocket: () => {},
  joiningLink: null,
};

const SocketContext = createContext<SocketContext>(defaultSocketContext);

export default function SocketProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isConnetingToSocket, setIsConnetingToSocket] = useState(false);
  const [joiningLink, setJoiningLink] = useState<string | null>(null);
  const [connetionMode, setConnectionMode] = useState<GameModeType>(undefined);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const user = session?.user;
  const [joinMessage, setJoinMessage] = useState<JoinedMessage | null>(null);
  const { email, name, image } = user || {};
  console.log(connetionMode, socket?.OPEN);

  useEffect(() => {
    if (!connetionMode || !email) return;
    console.log(connetionMode, email);

    const ws = new WebSocket(
      `ws://localhost:8080?userId=${email}&name=${name}&image=${image}&mode=${connetionMode}`
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
          toast.success("join successfully");
          setJoinMessage(data);
          router.push(`online/${data.gameId}`);
          break;
        case "joiningLink":
          console.log(data.joiningLink);
          setJoiningLink(data.joiningLink);
          toast.success("joining link received");
          break;
      }
    };

    ws.onclose = (e) => {
      router.push("/online");
      setIsConnetingToSocket(false);
      if (ws.CLOSED === 3) {
        console.log("socket provider", ws.CLOSED);
        setConnectionMode(undefined);
      }
      toast.error("closed websocket connetion");
      setSocket(null);
    };

    return () => {
      ws.close();
    };
  }, [connetionMode, email, name, image, router]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        joinMessage,
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
