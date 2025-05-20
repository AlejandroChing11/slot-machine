export type Symbol = 'cherry' | 'lemon' | 'orange' | 'watermelon';

export const SYMBOLS: Symbol[] = ['cherry', 'lemon', 'orange', 'watermelon'];

export const SYMBOL_VALUES: Record<Symbol, number> = {
  cherry: 10,
  lemon: 20,
  orange: 30,
  watermelon: 40,
};

export const SYMBOL_EMOJIS: Record<Symbol, string> = {
  cherry: '🍒',
  lemon: '🍋',
  orange: '🍊',
  watermelon: '🍉',
};

export interface GameSession {
  id: string;
  credits: number;
  lastRoll?: Symbol[];
  isRolling?: boolean;
}

export interface RollResponse {
  sessionId: string;
  symbols: Symbol[];
  credits: number;
  win: boolean;
  winAmount?: number;
}

export interface CashoutResponse {
  sessionId: string;
  creditsOut: number;
  success: boolean;
  userCredits?: number;
}

export interface StartResponse {
  sessionId: string;
  credits: number;
} 