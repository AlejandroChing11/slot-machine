import { GameSession, Symbol, SYMBOLS, SYMBOL_VALUES } from './types';
import { v4 as uuidv4 } from 'uuid';

const sessions: Record<string, GameSession> = {};

const INITIAL_CREDITS = 10;

export const ROLL_COST = 1;

//COMMENT THE FUNCTION HERE AS A COMMENT TO UNDERSTAND THE FUNCTION
export const createSession = (): GameSession => {
  const id = uuidv4();
  const session: GameSession = {
    id,
    credits: INITIAL_CREDITS,
  };

  sessions[id] = session;
  return session;
};

export const getSession = (id: string): GameSession | null => {
  return sessions[id] || null;
};

export const updateSession = (id: string, updates: Partial<GameSession>): GameSession | null => {
  if (!sessions[id]) return null;

  sessions[id] = {
    ...sessions[id],
    ...updates,
  };

  return sessions[id];
};

export const deleteSession = (id: string): boolean => {
  if (!sessions[id]) return false;

  delete sessions[id];
  return true;
};

export const getRandomSymbol = (): Symbol => {
  const randomIndex = Math.floor(Math.random() * SYMBOLS.length);
  return SYMBOLS[randomIndex];
};

export const shouldReRoll = (credits: number): boolean => {
  if (credits < 40) return false;

  if (credits >= 40 && credits <= 60) {
    return Math.random() < 0.3;
  }

  return Math.random() < 0.6;
};

export const generateRollResult = (credits: number): Symbol[] => {
  const symbols: Symbol[] = [
    getRandomSymbol(),
    getRandomSymbol(),
    getRandomSymbol(),
  ];

  const isWin = symbols[0] === symbols[1] && symbols[1] === symbols[2];

  if (isWin && shouldReRoll(credits)) {
    let newSymbol = getRandomSymbol();
    while (newSymbol === symbols[0]) {
      newSymbol = getRandomSymbol();
    }
    symbols[2] = newSymbol;
  }

  return symbols;
};

export const calculateWin = (symbols: Symbol[]): number => {
  if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
    return SYMBOL_VALUES[symbols[0]];
  }
  return 0;
}; 