import { defineConfig } from "drizzle-kit";

// drizzle-kit runs outside Next.js, so it doesn't read .env.local by itself. Node's built-in loader does.
try {
  process.loadEnvFile(".env.local");
} catch {
  // No .env.local (e.g. CI): DATABASE_URL must come from the real environment.
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL ?? "" },
});
