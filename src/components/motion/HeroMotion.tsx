"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MQ, SplitText, useGSAP } from "@/lib/gsap";

// Masked line reveal for `.split-pending` headings, then a soft fade for `.hero-fade` bits.
// CSS hides `.split-pending` only while JS runs (html.js), so there's no flash of unsplit text.
export function HeroMotion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const targets = gsap.utils.toArray<HTMLElement>(".split-pending");
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, (context) => {
        let split: SplitText | undefined;
        let cancelled = false;
        gsap.from(".hero-fade", { opacity: 0, y: 12, duration: 0.8, delay: 0.45, stagger: 0.06, ease: "expo.out" });
        // Split only after the web fonts load, or the line breaks would be measured in the fallback font.
        document.fonts.ready.then(() => {
          if (cancelled) return;
          // context.add: tweens created later (async) still get reverted with this matchMedia context.
          context.add(() => {
            split = SplitText.create(targets, {
              type: "lines",
              mask: "lines",
              linesClass: "line",
              // Re-split on resize; returning the tween lets SplitText keep it in sync instead of replaying.
              autoSplit: true,
              onSplit: (self) => {
                gsap.set(targets, { visibility: "visible" });
                return gsap.from(self.lines, { yPercent: 105, duration: 0.9, stagger: 0.08, ease: "expo.out" });
              },
            });
          });
        });
        return () => {
          cancelled = true;
          split?.revert();
        };
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return <div ref={ref}>{children}</div>;
}
