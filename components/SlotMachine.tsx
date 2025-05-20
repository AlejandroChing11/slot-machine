'use client';

import React, { useState, useEffect } from 'react';
import { Symbol } from '@/lib/types';
import { SlotIconComponent, SpinningIcon } from './SlotIcons';

/**
 * Props for the SlotMachine component
 * @property symbols - The current symbols to display after rolling
 * @property isRolling - Whether the slot machine is currently spinning
 * @property onRollComplete - Optional callback when the roll animation completes
 */
interface SlotMachineProps {
  symbols: Symbol[] | null;
  isRolling: boolean;
  onRollComplete?: () => void;
}

/**
 * Timing delays (in ms) for revealing each slot reel
 * Creates a staggered reveal effect similar to real slot machines
 */
const REVEAL_DELAYS = [1000, 2000, 3000];

/**
 * SlotMachine Component
 * 
 * Renders a three-reel slot machine with spinning animation and staggered reveals.
 * When the user rolls, each reel spins and then reveals its symbol at different
 * times to create suspense.
 * 
 * Features:
 * - Dynamic symbol rendering based on roll results
 * - Spinning animation during the roll
 * - Staggered reveal of each reel's symbol
 * - Callback when animation completes
 */
const SlotMachine: React.FC<SlotMachineProps> = ({
  symbols,
  isRolling,
  onRollComplete
}) => {
  const [revealedIndices, setRevealedIndices] = useState<number[]>([]);

  useEffect(() => {
    if (isRolling) {
      setRevealedIndices([]);

      REVEAL_DELAYS.forEach((delay, index) => {
        const timeoutId = setTimeout(() => {
          setRevealedIndices(prev => [...prev, index]);

          if (index === REVEAL_DELAYS.length - 1 && onRollComplete) {
            onRollComplete();
          }
        }, delay);

        return () => clearTimeout(timeoutId);
      });
    }
  }, [isRolling, onRollComplete]);

  return (
    <div className="grid grid-cols-3 gap-4 my-8 mx-auto">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className="flex items-center justify-center w-24 h-24 bg-gray-800 rounded-lg shadow-lg border-2 border-yellow-500"
        >
          {isRolling && !revealedIndices.includes(index) ? (
            <SpinningIcon size={48} />
          ) : (
            <div className="flex items-center justify-center">
              {symbols && revealedIndices.includes(index)
                ? <SlotIconComponent symbol={symbols[index]} size={48} />
                : <div className="w-12 h-12"></div>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SlotMachine; 