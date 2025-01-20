'use client';

import React, { useState } from 'react';
import { useGameContext } from './chess/ChessContextProvider';

export default function SideBar() {
  const { previousGameState, viewPreviousGameState } = useGameContext();
  const [selectedMoveIndex, setSelectedMoveIndex] = useState<number | null>(
    null
  );

  const handleMoveClick = (state: any, index: number) => {
    setSelectedMoveIndex(index);
    viewPreviousGameState(state, index);
  };

  return (
    <div className="flex flex-col bg-gradient-to-br from-gray-800 via-gray-900 to-black shadow-2xl mx-auto min-h-full max-w-96 rounded-lg border border-gray-700">
      <p className="text-center p-4 font-bold text-gray-200 text-lg tracking-wide border-b border-gray-700">
        Recent Moves
      </p>
      <ul className="list-none pl-4 text-gray-300 divide-y divide-gray-700 h-52 overflow-y-scroll">
        {previousGameState.length > 0 ? (
          [...previousGameState].reverse().map((state, reversedIndex) => {
            const originalIndex = previousGameState.length - 1 - reversedIndex;
            const move = state.move;
            const from = move?.from;
            const to = move?.to;

            const isSelected = selectedMoveIndex === originalIndex;

            return (
              <li
                key={originalIndex}
                className={`cursor-pointer px-4 py-2 rounded-md transition-all duration-200 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/50'
                    : 'hover:bg-gray-700 hover:text-blue-400'
                }`}
                onClick={() => handleMoveClick(state, originalIndex)}
              >
                <span className="text-gray-400">{`${originalIndex + 1}.`}</span>{' '}
                {from} → {to}
              </li>
            );
          })
        ) : (
          <li className="text-gray-500 text-center py-4">No moves yet.</li>
        )}
      </ul>
    </div>
  );
}
