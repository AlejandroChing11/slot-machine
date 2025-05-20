'use client';

import React, { useState, useEffect } from 'react';
import { Symbol } from '@/lib/types';
import { SlotIconComponent, SpinningIcon } from './SlotIcons';

interface SlotMachineProps {
  symbols: Symbol[] | null;
  isRolling: boolean;
  onRollComplete?: () => void;
}

const REVEAL_DELAYS = [1000, 2000, 3000];

//COMMENT THE COMPONENT HERE AS A COMMENT TO UNDERSTAND THE COMPONENT
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