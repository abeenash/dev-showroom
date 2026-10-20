// Ported from the Lovable draft. Only import this from "use client" files:
// GSAP touches `window`, which doesn't exist while a Server Component renders.
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// MorphSVG (free since GSAP 3.13, ships in the same `gsap` package) tweens one SVG path's
// shape into another: the contact blobs and the avatar's expressions use it.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, MorphSVGPlugin, useGSAP);
}

// Media queries for gsap.matchMedia(). `desktop` matches Tailwind's `lg` (1024px),
// so the pinned layouts and the `lg:motion-safe:js:` classes always agree.
export const MQ = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 1024px)",
};

export { gsap, MorphSVGPlugin, ScrollTrigger, SplitText, useGSAP };
