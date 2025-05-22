'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useGame } from './GameContext';

interface CashoutButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

/**
 * CashoutButton Component
 * 
 * This component provides a button for users to cash out their credits.
 * It includes mischievous behavior:
 * - On hover, 80% chance it jumps 300px in a random direction
 * - 70% chance it becomes temporarily unclickable
 * - After 10 jump attempts, the button behavior normalizes
 * - Players must roll at least REQUIRED_ROLLS times before cashout is allowed
 * 
 * @param onClick Function to call when button is clicked
 * @param disabled Whether the button should be disabled
 */
const CashoutButton: React.FC<CashoutButtonProps> = ({ onClick, disabled }) => {
  const { state } = useGame();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isJumping, setIsJumping] = useState(false);
  const [isClickable, setIsClickable] = useState(true);
  const [jumpCount, setJumpCount] = useState(0);
  const [forceEnable, setForceEnable] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const REQUIRED_ROLLS = 2;
  const notEnoughRolls = state.rollCount < REQUIRED_ROLLS;
  const finalDisabled = disabled || (notEnoughRolls && !forceEnable);

  useEffect(() => {
    setPosition({ x: 0, y: 0 });
    setIsJumping(false);
    setIsClickable(true);
    setJumpCount(0);
    setForceEnable(false);
  }, [state.userId, state.sessionId]);

  const handleMouseEnter = () => {
    if (jumpCount < 10 && !forceEnable) {
      if (Math.random() < 0.8) {
        const angle = Math.random() * Math.PI * 2;
        const jumpX = Math.cos(angle) * 300;
        const jumpY = Math.sin(angle) * 300; 

        setPosition({ x: jumpX, y: jumpY });
        setIsJumping(true);
        setJumpCount(prevCount => prevCount + 1);

        setTimeout(() => {
          setPosition({ x: 0, y: 0 });
          setIsJumping(false);
        }, 500);
      }

      if (Math.random() < 0.7) {
        setIsClickable(false);

        setTimeout(() => {
          setIsClickable(true);
        }, 800);
      }
    }
  };

  useEffect(() => {
    if (jumpCount >= 10 && !forceEnable) {
      setForceEnable(true);
      setIsClickable(true);
    }
  }, [jumpCount]);

  const buttonStyle = {
    transform: isJumping ? `translate(${position.x}px, ${position.y}px)` : 'translate(0, 0)',
    transition: isJumping ? 'transform 0.2s ease-out' : 'transform 0.5s ease-in-out',
  };

  return (
    <div style={buttonStyle} className="relative">
      <button
        ref={buttonRef}
        className={`bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-xl shadow-lg ${(!isClickable || finalDisabled)
          ? 'opacity-50 cursor-not-allowed'
          : 'animate-pulse-slow'
          }`}
        onClick={() => {
          if ((isClickable || forceEnable) && !finalDisabled) {
            onClick();
          }
        }}
        onMouseEnter={!forceEnable ? handleMouseEnter : undefined}
        disabled={(!isClickable && !forceEnable) || finalDisabled}
      >
        CASH OUT
      </button>

      {forceEnable && (
        <div className="absolute top-full left-0 right-0 mt-2 text-xs text-green-300 text-center">
          The casino has stopped playing games with you. Cash out now!
        </div>
      )}
    </div>
  );
};

export default CashoutButton; 