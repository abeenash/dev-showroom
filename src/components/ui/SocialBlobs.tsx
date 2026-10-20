"use client";

import { useRef } from "react";
import { socials } from "@/content/site";
import { BLOBS } from "@/lib/blob";
import { gsap, loadMorphSVG, MQ, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { BRAND_GLYPHS } from "./brand-glyphs";

// Four social icons, each in a soft blob. Layers, so tweens never fight over the same transform:
//   li.social-item   → entrance (rises in once)
//   span.social-float → idle float (sine loops on y and rotation)
//   span.social-hello → the "hello" bounce when you come back to the tab
//   svg.blob / svg.icon → blob shape (MorphSVG) and the CSS hover lift
// With reduced motion none of the GSAP runs: static icons, and hover only changes colour.
export function SocialBlobs() {
  const ref = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, (context) => {
        const list = ref.current;
        if (!list) return;
        const items = gsap.utils.toArray<HTMLElement>(".social-item");

        // 1. Entrance: rise in with a stagger when the list scrolls into view.
        gsap.from(items, {
          y: 28,
          opacity: 0,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.09,
          scrollTrigger: { trigger: list, start: "top 92%", once: true },
        });

        // 2. Idle loops, created paused. Different durations per icon, so they never move in sync.
        const loops: gsap.core.Animation[] = [];
        items.forEach((item, i) => {
          const float = item.querySelector(".social-float");
          const d = 2.4 + i * 0.45;
          loops.push(
            gsap.fromTo(float, { y: -6 }, { y: 6, duration: d, ease: "sine.inOut", yoyo: true, repeat: -1, paused: true }),
            gsap.fromTo(float, { rotation: -3 }, { rotation: 3, duration: d * 1.37, ease: "sine.inOut", yoyo: true, repeat: -1, paused: true }),
          );
        });
        // Blob morphs need MorphSVG, loaded on demand. context.add: tweens created after the await
        // still belong to this matchMedia context, so they're reverted with everything else.
        let cancelled = false;
        loadMorphSVG().then(() => {
          if (cancelled) return;
          context.add(() => {
            items.forEach((item, i) => {
              const blob = item.querySelector(".blob-path");
              // Through the 3 shapes and back: one A → B → C pass takes 6–8s.
              const leg = (6 + i * 0.6) / 2;
              const order = [BLOBS[(i + 1) % 3], BLOBS[(i + 2) % 3]];
              loops.push(
                gsap
                  .timeline({ repeat: -1, yoyo: true, paused: true })
                  .to(blob, { morphSVG: order[0], duration: leg, ease: "sine.inOut" })
                  .to(blob, { morphSVG: order[1], duration: leg, ease: "sine.inOut" }),
              );
            });
            sync();
          });
        });

        // 3. Only run them while someone can see them: the section is on screen AND the tab is visible.
        //    Saves battery, and moving content stops when it isn't being looked at (WCAG 2.2.2).
        let onScreen = false;
        function sync() {
          const run = onScreen && document.visibilityState === "visible";
          loops.forEach((l) => (run ? l.play() : l.pause()));
        }
        ScrollTrigger.create({
          trigger: list.closest("section") ?? list,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            onScreen = self.isActive;
            sync();
          },
        });

        // 4. Page Visibility API: coming back to the tab with Contact on screen → one small "hello" bounce.
        const onVisibility = () => {
          sync();
          if (document.visibilityState === "visible" && onScreen) {
            gsap.fromTo(
              ".social-hello",
              { y: 0, scale: 1 },
              { keyframes: { y: [0, -10, 0], scale: [1, 1.08, 1] }, duration: 0.5, ease: "power1.inOut", stagger: 0.07 },
            );
          }
        };
        document.addEventListener("visibilitychange", onVisibility);
        return () => {
          cancelled = true;
          document.removeEventListener("visibilitychange", onVisibility);
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <ul ref={ref} className="flex flex-wrap gap-5">
      {socials.map((s, i) => (
        <li key={s.name} className="social-item">
          <a
            href={s.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`${s.name}, opens in a new tab`}
            className="group block rounded-full focus-visible:outline-offset-4"
          >
            <span className="social-float block">
              <span className="social-hello relative block size-16">
                <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" aria-hidden>
                  <path
                    d={BLOBS[i % 3]}
                    className="blob-path fill-paper-2 transition-colors duration-300 group-hover:fill-accent group-focus-visible:fill-accent"
                  />
                </svg>
                <svg
                  viewBox="0 0 24 24"
                  className="absolute top-1/2 left-1/2 -mt-3 -ml-3 size-6 fill-foreground transition-[fill,transform] duration-300 group-hover:fill-background group-focus-visible:fill-background motion-safe:group-hover:-translate-y-1 motion-safe:group-focus-visible:-translate-y-1"
                  aria-hidden
                >
                  <path d={BRAND_GLYPHS[s.icon]} />
                </svg>
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
