'use client';
import React, { useCallback } from 'react';
import { useGameContext } from './chess/ChessContextProvider';
import { Move } from 'chess.js';

export default function SideBar() {
  const { previousGameStep, viewPreviousGameState } = useGameContext();
  console.log(previousGameStep, 'ddd');

  return (
    <div className="flex flex-col bg-gray-900 shadow-2xl mx-auto min-h-full max-w-96 ">
      <p className="text-center p-2 font-bold text-gray-200">Recent Move</p>
      <ul className="list-disc pl-4">
        {previousGameStep.map((game: game, index) => (
          <li
            key={index}
            className="cursor-pointer hover:text-blue-400"
            onClick={() => viewPreviousGameState(game, index)}
          >
            {`${game.from} → ${game.to} ${
              game.promotion ? `(Promoted to ${game.promotion})` : ''
            }`}
          </li>
        ))}
      </ul>
    </div>
  );
}
