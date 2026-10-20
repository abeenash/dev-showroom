"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

// Desktop + motion only: pins `.notes-pin` and scrubs `.notes-track` sideways while you scroll down.
// On phones or with reduced motion, matchMedia never runs this, and the CSS grid layout stays.
export function HorizontalPin({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MQ.desktop} and ${MQ.motion}`, () => {
        const track = ref.current?.querySelector<HTMLElement>(".notes-track");
        if (!track) return;
        // How far the track must travel so its last card ends inside the viewport.
        const dist = () => Math.max(0, track.scrollWidth - window.innerWidth + 80);
        gsap.to(track, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: ".notes-pin",
            start: "top top",
            end: () => `+=${dist()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return <div ref={ref}>{children}</div>;
}
