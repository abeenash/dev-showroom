"use client";

import { useActionState } from "react";
import { sendMessage, type ContactState } from "@/app/actions/contact";

const field = "w-full border-b bg-transparent py-3 text-lg outline-none transition-colors focus:border-accent";
const initial: ContactState = { status: "idle" };

// Contact's client island. `useActionState` gives us the action's last result and a `pending` flag.
// The <form action> also works with JavaScript off: the browser posts it and the page re-renders.
export function ContactForm() {
  const [state, action, pending] = useActionState(sendMessage, initial);

  if (state.status === "ok") {
    return (
      <div aria-live="polite" className="border-t py-8">
        <p className="font-serif text-4xl italic">Thanks, {state.name}.</p>
        <p className="mt-3 text-muted-foreground">Got it. I&apos;ll reply by email.</p>
      </div>
    );
  }

  const err = state.fieldErrors ?? {};
  const v = state.values;

  return (
    // `key` remounts the fields with the echoed values after an error, since React resets forms on submit.
    <form key={JSON.stringify(v)} action={action} className="space-y-6" noValidate>
      <label className="block">
        <span className="label">Name</span>
        <input
          name="name"
          required
          maxLength={100}
          autoComplete="name"
          defaultValue={v?.name}
          aria-invalid={!!err.name}
          aria-describedby={err.name ? "name-err" : undefined}
          className={field}
        />
        {err.name && <span id="name-err" className="mt-1 block font-mono text-xs text-accent-text">{err.name}</span>}
      </label>
      <label className="block">
        <span className="label">Email</span>
        <input
          name="email"
          type="email"
          required
          maxLength={255}
          autoComplete="email"
          defaultValue={v?.email}
          aria-invalid={!!err.email}
          aria-describedby={err.email ? "email-err" : undefined}
          className={field}
        />
        {err.email && <span id="email-err" className="mt-1 block font-mono text-xs text-accent-text">{err.email}</span>}
      </label>
      <label className="block">
        <span className="label">Message</span>
        <textarea
          name="message"
          required
          maxLength={2000}
          rows={4}
          defaultValue={v?.message}
          aria-invalid={!!err.message}
          aria-describedby={err.message ? "message-err" : undefined}
          className={`${field} resize-none`}
        />
        {err.message && (
          <span id="message-err" className="mt-1 block font-mono text-xs text-accent-text">{err.message}</span>
        )}
      </label>

      {/* Honeypot: hidden from people and screen readers; bots tend to fill every field. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <p role="status" aria-live="polite" className="min-h-5 font-mono text-sm text-accent-text">
        {state.status === "error" ? state.message : ""}
      </p>

      <button
        disabled={pending}
        className="bg-foreground px-6 py-3 font-mono text-sm text-background transition-opacity hover:opacity-85 disabled:opacity-50"
      >
        {pending ? "Sending…" : "Send message →"}
      </button>
    </form>
  );
}
