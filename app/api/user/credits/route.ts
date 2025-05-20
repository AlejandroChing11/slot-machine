import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AuthError } from '@/lib/auth';

//COMMENT THE FUNCTION HERE AS A COMMENT TO UNDERSTAND THE FUNCTION
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        credits: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: AuthError.USER_NOT_FOUND },
        { status: 404 }
      );
    }

    return NextResponse.json({ credits: user.credits });
  } catch (error) {
    console.error('Error fetching user credits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user credits' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, amount, operation = 'add' } = await request.json();

    if (!userId || amount === undefined) {
      return NextResponse.json(
        { error: 'User ID and amount are required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: AuthError.USER_NOT_FOUND },
        { status: 404 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        credits: operation === 'add'
          ? { increment: amount }
          : operation === 'subtract'
            ? { decrement: amount }
            : amount
      },
      select: {
        id: true,
        name: true,
        credits: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user credits:', error);
    return NextResponse.json(
      { error: 'Failed to update user credits' },
      { status: 500 }
    );
  }
} 