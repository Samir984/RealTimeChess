'use client';
import React from 'react';
import { useGameContext } from './chess/ChessContextProvider';

export default function SideBar() {
  const { previousGameStep, viewPreviousGameState } = useGameContext();

  return (
    <div className="flex flex-col bg-gray-900 shadow-2xl mx-auto min-h-full max-w-96">
      <p className="text-center p-2 font-bold text-gray-200">Recent Moves</p>
      <ul className="list-disc pl-4 text-gray-300">
        {previousGameStep.length > 0 ? (
          previousGameStep.map((move, index) => (
            <li
              key={index}
              className="cursor-pointer hover:text-blue-400"
              onClick={() => viewPreviousGameState(move, index)}
            >
              {`${index + 1}. ${move.from} → ${move.to} ${
                move.promotion ? `(Promoted to ${move.promotion})` : ''
              }`}
            </li>
          ))
        ) : (
          <li className="text-gray-500">No moves yet.</li>
        )}
      </ul>
    </div>
  );
}
