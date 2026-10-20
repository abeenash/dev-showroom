import { index, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Contact form submissions: the only thing on this site that changes, so the only thing in the database.
export const messages = pgTable(
  "messages",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    message: text("message").notNull(),
    // SHA-256 of the sender's IP, used only for rate limiting. The raw IP is never stored.
    ipHash: text("ip_hash").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("messages_ip_hash_created_at_idx").on(t.ipHash, t.createdAt)],
);

export type NewMessage = typeof messages.$inferInsert;
