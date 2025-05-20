'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

//COMMENT THE COMPONENT HERE AS A COMMENT TO UNDERSTAND THE COMPONENT
export default function RootLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialized(true);
    }, 1500);

    async function initializeApp() {
      try {
        const response = await axios.get('/api/setup');
      } catch (error) {
        console.error('Failed to initialize guest user, continuing anyway:', error);
      }
    }

    initializeApp();

    return () => clearTimeout(timer);
  }, []);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-white">Loading game...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 