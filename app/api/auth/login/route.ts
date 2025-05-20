import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validatePassword, AuthError } from '@/lib/auth';
import { GUEST_USER_ID } from '@/lib/constants';

//COMMENT THE FUNCTION HERE AS A COMMENT TO UNDERSTAND THE FUNCTION
export async function POST(request: NextRequest) {
  try {
    const { email, password, currentSessionId } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        credits: true,
        password: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: AuthError.INVALID_CREDENTIALS },
        { status: 401 }
      );
    }

    // Validate password
    const isValidPassword = validatePassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: AuthError.INVALID_CREDENTIALS },
        { status: 401 }
      );
    }

    let activeSession = null;

    // If there's a current guest session, transfer it to the user
    if (currentSessionId) {
      const guestSession = await prisma.gameSession.findUnique({
        where: {
          id: currentSessionId,
          isActive: true,
          userId: GUEST_USER_ID // Make sure it's a guest session
        },
      });

      if (guestSession) {
        // Transfer guest session to this user
        activeSession = await prisma.gameSession.update({
          where: { id: guestSession.id },
          data: { userId: user.id }
        });

      }
    }

    if (!activeSession) {
      activeSession = await prisma.gameSession.findFirst({
        where: {
          userId: user.id,
          isActive: true,
        },
      });
    }

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      ...userWithoutPassword,
      sessionId: activeSession?.id || null,
      sessionCredits: activeSession?.credits || 0,
    });
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json(
      { error: AuthError.LOGIN_FAILED, details: String(error) },
      { status: 500 }
    );
  }
} 