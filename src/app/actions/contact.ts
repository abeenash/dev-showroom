"use server";

// A Server Action: this function runs only on the server, but a <form action={...}> in the browser
// can call it directly. Next.js turns it into a POST endpoint for you (TanStack's createServerFn did the same).
import { createHash } from "node:crypto";
import { and, count, eq, gt } from "drizzle-orm";
import { headers } from "next/headers";
import { after } from "next/server";
import { z } from "zod";
import { site } from "@/content/site";
import { getDb, schema } from "@/db";
import { notifyNewMessage } from "@/lib/notify";

export type ContactState = {
  status: "idle" | "ok" | "error";
  message?: string;
  name?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "message", string>>;
  /** Echoed back so the form can refill itself after an error (React resets forms on submit). */
  values?: { name: string; email: string; message: string };
};

const Contact = z.object({
  name: z.string().trim().min(1, "Please add your name.").max(100, "That name is a bit long."),
  email: z.email("That email doesn't look right.").max(255),
  message: z.string().trim().min(1, "Please write a message.").max(2000, "Please keep it under 2,000 characters."),
});

const LIMIT = 3; // messages per IP…
const WINDOW_MS = 10 * 60 * 1000; // …per 10 minutes

const fallback = `You can email me directly at ${site.email}.`;

export async function sendMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? "").trim(),
    message: String(formData.get("message") ?? ""),
  };

  // Honeypot: a field people never see. Bots fill it; we pretend all went well and store nothing.
  if (String(formData.get("website") ?? "") !== "") {
    return { status: "ok", name: values.name.trim() || "there" };
  }

  const parsed = Contact.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: ContactState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<ContactState["fieldErrors"]>;
      fieldErrors[key] ??= issue.message;
    }
    return { status: "error", message: "A couple of things need fixing.", fieldErrors, values };
  }

  const db = getDb();
  if (!db) {
    // No database configured: say so calmly instead of crashing.
    return { status: "error", message: `The form isn't connected yet. ${fallback}`, values };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  const ipHash = createHash("sha256").update(ip).digest("hex");

  try {
    // Simple per-IP rate limit, stored in the database so it holds across serverless instances.
    const since = new Date(Date.now() - WINDOW_MS);
    const [{ recent }] = await db
      .select({ recent: count() })
      .from(schema.messages)
      .where(and(eq(schema.messages.ipHash, ipHash), gt(schema.messages.createdAt, since)));
    if (recent >= LIMIT) {
      return { status: "error", message: "That's a few messages in a short time. Please try again in a little while.", values };
    }

    await db.insert(schema.messages).values({ ...parsed.data, ipHash });
  } catch (err) {
    console.error("contact: database error", err);
    return { status: "error", message: `Something went wrong on my side. ${fallback}`, values };
  }

  // Saved. The email to Abinash runs after the response is sent, so the visitor sees
  // "Thanks" straight away; on Vercel, after() keeps the function alive until it finishes.
  after(() => notifyNewMessage(parsed.data));

  return { status: "ok", name: parsed.data.name };
}
