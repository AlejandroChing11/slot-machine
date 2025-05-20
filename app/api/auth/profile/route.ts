import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AuthError } from '@/lib/auth';

//COMMENT THE FUNCTION HERE AS A COMMENT TO UNDERSTAND THE FUNCTION
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        credits: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: AuthError.USER_NOT_FOUND },
        { status: 404 }
      );
    }

    const activeSession = await prisma.gameSession.findFirst({
      where: {
        userId: user.id,
        isActive: true,
      },
    });

    return NextResponse.json({
      ...user,
      sessionId: activeSession?.id || null,
      sessionCredits: activeSession?.credits || 0,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
} 