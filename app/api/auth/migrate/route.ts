import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@/lib/auth';

const prisma = new PrismaClient();

//COMMENT THE FUNCTION HERE AS A COMMENT TO UNDERSTAND THE FUNCTION
export async function GET(request: NextRequest) {
  try {
    let passwordExists = false;
    try {
      await prisma.$queryRaw`SELECT password FROM "User" LIMIT 1`;
      passwordExists = true;
    } catch (error) {
      passwordExists = false;
    }

    if (!passwordExists) {
      await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN "password" TEXT DEFAULT '${hashPassword('password123')}' NOT NULL;`);

    } else {
      console.log('Password field already exists in User model');
    }

    return NextResponse.json({
      success: true,
      message: 'Migration completed successfully'
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: 'Migration failed', details: String(error) },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 