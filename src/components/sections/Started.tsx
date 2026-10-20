import Link from "next/link";
import { minis } from "@/content/playground";

// Deliberately quiet: small paper tiles, no big heading. Each opens the original mini-app at /playground/<slug>.
export function Started({ n }: { n: string }) {
  return (
    <section id="started" aria-labelledby="start-h" className="shell py-16">
      <div className="page-grid border-t pt-4 text-sm">
        <p className="label col-span-4 md:col-span-2">{n} — Where I started</p>
        <h2 id="start-h" className="col-span-4 mt-4 text-muted-foreground md:col-span-4 md:mt-0">
          2025: the React mini-projects I learned with, now ported to TypeScript.
        </h2>
        <ul className="col-span-4 mt-6 flex gap-3 md:col-span-5 md:col-start-8 md:mt-0">
          {minis.map((m) => (
            <li key={m.slug} className="flex-1">
              <Link
                href={`/playground/${m.slug}`}
                className="block aspect-square w-full border bg-paper-2 p-3 font-mono text-xs leading-tight transition-transform duration-300 hover:-translate-y-1"
              >
                {m.name}
                <span className="mt-1 block text-accent-text">open ↗</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
