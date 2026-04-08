import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

declare global {
  var prisma: PrismaClient | undefined;
}

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);

export const db =
  globalThis.prisma ||
  new PrismaClient({
    adapter,
    log: ["query", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}
