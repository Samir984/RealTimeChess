import Image from "next/image";
import { MdOutlineOnlinePrediction } from "react-icons/md";
import GoogleSigninButton from "./buttons/GooleSigninButton";
import { MdOutlineReportGmailerrorred } from "react-icons/md";
import Link from "next/link";

export default function MainNav() {
  return (
    <div className="flex  sm-phone:gap-0 justify-start items-center sm-phone:flex-col flex-row sm-phone:h-screen bg-gray-black backdrop-blur-sm">
      <Logo />

      <nav className="sm-phone:mt-8 text-gray-300 sm-phone:w-full">
        <ul className="sm-phone:w-full flex sm-phone:flex-col gap-1 w-fit">
          <li className="flex w-full phone:block">
            <Link
              href="/online"
              className="flex gap-4 justify-center phone:justify-normal items-center py-2 px-4 phone:rounded-lg hover:bg-gray-800/60 transition-colors w-full group"
            >
              <MdOutlineOnlinePrediction
                size={24}
                className="text-blue-400 group-hover:text-blue-300 transition-colors"
              />
              <span className="text-lg hidden phone:block font-medium text-gray-100 group-hover:text-white">
                Online
              </span>
            </Link>
          </li>
          <li className="flex w-full phone:block">
            <Link
              href="/report"
              className="flex gap-4 justify-center phone:justify-normal items-center py-2 px-4 phone:rounded-lg hover:bg-gray-800/60 transition-colors w-full group"
            >
              <MdOutlineReportGmailerrorred
                size={24}
                className="text-purple-400 group-hover:text-purple-300 transition-colors"
              />
              <span className="text-lg hidden phone:block font-medium text-gray-100 group-hover:text-white">
                Report
              </span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="mt-auto mb-1 sm-phone:w-full rounded-lg sm-phone:rounded-xl text-white ml-auto sm-phone:ml-0 bg-gray-800/50 hover:bg-gray-700/60 backdrop-blur-sm transition-colors">
        <GoogleSigninButton />
      </div>
    </div>
  );
}

export function Logo() {
  return (
    <Link
      href="/"
      className="sm-phone:w-full min-w-16 hover:bg-gray-800/30 rounded-xl transition-colors"
    >
      <div className="flex phone:py-7 p-0 bg-black px-1 items-center justify-center h-10 gap-2 font-semibold text-3xl w-full font-sans text-center bg-gray-00 border-b border-gray-700/60">
        <span className="text-xl hidden font-light phone:block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Chessconnect
        </span>
        <div className="flex  flex-shrink-0 gap-1">
          <Image
            src={"/ll.png"}
            width={40}
            height={40}
            alt="chess_logo"
            className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]"
          />
        </div>
      </div>
    </Link>
  );
}
