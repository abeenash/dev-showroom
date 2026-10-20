import Image from "next/image";
import type { CSSProperties } from "react";
import { recognition } from "@/content/recognition";
import type { Award, Shot } from "@/content/types";
import { AccentHeading } from "@/components/ui/AccentHeading";
import { HandNote } from "@/components/ui/HandNote";
import { Lightbox } from "@/components/ui/Lightbox";
import { HorizontalPin } from "@/components/motion/HorizontalPin";

// A Server Component. Two layouts from one markup:
// - Desktop + JS + motion (`lg:motion-safe:js:`, the same condition as HorizontalPin's matchMedia):
//   all groups sit in one row (`.rec-track`) that HorizontalPin slides sideways while the section is pinned.
// - Everywhere else (phones, reduced motion, no JS): each group is its own native swipe row with
//   CSS scroll-snap. No JavaScript needed; it's a focusable region, so arrow keys scroll it too.
// (Class names are written out in full: Tailwind can't see names built from template strings.)

function ImageCard({ award, shot, index }: { award: Award; shot: Shot; index: number }) {
  const r = shot.src.width / shot.src.height;
  return (
    <li className="shrink-0 snap-start">
      <figure>
        {/* Click = zoom. The image is already on the page; the lightbox only makes it bigger. */}
        <Lightbox title={award.title} images={award.images} start={index} className="block cursor-zoom-in">
          {/* Height is fixed and width follows the aspect ratio (from the static import's width/height),
              so every card has its final size before the image loads: no layout shift, and the pinned
              track's length is right from the start. Phones: at most 80vw wide. */}
          <Image
            src={shot.src}
            alt={shot.alt}
            sizes={`(min-width: 1024px) ${Math.ceil(56 * r)}vh, 80vw`}
            placeholder="blur"
            style={{ "--r": r } as CSSProperties}
            className="h-[min(50vh,calc(80vw/var(--r)))] w-auto border lg:motion-safe:js:h-[56vh]"
          />
        </Lightbox>
        {shot.caption && <figcaption className="mt-2 font-mono text-xs text-muted-foreground">{shot.caption}</figcaption>}
      </figure>
    </li>
  );
}

export function Recognition({ n }: { n: string }) {
  return (
    // overflow-clip, not overflow-hidden: a hidden overflow can still be scrolled by the browser
    // (e.g. when a link inside the moving track gets keyboard focus), which would shift the row.
    <section id="recognition" aria-labelledby="rec-h" className="overflow-clip">
      <HorizontalPin pin=".rec-pin" track=".rec-track" speed={0.55}>
        <div className="rec-pin py-20 md:py-32 lg:motion-safe:js:flex lg:motion-safe:js:min-h-screen lg:motion-safe:js:flex-col lg:motion-safe:js:justify-center lg:motion-safe:js:py-8">
          <div className="shell">
            <AccentHeading n={n} label="Recognition" id="rec-h" accent="Not to brag," after="but…" />
          </div>

          <div className="rec-track mt-12 space-y-14 lg:motion-safe:js:mt-10 lg:motion-safe:js:flex lg:motion-safe:js:gap-x-6 lg:motion-safe:js:space-y-0 lg:motion-safe:js:pl-[max(2.5rem,calc((100vw-88rem)/2+2.5rem))]">
            {recognition.map((g, gi) => (
              <div key={g.name} className="lg:motion-safe:js:shrink-0">
                <p aria-hidden className="label shell lg:motion-safe:js:hidden">
                  {g.name} · swipe →
                </p>
                <div
                  role="region"
                  aria-label={`${g.name}: scroll sideways for more`}
                  tabIndex={0}
                  className="mt-3 snap-x snap-mandatory scroll-px-5 overflow-x-auto md:scroll-px-10 lg:motion-safe:js:mt-0 lg:motion-safe:js:snap-none lg:motion-safe:js:overflow-visible"
                >
                  <ul className="flex w-max items-end gap-6 px-5 pb-4 md:px-10 lg:motion-safe:js:p-0">
                    {/* Chapter card */}
                    <li className="flex w-[58vw] max-w-72 shrink-0 snap-start flex-col justify-end self-stretch border-l-2 border-accent pb-6 pl-5">
                      <h3 className="text-4xl font-medium tracking-tight md:text-5xl">{g.name}</h3>
                      {g.caption && <HandNote className="mt-3">{g.caption}</HandNote>}
                    </li>

                    {g.awards.map((a, ai) => {
                      // The TU topper row (first award of the first group) is the headline card.
                      const headline = gi === 0 && ai === 0;
                      return [
                        <li
                          key={a.title + a.detail}
                          className={`flex shrink-0 snap-start flex-col justify-end self-stretch border-l pb-6 pl-5 ${headline ? "w-[75vw] max-w-120" : "w-[65vw] max-w-80"}`}
                        >
                          {a.year && <p className="font-mono text-xs text-muted-foreground">{a.year}</p>}
                          <h4
                            className={
                              headline
                                ? "mt-3 text-4xl leading-none font-medium tracking-tight md:text-6xl"
                                : "mt-3 text-2xl font-medium tracking-tight md:text-3xl"
                            }
                          >
                            {a.title}
                          </h4>
                          <p className="mt-3 text-sm text-muted-foreground">{a.detail}</p>
                        </li>,
                        ...a.images.map((s, k) => <ImageCard key={s.src.src} award={a} shot={s} index={k} />),
                      ];
                    })}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </HorizontalPin>
    </section>
  );
}
