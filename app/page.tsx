'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { GameProvider, useGame } from '@/components/GameContext';
import SlotMachine from '@/components/SlotMachine';
import RollButton from '@/components/RollButton';
import CashoutButton from '@/components/CashoutButton';
import Credits from '@/components/Credits';
import WinMessage from '@/components/WinMessage';
import GameResults from '@/components/GameResults';
import UserLogin from '@/components/UserLogin';
import Loading from '@/components/Loading';

//COMMENT THE COMPONENT HERE AS A COMMENT TO UNDERSTAND THE COMPONENT
const Game = () => {
  const { state, setUser, startSession, rollSlots, cashOut, resetGame, logout } = useGame();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await axios.get('/api/setup');
        setIsInitializing(false);
      } catch (error) {
        console.error('Failed to initialize database:', error);
        setIsInitializing(false);
      }
    };

    initializeDatabase();
  }, []);

  // Start a session when the component mounts if needed
  useEffect(() => {
    // Only start a session if:
    // 1. Database is initialized
    // 2. We've verified if a session exists (from localStorage)
    // 3. No active session exists
    // 4. Not in game over state
    // 5. Not loading
    if (!isInitializing && !state.sessionId && !state.gameOver && !state.isLoading && sessionChecked) {
      startSession();
    }

    // Mark session as checked after first run
    if (!sessionChecked && !isInitializing) {
      setSessionChecked(true);
    }
  }, [isInitializing, state.sessionId, state.gameOver, state.isLoading, sessionChecked, startSession]);

  if (isInitializing) {
    return <Loading fullScreen message="Loading slot machine..." />;
  }

  const handleRoll = () => {
    if (state.credits > 0 && !state.isRolling) {
      rollSlots();
    }
  };

  const handleUserLogin = (userId: string, userName: string, credits?: number) => {
    setUser(userId, userName, credits);
    setShowLoginModal(false);
  };

  const handleContinueAsGuest = () => {
    setShowLoginModal(false);
  };

  const handleAttemptCashout = () => {
    if (state.isLoggedIn) {
      cashOut();
    } else {
      setShowLoginModal(true);
    }
  };

  const handlePlayAgain = () => {
    resetGame();
    startSession();
  };

  const handleLogout = () => {
    logout();
    setTimeout(() => {
      startSession();
    }, 100);
  };

  const isWin = state.symbols &&
    state.symbols[0] === state.symbols[1] &&
    state.symbols[1] === state.symbols[2];

  const winAmount = isWin && state.symbols ?
    (state.symbols[0] === 'cherry' ? 10 :
      state.symbols[0] === 'lemon' ? 20 :
        state.symbols[0] === 'orange' ? 30 : 40) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 text-white p-8">
      {/* Login modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute -top-10 right-0 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center"
            >
              ✕
            </button>
            <UserLogin onUserLogin={handleUserLogin} onContinueAsGuest={handleContinueAsGuest} />
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">🎰 Lucky Casino 🎰</h1>
          {state.isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white text-sm py-1 px-3 rounded"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white text-sm py-1 px-3 rounded"
            >
              Login
            </button>
          )}
        </div>

        {state.isLoggedIn && (
          <div className="text-right mb-2">
            <div className="flex items-center justify-end space-x-2">
              <div className="bg-purple-800 rounded-lg px-3 py-2 flex items-center">
                <span className="text-white font-semibold mr-2">{state.userName}</span>
                <div className="bg-yellow-900 rounded-lg px-3 py-1">
                  <span className="text-xs text-gray-300">Account:</span>
                  <span className="text-yellow-300 font-bold ml-1">
                    {state.userTotalCredits || 0} 💰
                  </span>
                </div>
                {state.sessionId && (
                  <div className="ml-2 bg-green-900 rounded-lg px-3 py-1">
                    <span className="text-xs text-gray-300">Game:</span>
                    <span className="text-green-300 font-bold ml-1">
                      {state.credits} 💰
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {!state.isLoggedIn && (
          <div className="text-center mb-4 bg-yellow-900 bg-opacity-50 rounded-lg p-2 text-yellow-300 text-sm">
            Playing as Guest • <button onClick={() => setShowLoginModal(true)} className="underline hover:text-yellow-200 font-semibold">Login to play with your account credits!</button>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg p-6 shadow-2xl border-2 border-yellow-500">
          {/* Credits display */}
          <div className="mb-6">
            <Credits amount={state.credits} />
          </div>

          {/* Slot machine display */}
          <SlotMachine
            symbols={state.symbols}
            isRolling={state.isRolling}
          />

          {/* Win message */}
          <WinMessage
            isWin={Boolean(isWin)}
            amount={winAmount}
          />

          {/* Game controls */}
          <div className="flex justify-center gap-4 mt-8">
            <RollButton
              onClick={handleRoll}
              disabled={state.isRolling || state.credits < 1 || state.isLoading}
            />
            <CashoutButton
              onClick={handleAttemptCashout}
              disabled={state.isRolling || state.isLoading || state.credits <= 0}
            />
          </div>

          {/* Error message */}
          {state.error && (
            <div className="mt-4 text-red-500 text-center">
              {state.error}
            </div>
          )}

          {/* Loading indicator */}
          {state.isLoading && (
            <div className="mt-4 flex justify-center">
              <Loading message="Processing..." />
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-black bg-opacity-30 p-4 rounded-lg text-sm">
          <h2 className="font-bold mb-2">How to play:</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Each roll costs 1 credit</li>
            <li>Match 3 symbols to win:</li>
            <li>🍒 Cherry: 10 credits</li>
            <li>🍋 Lemon: 20 credits</li>
            <li>🍊 Orange: 30 credits</li>
            <li>🍉 Watermelon: 40 credits</li>
            <li className="mt-2 text-yellow-300 font-semibold border-t border-gray-700 pt-2">Credit System:</li>
            <li><span className="text-gray-400">Guest Players:</span> Always start with 10 credits</li>
            <li><span className="text-gray-400">Registered Players:</span> Play with your actual account balance</li>
            <li><span className="text-white">New accounts:</span> If your balance is 0, you'll get 10 starter credits</li>
            <li className="text-yellow-300 mt-2 border-t border-gray-700 pt-2">Credits won or lost are transferred between your account and the game!</li>
          </ul>
        </div>
      </div>

      {/* Game over overlay */}
      {state.gameOver && (
        <GameResults
          cashedOut={state.cashedOut}
          userTotalCredits={state.userTotalCredits}
          gameOver={state.gameOver}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
};

export default function Home() {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  );
}
