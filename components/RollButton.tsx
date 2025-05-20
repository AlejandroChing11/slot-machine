'use client';

import React from 'react';

interface RollButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const RollButton: React.FC<RollButtonProps> = ({ onClick, disabled }) => {
  return (
    <button
      className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-xl shadow-lg ${disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      onClick={onClick}
      disabled={disabled}
    >
      ROLL
    </button>
  );
};

export default RollButton; 