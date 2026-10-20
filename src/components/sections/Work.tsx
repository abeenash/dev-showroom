import Image from "next/image";
import Link from "next/link";
import { projects, smaller } from "@/content/projects";
import type { Project, ProjectStatus } from "@/content/types";
import { AccentHeading } from "@/components/ui/AccentHeading";
import { HandNote } from "@/components/ui/HandNote";
import { PhoneFrame } from "@/components/ui/PhoneFrame";

const statusLabel: Record<ProjectStatus, string> = {
  Shipped: "● Shipped",
  Built: "● Built",
  "In progress": "○ In progress",
  Mockup: "○ Mockup",
};

function Screens({ p }: { p: Project }) {
  if (p.device === "phone") {
    return (
      <div className="flex items-start gap-4 md:gap-6">
        {p.shots.map((s, k) => (
          <figure key={k} className={`w-[44%] max-w-[15rem] ${k === 1 ? "mt-14" : ""}`}>
            <PhoneFrame shot={s} sizes="(min-width: 768px) 15rem, 44vw" />
            {s.note && (
              <figcaption>
                <HandNote className="mt-4">
                  <span aria-hidden>↑ </span>
                  {s.note}
                </HandNote>
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    );
  }
  // Wide web screenshots: flat hairline frames, the second one overlapping the first.
  const [a, b] = p.shots;
  return (
    <div>
      <Image src={a.src} alt={a.alt} sizes="(min-width: 768px) 45vw, 100vw" placeholder="blur" className="h-auto w-full border" />
      {b && (
        <Image
          src={b.src}
          alt={b.alt}
          sizes="(min-width: 768px) 34vw, 75vw"
          placeholder="blur"
          className="relative -mt-8 ml-auto h-auto w-3/4 border bg-background md:-mt-14"
        />
      )}
    </div>
  );
}

export function Work({ n }: { n: string }) {
  return (
    <section id="work" aria-labelledby="work-h" className="shell py-20 md:py-32">
      <AccentHeading n={n} label="Work" id="work-h" before="Apps people" accent="actually" after="open" />

      <ol className="mt-16 md:mt-24">
        {projects.map((p, i) => {
          const flip = i % 2 === 1;
          return (
            <li key={p.slug} className="page-grid gap-y-10 border-t py-14 md:py-20">
              <div className={`col-span-4 md:col-span-6 ${flip ? "md:order-2 md:col-start-7" : ""}`}>
                <Screens p={p} />
              </div>
              <div className={`col-span-4 md:col-span-5 ${flip ? "md:order-1 md:col-start-1" : "md:col-start-8"}`}>
                <p className="label">
                  {String(i + 1).padStart(2, "0")}
                  {p.period && ` · ${p.period}`}
                </p>
                <h3 data-reveal className="mt-4 text-5xl font-medium tracking-tight md:text-6xl">
                  {p.name}
                </h3>
                <p className="mt-1 font-serif text-2xl italic text-muted-foreground">{p.kind}</p>
                <p className="mt-6 max-w-md leading-relaxed">{p.summary}</p>
                {p.highlight && (
                  <p className="mt-6 max-w-md border-l-2 border-accent pl-4 leading-relaxed">{p.highlight}</p>
                )}
                <p className="mt-6 font-mono text-xs leading-6 text-muted-foreground">{p.stack.join(" / ")}</p>
                {p.videos && (
                  <ul className="mt-4 space-y-1 font-mono text-sm">
                    {p.videos.map((v) => (
                      <li key={v.id}>
                        {/* Jumps to the lite embed in the Videos section, so the visitor stays on the page. */}
                        <a href={`#video-${v.id}`} className="link-draw text-accent-text">
                          ▶ {v.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-6 flex flex-wrap items-center gap-6">
                  <span className="label">{statusLabel[p.status]}</span>
                  {p.hasCaseStudy && (
                    <Link href={`/work/${p.slug}`} className="link-draw font-mono text-sm text-accent-text">
                      Read the case study →
                    </Link>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="page-grid border-t pt-4">
        <p className="label col-span-4 md:col-span-2">Also</p>
        <ul className="col-span-4 mt-3 space-y-1 text-sm text-muted-foreground md:col-span-10 md:mt-0">
          {smaller.map((s) => (
            <li key={s.text}>
              {s.text}
              {s.href && (
                <>
                  {" · "}
                  <a href={s.href} target="_blank" rel="noreferrer" className="link-draw font-mono text-xs text-accent-text">
                    Live ↗
                  </a>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
