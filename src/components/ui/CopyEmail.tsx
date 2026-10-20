"use client";

import { useEffect, useState } from "react";

// The address as a mailto link on one line, plus a small "copy" button.
// The button needs JavaScript (Clipboard API), so it's hidden without it.
export function CopyEmail({ email }: { email: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (status === "idle") return;
    const t = setTimeout(() => setStatus("idle"), 2000);
    return () => clearTimeout(t);
  }, [status]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  };

  return (
    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
      {/* whitespace-nowrap: the address never breaks mid-word. */}
      <a href={`mailto:${email}`} className="link-draw font-mono text-sm whitespace-nowrap text-accent-text sm:text-base">
        {email}
      </a>
      <button type="button" onClick={copy} className="label link-draw hidden hover:text-foreground js:inline">
        {status === "copied" ? "Copied" : "Copy"}
        <span className="sr-only"> email address</span>
      </button>
      {/* Announced by screen readers when it changes. */}
      <span aria-live="polite" className="sr-only">
        {status === "copied" ? "Email address copied" : status === "failed" ? "Couldn't copy. Select the address instead." : ""}
      </span>
    </div>
  );
}
