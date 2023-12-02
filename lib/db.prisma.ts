import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}
// make sure only on prisma instance is created
export const db = globalThis.prisma || new PrismaClient();

// prevent multiple connection due to hot reload in dev
if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
