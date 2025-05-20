'use server';

import { ensureGuestUser } from '@/lib/guestUser';
import { GUEST_USER_ID } from '@/lib/constants';

//COMMENT THE FUNCTION HERE AS A COMMENT TO UNDERSTAND THE FUNCTION
export async function initializeDatabase() {
  try {
    await ensureGuestUser();
    return { success: true };
  } catch (error) {
    console.error('Error in server action:', error);
    return { success: false, error: String(error) };
  }
} 