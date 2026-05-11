import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

function createPool() {
  if (!databaseUrl) {
    return null;
  }

  if (globalForDb.__arenaNextJsPostgresqlPool) {
    return globalForDb.__arenaNextJsPostgresqlPool;
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes("sslmode=require") || databaseUrl.includes("neon.tech")
      ? { rejectUnauthorized: false }
      : undefined,
  });

  if (process.env.NODE_ENV !== "production") {
    globalForDb.__arenaNextJsPostgresqlPool = pool;
  }

  return pool;
}

export const pool = createPool();

export const db = pool ? drizzle(pool) : null!;

// Helper to check if DB is available
export function isDatabaseAvailable(): boolean {
  return pool !== null && databaseUrl !== undefined;
}
