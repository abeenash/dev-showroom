"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/lib/gsap";

// Fades and lifts every [data-reveal] inside it as it scrolls into view.
// Children stay Server Components: this wrapper only adds behaviour, not markup.
export function RevealRoot({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.from(el, {
            y: 28,
            opacity: 0,
            duration: 0.8,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });
      });
      // Web fonts change line heights; re-measure every trigger once they're in.
      document.fonts.ready.then(() => ScrollTrigger.refresh());
      // useGSAP also reverts everything created in here on unmount (e.g. navigating to /work/fos).
      return () => mm.revert();
    },
    { scope: ref },
  );

  return <div ref={ref}>{children}</div>;
}
