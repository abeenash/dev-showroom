"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  /** Selector (inside this wrapper) for the element that stays pinned while you scroll. */
  pin: string;
  /** Selector (inside the pin) for the row that slides sideways. */
  track: string;
  /** Scroll distance per pixel of sideways travel. Below 1 = less scrolling for a long track. */
  speed?: number;
};

// Desktop + motion only: pins `pin` and scrubs `track` sideways while you scroll down.
// Used by Notes and Recognition. On phones or with reduced motion, matchMedia never runs this,
// and each section's CSS fallback (grid / scroll-snap rows) stays.
// Two of these on one page: each is created when it mounts, which is page order, so the second
// pin measures its start after the first pin's spacer is already in place.
export function HorizontalPin({ children, pin, track, speed = 1 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MQ.desktop} and ${MQ.motion}`, () => {
        const row = ref.current?.querySelector<HTMLElement>(track);
        if (!row) return;
        // How far the row must travel so its last card ends inside the viewport.
        const dist = () => Math.max(0, row.scrollWidth - window.innerWidth + 80);
        const tween = gsap.to(row, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: ref.current?.querySelector(pin),
            start: "top top",
            end: () => `+=${dist() * speed}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        // Keyboard users: tabbing to a card that's off to the right scrolls the page to the point
        // where the row has slid it into view (instead of focus landing somewhere invisible).
        const onFocus = (e: FocusEvent) => {
          const el = e.target as HTMLElement;
          const st = tween.scrollTrigger;
          if (!st || el.closest("dialog")) return; // the lightbox sits in the top layer, not the row
          const x = el.getBoundingClientRect().left - row.getBoundingClientRect().left;
          const travel = Math.min(dist(), Math.max(0, x - window.innerWidth / 3));
          window.scrollTo({ top: st.start + travel * speed, behavior: "instant" });
        };
        row.addEventListener("focusin", onFocus);

        // Images have explicit sizes, so nothing should move when they arrive; re-measure once
        // they're all in anyway, in case a browser computed a width differently before decoding.
        let cancelled = false;
        const pending = [...row.querySelectorAll("img")].filter((img) => !img.complete);
        if (pending.length) {
          Promise.all(
            pending.map((img) => new Promise((done) => img.addEventListener("load", done, { once: true }))),
          ).then(() => !cancelled && ScrollTrigger.refresh());
        }
        return () => {
          cancelled = true;
          row.removeEventListener("focusin", onFocus);
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return <div ref={ref}>{children}</div>;
}
