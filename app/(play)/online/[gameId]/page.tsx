"use client";
import ChessBoard from "@/components/chess/ChessBoard";
import ChesstContextProvider from "@/components/chess/ChessContextProvider";
import OpponenetLabel from "@/components/OpponenetLabel";
import YourLabel from "@/components/YourLabel";
import { useSocket } from "@/provider/SocketProvider";
import { useRouter } from "next/navigation";

export default function PlayOnline() {
  const { joinMessage } = useSocket();
  const router = useRouter();

  if (joinMessage === null) {
    router.push("/online");
    return;
  }
  console.log(joinMessage?.opponent, joinMessage);

  return (
    <div className=" text-white min-h-screen py-3  ">
      <h1 className="text-2xl text-center tablet:text-3xl laptop:text-4xl font-bold mb-2 laptop:mb-6">
        Online Mode
      </h1>
      <div className="flex gap-2 phone:gap-4 flex-col items-center">
        <div>
          <ChesstContextProvider>
          <OpponenetLabel opponentLabel={joinMessage.opponent} />
            <ChessBoard
              orientation={joinMessage.side == "W" ? "white" : "black"}
            />
          <YourLabel />
          </ChesstContextProvider>
        </div>
      </div>
    </div>
  );
}
