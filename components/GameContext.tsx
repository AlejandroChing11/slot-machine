'use client';

import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import axios from 'axios';
import { Symbol, GameSession, RollResponse, CashoutResponse } from '@/lib/types';
import { GUEST_USER_ID } from '@/lib/constants';
import { setLocalStorage, getLocalStorage, removeLocalStorage, STORAGE_KEYS } from '@/lib/localStorage';

/**
 * GameState defines the structure of our application state
 * This contains all the data needed to render the game UI and track player progress
 */
interface GameState {
  userId: string | null;        // Current user ID (null for guests)
  userName: string | null;      // User's display name
  sessionId: string | null;     // Current game session ID
  credits: number;              // Credits available in the current game session
  symbols: Symbol[] | null;     // Current symbols displayed on the slot machine
  isRolling: boolean;           // Whether the slots are currently spinning
  gameOver: boolean;            // Whether the current game session is over
  error: string | null;         // Error message to display, if any
  cashedOut: number | null;     // Amount of credits cashed out in the last cashout
  userTotalCredits: number | null; // User's account balance (separate from game credits)
  isLoggedIn: boolean;          // Whether the user is authenticated
  isLoading: boolean;           // Whether an API request is in progress
  rollCount: number;            // Number of times the user has rolled in this session
}

/**
 * GameAction defines all possible actions that can modify the game state
 * Each action has a type and may include a payload with additional data
 */
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

/**
 * Initial state for the game
 * All users start with these values before any actions are dispatched
 */
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

/**
 * The gameReducer is responsible for state updates in response to actions
 * It takes the current state and an action, then returns the updated state
 * This follows the Redux pattern for predictable state management
 * 
 * The switch statement handles different action types:
 * - SET_USER: Updates user information when logging in
 * - START_SESSION_SUCCESS: Initializes a new game session
 * - ROLL_SUCCESS: Updates game state after a successful roll
 * - CASHOUT_SUCCESS: Handles credits transfer when cashing out
 * - And many more to handle various game events
 */
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

/**
 * Context definition for the game state and functions
 * This provides the interface that components will use to interact with the game
 */
const GameContext = createContext<{
  state: GameState;
  setUser: (userId: string, userName: string, userCredits?: number) => void;
  startSession: () => Promise<void>;
  rollSlots: () => Promise<void>;
  cashOut: () => Promise<void>;
  resetGame: () => void;
  logout: () => void;
} | undefined>(undefined);

/**
 * GameProvider is a React component that manages game state
 * It uses useReducer to handle state updates and provides context to child components
 * This component handles:
 * - Initial state setup
 * - State persistence with localStorage
 * - Providing game functions to components
 * - API communication for game actions
 */
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

  /**
   * Updates user information and fetches user profile
   * Called when a user logs in or registers
   */
  const setUser = (userId: string, userName: string, userCredits?: number) => {
    dispatch({
      type: 'SET_USER',
      payload: { userId, userName, userCredits },
    });

    fetchUserProfile(userId).then(profile => {
      if (profile) {
        // Profile data will be used to update state with current credits
      }
    });
  };

  /**
   * Fetches the user's profile from the server
   * Updates credit information in the state
   */
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

  /**
   * Starts a new game session or reuses an existing one
   * For logged-in users, uses their account balance as credits
   * For guests, provides 10 starting credits
   */
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

  /**
   * Spins the slot machine to generate new symbols
   * Updates credits based on winning combinations
   */
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

  /**
   * Transfers game credits to the user's account
   * Requires at least 2 rolls before cashout is allowed
   * Ends the current session and logs the user out
   */
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

  /**
   * Resets the game to start a new session
   * Keeps user logged in but clears current game state
   */
  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  /**
   * Logs out the current user
   * Clears all user data from state and localStorage
   */
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

/**
 * Custom hook to access game context from any component
 * Ensures the component is used within a GameProvider
 */
export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}; 