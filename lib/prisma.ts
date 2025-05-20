import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const isServer = typeof window === 'undefined';

export const prisma = isServer
  ? globalForPrisma.prisma || new PrismaClient()
  : (null as unknown as PrismaClient);

if (isServer && process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma; 