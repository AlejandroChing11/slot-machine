import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GUEST_USER_ID } from '@/lib/constants';

//COMMENT THE FUNCTION HERE AS A COMMENT TO UNDERSTAND THE FUNCTION
export async function GET(request: NextRequest) {
  console.log('Running simplified database initialization');

  try {
    const existingGuestUser = await prisma.user.findUnique({
      where: { id: GUEST_USER_ID },
    });

    if (!existingGuestUser) {
      await prisma.user.create({
        data: {
          id: GUEST_USER_ID,
          name: 'Guest Player',
          email: 'guest@example.com',
          credits: 0,
        },
      });
      console.log('Created guest user');
    }

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully'
    });
  } catch (error) {
    console.error('Error initializing database:', error);

    return NextResponse.json(
      {
        success: false,
        warning: 'There was an issue initializing the database, but the app will continue',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 200 }
    );
  }
} 