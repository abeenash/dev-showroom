import { recognition } from "@/content/recognition";
import { AccentHeading } from "@/components/ui/AccentHeading";
import { HandNote } from "@/components/ui/HandNote";
import { Lightbox } from "@/components/ui/Lightbox";

// Server Component; only the "view" link is a client island (Lightbox).
export function Recognition({ n }: { n: string }) {
  let row = 0;

  return (
    <section id="recognition" aria-labelledby="rec-h" className="shell py-20 md:py-32">
      <AccentHeading n={n} label="Recognition" id="rec-h" accent="Not to brag," after="but…" />

      <div className="mt-14 space-y-12 md:ml-[calc(2/12*100%)]">
        {recognition.map((g) => (
          <div key={g.name}>
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
              <h3 className="label">{g.name}</h3>
              {g.caption && <HandNote>{g.caption}</HandNote>}
            </div>
            <ul className="mt-3">
              {g.awards.map((a) => {
                const first = row++ === 0;
                return (
                  <li
                    key={a.title + a.detail}
                    className="grid grid-cols-[4.5rem_1fr_auto] items-baseline gap-4 border-t py-5 md:grid-cols-[7rem_1fr_auto]"
                  >
                    <span className="font-mono text-xs text-muted-foreground">{a.year}</span>
                    <div>
                      <p className={first ? "text-3xl font-medium tracking-tight md:text-5xl" : "text-xl tracking-tight"}>
                        {a.title}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">{a.detail}</p>
                    </div>
                    <Lightbox title={a.title} images={a.images} className="link-draw font-mono text-xs text-accent-text">
                      view
                    </Lightbox>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
