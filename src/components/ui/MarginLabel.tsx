import type { ReactNode } from "react";

// "01 — WORK" in the left gutter (columns 1–2); section content starts at column 3.
export function MarginLabel({ n, children }: { n: string; children: ReactNode }) {
  return (
    <p className="label col-span-4 md:col-span-2">
      {n} — {children}
    </p>
  );
}
