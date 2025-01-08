import ChessBoard from "@/components/chess/ChessBoard";
import ChesstContextProvider from "@/components/chess/ChessContextProvider";
import OpponenetLabel from "@/components/OpponenetLabel";
import YourLabel from "@/components/YourLabel";

export default function Home() {
  return (
    <div className=" text-white min-h-screen py-3  ">
      <h1 className="text-2xl text-center tablet:text-3xl laptop:text-4xl font-bold mb-2 laptop:mb-6">
        Offline Mode
      </h1>
      <div className="flex gap-2 phone:gap-4 flex-col items-center">
        <ChesstContextProvider>
          <OpponenetLabel opponentLabel={{ name: "Opponent", image: null }} />
          <ChessBoard orientation="white" />
          <YourLabel />
        </ChesstContextProvider>
      </div>
    </div>
  );
}
