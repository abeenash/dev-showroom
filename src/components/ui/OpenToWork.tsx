import { site } from "@/content/site";

// No state or effects, so this stays a Server Component (Lovable's version didn't need the client either).
export function OpenToWork() {
  if (!site.openToWork) return null;
  return (
    <p className="flex items-center gap-2.5 font-mono text-sm">
      <span className="pulse-dot inline-block size-2 rounded-full bg-accent text-accent" aria-hidden />
      Open to work
    </p>
  );
}
