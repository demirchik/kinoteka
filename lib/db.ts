import { PrismaClient } from "@prisma/client";
const scope = globalThis as typeof globalThis & { prisma?: PrismaClient };
export const db = scope.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") scope.prisma = db;
