'use client';

import React from 'react';
import { Cherry, Apple, Citrus, Banana } from 'lucide-react';
import { Symbol } from '@/lib/types';

interface SlotIconProps {
  size?: number;
  className?: string;
}

export const SlotIconCherry: React.FC<SlotIconProps> = ({ size = 48, className = '' }) => (
  <Cherry size={size} className={`text-red-500 ${className}`} />
);

export const SlotIconLemon: React.FC<SlotIconProps> = ({ size = 48, className = '' }) => (
  <Citrus size={size} className={`text-yellow-400 ${className}`} />
);

export const SlotIconOrange: React.FC<SlotIconProps> = ({ size = 48, className = '' }) => (
  <Apple size={size} className={`text-orange-500 ${className}`} />
);

// Using Banana for Watermelon since Lucide doesn't have a watermelon icon
export const SlotIconWatermelon: React.FC<SlotIconProps> = ({ size = 48, className = '' }) => (
  <Banana size={size} className={`text-green-500 ${className}`} />
);

interface SlotIconComponentProps {
  symbol: Symbol;
  size?: number;
  className?: string;
}

export const SlotIconComponent: React.FC<SlotIconComponentProps> = ({
  symbol,
  size = 48,
  className = ''
}) => {
  switch (symbol) {
    case 'cherry':
      return <SlotIconCherry size={size} className={className} />;
    case 'lemon':
      return <SlotIconLemon size={size} className={className} />;
    case 'orange':
      return <SlotIconOrange size={size} className={className} />;
    case 'watermelon':
      return <SlotIconWatermelon size={size} className={className} />;
    default:
      return null;
  }
};

export const SpinningIcon: React.FC<SlotIconProps> = ({ size = 48, className = '' }) => {
  return (
    <div className={`animate-spin-slow ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" className="text-gray-400" />
        <path
          d="M12 2a10 10 0 1 0 10 10"
          strokeDasharray="30"
          strokeDashoffset="0"
          className="text-purple-500"
        />
        <path d="M12 8v4l3 3" className="text-white" />
      </svg>
    </div>
  );
}; 