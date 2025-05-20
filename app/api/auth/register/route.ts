import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, AuthError } from '@/lib/auth';

//COMMENT THE FUNCTION HERE AS A COMMENT TO UNDERSTAND THE FUNCTION
export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: AuthError.EMAIL_EXISTS },
        { status: 400 }
      );
    }

    const hashedPassword = hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        credits: 10,
      },
    });

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      credits: user.credits,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { error: AuthError.REGISTRATION_FAILED, details: String(error) },
      { status: 500 }
    );
  }
} 