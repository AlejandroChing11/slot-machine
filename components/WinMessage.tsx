'use client';

import React, { useEffect, useState } from 'react';

interface WinMessageProps {
  isWin: boolean;
  amount?: number;
}

const WinMessage: React.FC<WinMessageProps> = ({ isWin, amount }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isWin) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isWin, amount]);

  if (!visible || !isWin || !amount) return null;

  return (
    <div className="mt-4 text-center animate-bounce">
      <div className="inline-block bg-green-600 text-white text-xl font-bold py-2 px-4 rounded-lg">
        WIN! +{amount} credits! 🎉
      </div>
    </div>
  );
};

export default WinMessage; 