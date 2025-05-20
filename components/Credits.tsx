'use client';

import React from 'react';
import { useGame } from './GameContext';

interface CreditsProps {
  amount: number;
}

//COMMENT THE COMPONENT HERE AS A COMMENT TO UNDERSTAND THE COMPONENT
const Credits: React.FC<CreditsProps> = ({ amount }) => {
  const { state } = useGame();
  const isLoggedIn = state.isLoggedIn;
  const accountBalance = state.userTotalCredits || 0;

  const displayAmount = amount;

  const creditSourceText = isLoggedIn
    ? "Your game credits"
    : "Guest credits";

  return (
    <div className="text-center">
      <div className="flex justify-center items-center space-x-2 mb-1">
        <div className="text-lg font-semibold">Game Credits</div>
        <div className={`text-xs px-2 py-1 rounded-full ${isLoggedIn ? 'bg-green-800' : 'bg-yellow-800'}`}>
          {creditSourceText}
        </div>
      </div>

      <div className="bg-yellow-600 text-white text-3xl font-bold py-3 px-8 rounded-lg shadow-md mb-2">
        {displayAmount}
      </div>

      {isLoggedIn && (
        <div className="text-sm text-yellow-300 bg-yellow-900 bg-opacity-50 rounded-lg py-1 px-3 mt-2">
          <span className="font-bold">Account Balance:</span> {accountBalance} 💰
          {state.sessionId && accountBalance === 0 && (
            <span className="block mt-1 text-gray-400 text-xs italic">
              (Credits in play - will return to account on cashout)
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Credits; 