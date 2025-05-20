'use server';

import { prisma } from './prisma';
import { GUEST_USER_ID } from './constants';
import { hashPassword } from './auth';

//COMMENT THE FUNCTION HERE AS A COMMENT TO UNDERSTAND THE FUNCTION
export async function ensureGuestUser() {
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
          password: hashPassword('guest123'),
          credits: 0,
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error ensuring guest user exists:', error);
    throw error;
  }
} 