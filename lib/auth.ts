import crypto from 'crypto';

//COMMENT THE FUNCTION HERE AS A COMMENT TO UNDERSTAND THE FUNCTION
export function hashPassword(password: string): string {
  return crypto
    .createHash('sha256')
    .update(password)
    .digest('hex');
}

export function validatePassword(password: string, hash: string): boolean {
  const inputHash = hashPassword(password);
  return inputHash === hash;
}

export function generateSessionToken(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export enum AuthError {
  INVALID_CREDENTIALS = 'Invalid email or password',
  USER_NOT_FOUND = 'User not found',
  EMAIL_EXISTS = 'Email already exists',
  REGISTRATION_FAILED = 'Registration failed',
  LOGIN_FAILED = 'Login failed',
  UNAUTHORIZED = 'Unauthorized access'
} 