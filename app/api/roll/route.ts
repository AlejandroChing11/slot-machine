import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RollResponse, Symbol, SYMBOLS, SYMBOL_VALUES } from '@/lib/types';

const ROLL_COST = 1;

const getRandomSymbol = (): Symbol => {
  const randomIndex = Math.floor(Math.random() * SYMBOLS.length);
  return SYMBOLS[randomIndex];
};

const shouldReRoll = (credits: number): boolean => {
  if (credits < 40) return false;

  if (credits >= 40 && credits <= 60) {
    return Math.random() < 0.3;
  }

  return Math.random() < 0.6;
};

const generateRollResult = (credits: number): Symbol[] => {
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

const calculateWin = (symbols: Symbol[]): number => {
  if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
    return SYMBOL_VALUES[symbols[0]];
  }
  return 0;
};

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const session = await prisma.gameSession.findUnique({
      where: { id: sessionId, isActive: true },
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Invalid session ID or session not active' },
        { status: 404 }
      );
    }

    if (session.credits < ROLL_COST) {
      return NextResponse.json(
        { error: 'Not enough credits to roll' },
        { status: 400 }
      );
    }

    let credits = session.credits - ROLL_COST;

    const symbols = generateRollResult(credits);

    const winAmount = calculateWin(symbols);
    const win = winAmount > 0;

    if (win) {
      credits += winAmount;
    }

    await prisma.gameSession.update({
      where: { id: sessionId },
      data: {
        credits,
        lastRoll: JSON.stringify(symbols),
      },
    });

    const response: RollResponse = {
      sessionId,
      symbols,
      credits,
      win,
      winAmount: win ? winAmount : undefined,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error processing roll:', error);
    return NextResponse.json(
      { error: 'Failed to process roll' },
      { status: 500 }
    );
  }
} 