import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { StartResponse } from '@/lib/types';
import { ensureGuestUser } from '@/lib/guestUser';
import { GUEST_USER_ID } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const { userId, existingSessionId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const isGuestUser = userId === GUEST_USER_ID;

    if (isGuestUser) {
      await ensureGuestUser();
    } else {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
    }

    if (existingSessionId) {
      const existingSession = await prisma.gameSession.findUnique({
        where: {
          id: existingSessionId,
          isActive: true,
        },
      });

      if (existingSession && (existingSession.userId === userId || (isGuestUser && existingSession.userId === GUEST_USER_ID))) {
        const response: StartResponse = {
          sessionId: existingSession.id,
          credits: existingSession.credits,
        };

        return NextResponse.json(response);
      }
    }

    let existingSession = null;

    if (!isGuestUser) {
      existingSession = await prisma.gameSession.findFirst({
        where: {
          userId,
          isActive: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });
    }

    if (existingSession) {
      const response: StartResponse = {
        sessionId: existingSession.id,
        credits: existingSession.credits,
      };

      return NextResponse.json(response);
    }

    let startingCredits = 10;

    if (!isGuestUser) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { credits: true }
      });

      startingCredits = user?.credits || 0;

      if (startingCredits === 0) {
        startingCredits = 10;
      }

      await prisma.user.update({
        where: { id: userId },
        data: { credits: 0 }
      });

    }

    const session = await prisma.gameSession.create({
      data: {
        userId: userId,
        credits: startingCredits,
        isActive: true,
      },
    });

    const response: StartResponse = {
      sessionId: session.id,
      credits: session.credits,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error starting session:', error);
    return NextResponse.json(
      { error: 'Failed to start game session' },
      { status: 500 }
    );
  }
}

//COMMENT THE FUNCTION HERE AS A COMMENT TO UNDERSTAND THE FUNCTION
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: 'Please use POST method and provide userId' },
    { status: 400 }
  );
} 