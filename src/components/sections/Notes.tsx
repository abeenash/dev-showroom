import { notes } from "@/content/logbook";
import { AccentHeading } from "@/components/ui/AccentHeading";

// The horizontal, pinned layout needs desktop + JS + motion (`lg:motion-safe:js:`), because
// motion/HorizontalPin scrubs it sideways. Everywhere else it's a plain grid, so nothing is clipped.
// (Class names are written out in full: Tailwind can't see names built from template strings.)
export function Notes({ n }: { n: string }) {
  return (
    <section id="notes" aria-labelledby="notes-h" className="overflow-hidden">
      <div className="notes-pin flex flex-col justify-center py-20 lg:motion-safe:js:min-h-screen lg:motion-safe:js:py-0">
        <div className="shell">
          <AccentHeading n={n} label="Notes" id="notes-h" before="Notes from the" accent="work" />
        </div>
        <ol className="notes-track shell mt-14 grid gap-x-8 md:grid-cols-2 lg:grid-cols-3 lg:motion-safe:js:flex lg:motion-safe:js:max-w-none lg:motion-safe:js:flex-row lg:motion-safe:js:pl-[max(2.5rem,calc((100vw-88rem)/2+2.5rem))]">
          {notes.map((note) => (
            <li
              key={note.n}
              className="border-t py-6 lg:motion-safe:js:w-88 lg:motion-safe:js:shrink-0 lg:motion-safe:js:border-t-0 lg:motion-safe:js:border-l lg:motion-safe:js:px-8 lg:motion-safe:js:py-2"
            >
              <p className="font-mono text-xs text-accent-text">
                Logbook #{note.n} — {note.date}
              </p>
              <p className="mt-3 font-mono text-sm leading-relaxed">{note.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
