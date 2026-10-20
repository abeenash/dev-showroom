// Ported from the Lovable draft. Only import this from "use client" files:
// GSAP touches `window`, which doesn't exist while a Server Component renders.
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

// Media queries for gsap.matchMedia(). `desktop` matches Tailwind's `lg` (1024px),
// so the pinned layouts and the `lg:motion-safe:js:` classes always agree.
export const MQ = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 1024px)",
};

export { gsap, ScrollTrigger, SplitText, useGSAP };
