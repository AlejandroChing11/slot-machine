'use client';

import React from 'react';

interface GameResultsProps {
  cashedOut: number | null;
  userTotalCredits?: number | null;
  gameOver: boolean;
  onPlayAgain: () => void;
}

const GameResults: React.FC<GameResultsProps> = ({ cashedOut, userTotalCredits, gameOver, onPlayAgain }) => {
  if (!gameOver) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full text-center border-4 border-yellow-500 text-white">
        <h2 className="text-2xl font-bold mb-4 text-yellow-400">Cash Out Successful!</h2>
        <p className="text-xl mb-6">
          You cashed out with <span className="font-bold text-yellow-400">{cashedOut}</span> credits!
        </p>
        <div className="text-5xl mb-6">💰</div>

        {userTotalCredits !== null && userTotalCredits !== undefined && (
          <div className="bg-yellow-800 p-4 rounded-lg mb-4 flex items-center justify-center flex-col">
            <div className="flex items-center mb-1">
              <span className="text-xs text-gray-300 mr-2">Previous Balance:</span>
              <span className="text-yellow-200">{(userTotalCredits || 0) - (cashedOut || 0)}</span>
            </div>
            <div className="flex items-center mb-1">
              <span className="text-xs text-gray-300 mr-2">+ Cashed Out:</span>
              <span className="text-green-300">+{cashedOut}</span>
            </div>
            <div className="h-px w-full bg-yellow-600 my-2"></div>
            <div className="flex items-center">
              <span className="text-xs text-gray-300 mr-2">New Balance:</span>
              <span className="text-yellow-300 font-bold text-lg">{userTotalCredits || 0} 💰</span>
            </div>
          </div>
        )}

        <div className="bg-yellow-900 p-4 rounded-lg mb-6 text-sm">
          <p className="text-yellow-200 font-semibold mb-2">You have been logged out for security.</p>
          <p className="text-white">Please log in again to continue playing with your updated credit balance.</p>
        </div>
        <button
          onClick={onPlayAgain}
          className="bg-gradient-to-r from-yellow-600 to-yellow-400 hover:from-yellow-500 hover:to-yellow-300 text-black font-bold py-2 px-6 rounded transform hover:scale-105 transition-transform duration-200"
        >
          Play as Guest
        </button>
      </div>
    </div>
  );
};

export default GameResults; 