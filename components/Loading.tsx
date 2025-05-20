'use client';

import React from 'react';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  message = 'Loading...',
  fullScreen = false
}) => {
  const loadingContent = (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        {/* Casino chip loader */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-600 to-red-700 shadow-xl animate-spin flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border-4 border-dashed border-yellow-400 animate-spin-slow"></div>
          </div>
        </div>

        {/* Decorative casino elements */}
        <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-yellow-400"></div>
        <div className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-yellow-400"></div>
        <div className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-yellow-400"></div>
        <div className="absolute -bottom-2 -right-2 w-4 h-4 rounded-full bg-yellow-400"></div>
      </div>
      <p className="mt-4 text-white font-medium">{message}</p>
      <div className="flex space-x-4 mt-2">
        <span className="text-2xl animate-pulse">🎰</span>
        <span className="text-2xl animate-pulse delay-100">💰</span>
        <span className="text-2xl animate-pulse delay-200">🎲</span>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-purple-900 to-indigo-900 flex items-center justify-center z-50">
        {loadingContent}
      </div>
    );
  }

  return loadingContent;
};

export default Loading; 