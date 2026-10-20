"use client";

import Image from "next/image";
import { useState } from "react";
import { fosSteps } from "@/content/projects";
import type { PinStep } from "@/content/types";
import { AccentHeading } from "@/components/ui/AccentHeading";
import { PhoneFrame } from "@/components/ui/PhoneFrame";

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
  const [active, setActive] = useState(0);

  return (
    <section id="story" aria-labelledby="pin-h" className="shell py-20 md:py-32">
      <AccentHeading n={n} label="Signature" id="pin-h" before="How the FOS app handles a" accent="live" after="order" />

      {/* Desktop with JS and motion: the phone pins while the steps scroll by (wired up in phase 4). */}
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
            {fosSteps.map((s) => (
              <li key={s.n} className="pin-step flex min-h-[70vh] flex-col justify-center pl-10">
                <p className="label">Step {s.n}</p>
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
