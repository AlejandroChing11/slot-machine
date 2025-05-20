'use client';

import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import axios from 'axios';
import { Symbol, GameSession, RollResponse, CashoutResponse } from '@/lib/types';
import { GUEST_USER_ID } from '@/lib/constants';
import { setLocalStorage, getLocalStorage, removeLocalStorage, STORAGE_KEYS } from '@/lib/localStorage';

interface GameState {
  userId: string | null;
  userName: string | null;
  sessionId: string | null;
  credits: number;
  symbols: Symbol[] | null;
  isRolling: boolean;
  gameOver: boolean;
  error: string | null;
  cashedOut: number | null;
  userTotalCredits: number | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  rollCount: number;
}

type GameAction =
  | { type: 'SET_USER'; payload: { userId: string; userName: string; userCredits?: number } }
  | { type: 'START_SESSION_SUCCESS'; payload: { sessionId: string; credits: number } }
  | { type: 'START_SESSION_ERROR'; payload: string }
  | { type: 'START_ROLL' }
  | { type: 'ROLL_SUCCESS'; payload: RollResponse }
  | { type: 'ROLL_ERROR'; payload: string }
  | { type: 'CASHOUT_SUCCESS'; payload: CashoutResponse }
  | { type: 'CASHOUT_ERROR'; payload: string }
  | { type: 'RESET_GAME' }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'RESTORE_STATE'; payload: Partial<GameState> }
  | { type: 'UPDATE_USER_CREDITS'; payload: number };

const initialState: GameState = {
  userId: null,
  userName: null,
  sessionId: null,
  credits: 0,
  symbols: null,
  isRolling: false,
  gameOver: false,
  error: null,
  cashedOut: null,
  userTotalCredits: null,
  isLoggedIn: false,
  isLoading: false,
  rollCount: 0,
};

//COMMENT THE REDUCER HERE AS A COMMENT TO UNDERSTAND THE REDUCER
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_USER':
      setLocalStorage(STORAGE_KEYS.USER_ID, action.payload.userId);
      setLocalStorage(STORAGE_KEYS.USER_NAME, action.payload.userName);
      setLocalStorage(STORAGE_KEYS.IS_LOGGED_IN, true);

      const newCredits = action.payload.userCredits !== undefined
        ? action.payload.userCredits
        : state.userTotalCredits;

      if (newCredits !== undefined) {
        setLocalStorage(STORAGE_KEYS.USER_CREDITS, newCredits);
      }


      return {
        ...state,
        userId: action.payload.userId,
        userName: action.payload.userName,
        userTotalCredits: newCredits,
        isLoggedIn: true,
      };
    case 'START_SESSION_SUCCESS':
      setLocalStorage(STORAGE_KEYS.SESSION_ID, action.payload.sessionId);

      return {
        ...state,
        sessionId: action.payload.sessionId,
        credits: action.payload.credits,
        gameOver: false,
        error: null,
        cashedOut: null,
        isLoading: false,
        rollCount: 0,
      };
    case 'START_SESSION_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case 'START_ROLL':
      return {
        ...state,
        isRolling: true,
        error: null,
      };
    case 'ROLL_SUCCESS':
      return {
        ...state,
        symbols: action.payload.symbols,
        credits: action.payload.credits,
        isRolling: false,
        error: null,
        rollCount: state.rollCount + 1,
      };
    case 'ROLL_ERROR':
      return {
        ...state,
        isRolling: false,
        error: action.payload,
      };
    case 'CASHOUT_SUCCESS':
      removeLocalStorage(STORAGE_KEYS.SESSION_ID);
      removeLocalStorage(STORAGE_KEYS.USER_ID);
      removeLocalStorage(STORAGE_KEYS.USER_NAME);
      removeLocalStorage(STORAGE_KEYS.IS_LOGGED_IN);

      const updatedCredits = action.payload.userCredits || state.userTotalCredits;

      return {
        ...state,
        gameOver: true,
        cashedOut: action.payload.creditsOut,
        userTotalCredits: updatedCredits,
        sessionId: null,
        isLoading: false,
        userId: null,
        userName: null,
        isLoggedIn: false,
      };
    case 'CASHOUT_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case 'RESET_GAME':
      removeLocalStorage(STORAGE_KEYS.SESSION_ID);

      return {
        ...state,
        sessionId: null,
        credits: 0,
        symbols: null,
        isRolling: false,
        gameOver: false,
        error: null,
        cashedOut: null,
        isLoading: false,
      };
    case 'LOGOUT':
      removeLocalStorage(STORAGE_KEYS.USER_ID);
      removeLocalStorage(STORAGE_KEYS.USER_NAME);
      removeLocalStorage(STORAGE_KEYS.SESSION_ID);
      removeLocalStorage(STORAGE_KEYS.IS_LOGGED_IN);
      removeLocalStorage(STORAGE_KEYS.USER_CREDITS);

      return {
        ...initialState,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'RESTORE_STATE':
      return {
        ...state,
        ...action.payload,
      };
    case 'UPDATE_USER_CREDITS':
      setLocalStorage(STORAGE_KEYS.USER_CREDITS, action.payload);

      return {
        ...state,
        userTotalCredits: action.payload,
      };
    default:
      return state;
  }
};

const GameContext = createContext<{
  state: GameState;
  setUser: (userId: string, userName: string, userCredits?: number) => void;
  startSession: () => Promise<void>;
  rollSlots: () => Promise<void>;
  cashOut: () => Promise<void>;
  resetGame: () => void;
  logout: () => void;
} | undefined>(undefined);


export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (typeof window !== 'undefined') {
      const isLoggedIn = getLocalStorage<boolean>(STORAGE_KEYS.IS_LOGGED_IN, false);
      const userId = getLocalStorage<string | null>(STORAGE_KEYS.USER_ID, null);
      const userName = getLocalStorage<string | null>(STORAGE_KEYS.USER_NAME, null);
      const sessionId = getLocalStorage<string | null>(STORAGE_KEYS.SESSION_ID, null);
      const savedUserCredits = getLocalStorage<number | null>(STORAGE_KEYS.USER_CREDITS, null);


      if (isLoggedIn && userId && userName) {
        dispatch({
          type: 'RESTORE_STATE',
          payload: {
            userId,
            userName,
            isLoggedIn,
            sessionId,
            userTotalCredits: savedUserCredits || 0,
          }
        });

        const updateUserProfile = async () => {
          try {
            const userProfile = await fetchUserProfile(userId);
            if (userProfile && userProfile.credits !== undefined) {
              setLocalStorage(STORAGE_KEYS.USER_CREDITS, userProfile.credits);
            }
          } catch (error) {
            console.error('Failed to update user profile on load:', error);
          }
        };

        updateUserProfile();

        if (sessionId) {
          const verifySession = async () => {
            try {
              const response = await axios.post('/api/start', { userId });
              dispatch({
                type: 'START_SESSION_SUCCESS',
                payload: {
                  sessionId: response.data.sessionId,
                  credits: response.data.credits,
                },
              });
            } catch (error) {
              console.error('Failed to verify session:', error);
              removeLocalStorage(STORAGE_KEYS.SESSION_ID);
            }
          };

          verifySession();
        }
      }
    }
  }, []);

  const setUser = (userId: string, userName: string, userCredits?: number) => {

    dispatch({
      type: 'SET_USER',
      payload: { userId, userName, userCredits },
    });

    fetchUserProfile(userId).then(profile => {
      if (profile) {
        console.log('Updated profile with credits:', profile.credits);
      }
    });
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      const response = await axios.post('/api/auth/profile', { userId });


      dispatch({
        type: 'UPDATE_USER_CREDITS',
        payload: response.data.credits
      });

      return response.data;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      return null;
    }
  };

  const startSession = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const userId = state.isLoggedIn ? state.userId : GUEST_USER_ID;

      const response = await axios.post('/api/start', {
        userId,
      });

      dispatch({
        type: 'START_SESSION_SUCCESS',
        payload: {
          sessionId: response.data.sessionId,
          credits: response.data.credits,
        },
      });

      if (state.isLoggedIn && state.userId) {
        fetchUserProfile(state.userId);
      }
    } catch (error) {
      console.error('Failed to start session:', error);
      dispatch({
        type: 'START_SESSION_ERROR',
        payload: 'Failed to start game session',
      });
    }
  };

  const rollSlots = async () => {
    if (!state.sessionId) return;

    dispatch({ type: 'START_ROLL' });

    try {
      const response = await axios.post('/api/roll', {
        sessionId: state.sessionId,
      });


      setTimeout(() => {
        dispatch({
          type: 'ROLL_SUCCESS',
          payload: response.data,
        });
      }, 3100);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to roll slots';
      dispatch({
        type: 'ROLL_ERROR',
        payload: errorMessage,
      });
    }
  };

  const cashOut = async () => {
    if (!state.sessionId) return;

    const REQUIRED_ROLLS = 2;
    if (state.rollCount < REQUIRED_ROLLS) {
      dispatch({
        type: 'CASHOUT_ERROR',
        payload: `You need to play at least ${REQUIRED_ROLLS} times before cashing out!`
      });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const response = await axios.post('/api/cashout', {
        sessionId: state.sessionId,
        userId: state.userId
      });

      const userCreditsAfterCashout = response.data.userCredits;

      if (userCreditsAfterCashout) {
        dispatch({
          type: 'UPDATE_USER_CREDITS',
          payload: userCreditsAfterCashout
        });
      }

      dispatch({
        type: 'CASHOUT_SUCCESS',
        payload: response.data,
      });

    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to cash out';
      dispatch({
        type: 'CASHOUT_ERROR',
        payload: errorMessage,
      });
    }
  };

  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  if (!mounted) {
    return null;
  }

  return (
    <GameContext.Provider
      value={{
        state,
        setUser,
        startSession,
        rollSlots,
        cashOut,
        resetGame,
        logout
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}; 