// "server-only" makes the build fail if a client component ever imports this file,
// so the connection string can never end up in browser JavaScript.
import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let db: ReturnType<typeof createDb> | undefined;

function createDb(url: string) {
  // Neon's HTTP driver: one fetch per query, no open connections. Fits serverless functions on Vercel.
  return drizzle(neon(url), { schema });
}

/** The database client, or null when DATABASE_URL isn't set (callers must handle that calmly). */
export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  db ??= createDb(url);
  return db;
}

export { schema };
