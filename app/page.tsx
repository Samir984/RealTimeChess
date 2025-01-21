import ChessBoard from '@/components/chess/ChessBoard';
import ChesstContextProvider from '@/components/chess/ChessContextProvider';
import OpponenetLabel from '@/components/OpponenetLabel';
import SideBar from '@/components/SideBar';
import YourLabel from '@/components/YourLabel';

export default function Home() {
  return (
    <div className="text-white min-h-screen py-3  ">
      <h1 className="text-2xl text-center tablet:text-3xl laptop:text-4xl font-bold mb-2 laptop:mb-6">
        Offline Mode
      </h1>
      <ChesstContextProvider>
        <div className="flex justify-evenly  px-1 laptop:flex-row flex-col gap-4 ">
          <div className="flex tablet:flex-1 gap-2 phone:gap-4 flex-col">
            <OpponenetLabel
              opponentLabel={{ name: 'Opponent', image: null }}
              opponentSide="B"
            />
            <ChessBoard orientation="white" />
            <YourLabel yourSide="W" />
          </div>
          <div className=" flex-1  px-1">
            <SideBar />
          </div>
        </div>
      </ChesstContextProvider>
    </div>
  );
}
