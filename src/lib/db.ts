import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

declare global {
  var prisma: PrismaClient | undefined;
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}

const connectionUrl = new URL(process.env.DATABASE_URL);

if (
  process.env.NODE_ENV !== "production" &&
  !connectionUrl.searchParams.has("allowPublicKeyRetrieval")
) {
  connectionUrl.searchParams.set("allowPublicKeyRetrieval", "true");
}

const adapter = new PrismaMariaDb(connectionUrl.toString());

export const db =
  globalThis.prisma ||
  new PrismaClient({
    adapter,
    // log: ["query", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}
