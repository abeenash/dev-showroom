"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { fosSteps } from "@/content/projects";
import type { PinStep } from "@/content/types";
import { AccentHeading } from "@/components/ui/AccentHeading";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/lib/gsap";

// HTML states drawn over the real screenshot (never baked into new images).
function Overlay({ kind }: { kind?: PinStep["overlay"] }) {
  if (kind === "alert")
    return (
      <div className="absolute inset-x-2 top-8 border bg-background p-3 font-mono text-xs leading-snug">
        <p className="text-accent-text">● NEW_ORDER</p>
        <p className="mt-1">FOS Live Alerts</p>
      </div>
    );
  if (kind === "offline")
    return (
      <div className="absolute inset-x-0 top-6 bg-foreground px-3 py-2 font-mono text-xs text-background">● Offline</div>
    );
  return null;
}

function Screens({ active }: { active: number }) {
  return (
    <PhoneFrame className="w-full">
      {fosSteps.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-500"
          style={{ opacity: i === active ? 1 : 0 }}
          aria-hidden={i !== active}
        >
          <Image
            src={s.screen.src}
            alt={s.screen.alt}
            fill
            sizes="17rem"
            placeholder="blur"
            className="object-cover object-top"
          />
          <Overlay kind={s.overlay} />
        </div>
      ))}
    </PhoneFrame>
  );
}

export function PinnedStory({ n }: { n: string }) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Same condition as the `lg:motion-safe:js:grid` layout below.
      mm.add(`${MQ.desktop} and ${MQ.motion}`, () => {
        ScrollTrigger.create({
          trigger: ".pin-steps",
          start: "top top",
          end: "bottom bottom",
          pin: ".pin-phone",
          pinSpacing: false,
        });
        // The vermilion rule grows with progress (scaleY = transform only, no layout work).
        gsap.fromTo(
          ".pin-progress",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: ".pin-steps", start: "top center", end: "bottom center", scrub: true },
          },
        );
        // Whichever step crosses 60% of the viewport swaps the phone's screen. (Lovable also faded the
        // other steps to 25% opacity; that failed AA contrast, so the active step's label turns vermilion instead.)
        gsap.utils.toArray<HTMLElement>(".pin-step").forEach((el, i) => {
          ScrollTrigger.create({
            trigger: el,
            start: "top 60%",
            end: "bottom 60%",
            onToggle: (self) => self.isActive && setActive(i),
          });
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="story" aria-labelledby="pin-h" className="shell py-20 md:py-32">
      <AccentHeading n={n} label="Signature" id="pin-h" before="How the FOS app handles a" accent="live" after="order" />

      {/* Desktop with JS and motion: the phone pins while the steps scroll by. */}
      <div className="page-grid mt-20 hidden lg:motion-safe:js:grid">
        <div className="col-span-4 col-start-3">
          <div className="pin-phone flex h-screen items-center">
            <div className="relative w-[17rem]">
              <Screens active={active} />
            </div>
          </div>
        </div>
        <div className="relative col-span-5 col-start-8">
          <span className="pin-progress absolute top-0 left-0 h-full w-px origin-top bg-accent" aria-hidden />
          <ol className="pin-steps border-l">
            {fosSteps.map((s, i) => (
              <li key={s.n} className="pin-step flex min-h-[70vh] flex-col justify-center pl-10">
                <p className={`label transition-colors ${active === i ? "text-accent-text" : ""}`}>Step {s.n}</p>
                <h3 className="mt-3 text-3xl font-medium tracking-tight">{s.title}</h3>
                <p className="mt-4 max-w-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Mobile, reduced motion or no JS: no pinning; tap a step to swap the screen. */}
      <div className="mt-14 lg:motion-safe:js:hidden">
        <div className="mx-auto w-56">
          <Screens active={active} />
        </div>
        <ol className="mt-10 border-t">
          {fosSteps.map((s, i) => (
            <li key={s.n} className="border-b">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={active === i}
                className="w-full py-6 text-left"
              >
                <p className={`label ${active === i ? "text-accent-text" : ""}`}>Step {s.n}</p>
                <h3 className="mt-2 text-2xl font-medium tracking-tight">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{s.body}</p>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
