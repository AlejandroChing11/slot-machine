import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CashoutResponse } from '@/lib/types';
import { GUEST_USER_ID } from '@/lib/constants';

//COMMENT THE FUNCTION HERE AS A COMMENT TO UNDERSTAND THE FUNCTION
export async function POST(request: NextRequest) {
  try {
    const { sessionId, userId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const session = await prisma.gameSession.findUnique({
      where: {
        id: sessionId,
        isActive: true
      },
      include: {
        user: true
      }
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Invalid session ID or session already closed' },
        { status: 404 }
      );
    }

    const isGuestSession = session.userId === GUEST_USER_ID;
    const isUserMismatch = userId && session.userId !== userId;

    if (isGuestSession) {
      return NextResponse.json(
        {
          error: 'You need to create an account to cash out. Please login or register first.',
          requiresLogin: true
        },
        { status: 403 }
      );
    }

    if (isUserMismatch) {
      return NextResponse.json(
        {
          error: 'This session does not belong to your user account.',
          requiresLogin: true
        },
        { status: 403 }
      );
    }

    const creditsOut = session.credits;

    const result = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id: session.userId },
        data: {
          credits: {
            increment: creditsOut
          }
        }
      });


      const closedSession = await tx.gameSession.update({
        where: { id: sessionId },
        data: {
          isActive: false
        }
      });

      return {
        user: updatedUser,
        session: closedSession
      };
    });

    const response: CashoutResponse = {
      sessionId,
      creditsOut,
      success: true,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error cashing out:', error);
    return NextResponse.json(
      { error: 'Failed to cash out' },
      { status: 500 }
    );
  }
} 