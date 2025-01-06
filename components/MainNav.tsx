import Image from "next/image";
// import Chess_logo from "./chess.png";
import { MdOutlineOnlinePrediction } from "react-icons/md";
import GoogleSigninButton from "./buttons/GooleSigninButton";

import Link from "next/link";

export default function MainNav() {
  return (
    <div className="flex gap-4  sm-phone:gap-0 justify-start items-center sm-phone:flex-col flex-row sm-phone:h-screen">
      <Logo />

      <nav className=" sm-phone:mt-8  text-white  sm-phone:w-full  ">
        <ul className="sm-phone:w-full  w-fit">
          <li className="flex  w-full phone:block">
            <Link
              href="/online"
              className="flex gap-4 justify-center phone:justify-normal items-center py-2 px-4 phone:rounded-lg hover:bg-gray-500 transition-colors w-full "
            >
              <MdOutlineOnlinePrediction size={32} />
              <span className="text-xl hidden  phone:block">Play Online</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="mt-auto mb-1 sm-phone:w-full rounded-lg sm-phone:rounded-xl  text-white ml-auto sm-phone:ml-0 bg-gray-800 hover:bg-gray-700 ">
        <GoogleSigninButton />
      </div>
    </div>
  );
}

export function Logo() {
  return (
    <Link href="/" className="sm-phone:w-full min-w-16">
      <div className="flex   py-6 px-1   items-center justify-center  h-10 gap-2 font-semibold text-3xl w-full   font-sans text-center bg-white">
        <span className="text-4xl hidden phone:block">Chess</span>
        <div className="flex flex-shrink-0 ">
          <Image
            src={"/chess.png"}
            width={40}
            height={40}
            alt="chess_logo"
            className="w-8"
          />
          <Image
            src={"/connect.png"}
            width={30}
            height={30}
            alt="chess_logo"
            className="w-8"
          />
        </div>
      </div>
    </Link>
  );
}
