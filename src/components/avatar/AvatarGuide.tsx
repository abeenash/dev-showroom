"use client";

import { useRef } from "react";
import { gsap, loadMorphSVG, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { AvatarFace, FACE } from "./AvatarFace";
import { AVATAR_MQ } from "./config";

type Eyes = "open" | "narrow" | "down" | "closed";
type Face = {
  mouth: keyof typeof FACE.mouth;
  brows: [keyof typeof FACE.browL, keyof typeof FACE.browR];
  eyes: Eyes;
  glint?: boolean;
  blush?: boolean;
  wave?: boolean;
  talk?: boolean;
};

const FACES = {
  hello: { mouth: "smile", brows: ["neutral", "neutral"], eyes: "open", wave: true },
  curious: { mouth: "curious", brows: ["neutral", "raised"], eyes: "open" },
  focused: { mouth: "flat", brows: ["focus", "focus"], eyes: "narrow" },
  proud: { mouth: "proud", brows: ["soft", "soft"], eyes: "open" },
  concentrating: { mouth: "flat", brows: ["focus", "focus"], eyes: "open", glint: true },
  talking: { mouth: "open", brows: ["neutral", "neutral"], eyes: "open", talk: true },
  reading: { mouth: "relaxed", brows: ["soft", "soft"], eyes: "down" },
  relaxed: { mouth: "relaxed", brows: ["soft", "soft"], eyes: "open" },
  grin: { mouth: "grin", brows: ["raised", "raised"], eyes: "open", blush: true },
  nostalgic: { mouth: "smile", brows: ["soft", "soft"], eyes: "closed" },
  excited: { mouth: "grin", brows: ["raised", "raised"], eyes: "open", wave: true },
} satisfies Record<string, Face>;

// Where each expression starts, in page order. Each one holds until the next stop's top
// crosses 55% of the viewport.
const STOPS: { sel: string; face: keyof typeof FACES }[] = [
  { sel: 'section[aria-label="Introduction"]', face: "hello" },
  { sel: "#work", face: "curious" },
  { sel: "#work ol > li:nth-child(1)", face: "focused" }, // RMS row
  { sel: "#work ol > li:nth-child(2)", face: "proud" }, // AMS row
  { sel: "#story", face: "concentrating" },
  { sel: "#videos", face: "talking" },
  { sel: "#notes", face: "reading" },
  { sel: "#about", face: "relaxed" },
  { sel: "#recognition", face: "grin" },
  { sel: "#started", face: "nostalgic" },
  { sel: "#contact", face: "excited" },
];

const SIZE = 64;
const SHELL = 1408; // .shell max-width (88rem)
const PAD = 40; // .shell padding from md up

// Loaded (by AvatarGuideLoader) only on wide screens with motion allowed; below that the avatar
// stays docked in the header. The matchMedia here still guards resizes and setting changes.
export function AvatarGuide() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(AVATAR_MQ, (context) => {
        let stopBlink = () => {};
        let cancelled = false;
        // Expressions morph with MorphSVG, so set up once it's loaded. context.add: everything
        // created after the await still belongs to this matchMedia context and gets reverted with it.
        loadMorphSVG().then(() => {
          if (!cancelled) context.add(() => (stopBlink = setup()));
        });
        return () => {
          cancelled = true;
          stopBlink();
        };
      });

      function setup() {
        const el = ref.current;
        const dock = document.querySelector<HTMLElement>(".avatar-dock");
        const heading = document.querySelector<HTMLElement>("#contact-h");
        if (!el || !dock || !heading) return () => {};
        const q = gsap.utils.selector(el);
        const [mouth, browL, browR, eyes, eyesClosed, glint, blush, hand] = [
          ".av-mouth", ".av-brow-l", ".av-brow-r", ".av-eyes", ".av-eyes-closed", ".av-glint", ".av-blush", ".av-hand",
        ].map((s) => q(s)[0]);

        // The docked copy hides while this one is out walking (matchMedia restores it on revert).
        gsap.set(dock, { autoAlpha: 0 });

        // ---- Expressions ----------------------------------------------------------------------
        let current: keyof typeof FACES | null = null;
        let extra: gsap.core.Timeline | null = null; // the wave or the talking loop
        const setFace = (name: keyof typeof FACES) => {
          if (name === current) return;
          current = name;
          el.dataset.face = name; // handy in DevTools (and for the headless checks)
          const f: Face = FACES[name];
          extra?.kill();
          const d = 0.25;
          gsap.to(mouth, { morphSVG: FACE.mouth[f.mouth], duration: d, ease: "power2.out" });
          gsap.to(browL, { morphSVG: FACE.browL[f.brows[0]], duration: d, ease: "power2.out" });
          gsap.to(browR, { morphSVG: FACE.browR[f.brows[1]], duration: d, ease: "power2.out" });
          const eyePose = { open: { scaleY: 1, y: 0 }, narrow: { scaleY: 0.45, y: 0 }, down: { scaleY: 0.8, y: 1.4 }, closed: { scaleY: 1, y: 0 } }[f.eyes];
          gsap.to(eyes, { ...eyePose, autoAlpha: f.eyes === "closed" ? 0 : 1, duration: d, transformOrigin: "50% 50%" });
          gsap.to(eyesClosed, { autoAlpha: f.eyes === "closed" ? 1 : 0, duration: d });
          gsap.to(glint, { autoAlpha: f.glint ? 1 : 0, duration: d });
          gsap.to(blush, { autoAlpha: f.blush ? 1 : 0, duration: d });
          gsap.to(hand, { autoAlpha: 0, duration: 0.15 });
          if (f.wave) {
            extra = gsap
              .timeline({ delay: d })
              .set(hand, { autoAlpha: 1 })
              .fromTo(hand, { rotation: -14 }, { rotation: 16, duration: 0.18, ease: "sine.inOut", yoyo: true, repeat: 5, transformOrigin: "50% 100%" })
              .to(hand, { autoAlpha: 0, duration: 0.2 });
          } else if (f.talk) {
            // Talking: the mouth opens and closes in short bursts, with a pause between sentences.
            extra = gsap
              .timeline({ delay: d, repeat: -1, repeatDelay: 0.6 })
              .to(mouth, { morphSVG: FACE.mouth.flat, duration: 0.12, ease: "sine.inOut", yoyo: true, repeat: 5 });
          }
        };

        // Blink every 3–6s (skipped while the eyes are closed in a smile).
        let blinkCall: gsap.core.Tween;
        const blink = () => {
          if (current !== "nostalgic") gsap.to(eyes, { scaleY: 0.1, duration: 0.07, yoyo: true, repeat: 1, transformOrigin: "50% 50%" });
          blinkCall = gsap.delayedCall(gsap.utils.random(3, 6), blink);
        };
        blinkCall = gsap.delayedCall(gsap.utils.random(3, 6), blink);

        // ---- The walk ---------------------------------------------------------------------------
        // quickTo = a reusable tween that eases toward each new target: the "walking pace" lag
        // (like scrub: 1, but for a position we compute ourselves every scroll frame).
        // One property per quickTo: "scale" is a shorthand GSAP splits into scaleX + scaleY, so a
        // quickTo on it can't be retargeted (Chromium then left it stuck at the docked size).
        const xTo = gsap.quickTo(el, "x", { duration: 1, ease: "power3" });
        const yTo = gsap.quickTo(el, "y", { duration: 1, ease: "power3" });
        const sxTo = gsap.quickTo(el, "scaleX", { duration: 1, ease: "power3" });
        const syTo = gsap.quickTo(el, "scaleY", { duration: 1, ease: "power3" });
        const clamp01 = gsap.utils.clamp(0, 1);

        // Scroll position → where the avatar should be:
        // 1. At the top it sits exactly on the docked copy (scaled down to its 40px).
        // 2. Over the first 240px it detaches: slides into the free margin and grows to 64px.
        // 3. Its height follows page progress, from the top of the screen down to a "landing line"
        //    near the bottom, reached when the contact heading arrives at that line.
        // 4. After that it stays beside "Have something worth building?" and scrolls up with it.
        const target = (snap = false) => {
          const vw = document.documentElement.clientWidth;
          const vh = window.innerHeight;
          const sy = window.scrollY;
          const d = dock.getBoundingClientRect();
          const dockScale = d.width / SIZE;
          const dockX = d.left + d.width / 2 - SIZE / 2;
          const dockY = d.top + sy + d.height / 2 - SIZE / 2; // in page coordinates (the header scrolls)
          const contentLeft = Math.max(0, (vw - SHELL) / 2) + PAD;
          const gutterX = contentLeft - SIZE - 24;
          const landY = vh - SIZE - 48;
          const h = heading.getBoundingClientRect();
          const headingY = h.top + Math.min(h.height, 140) / 2 - SIZE / 2; // beside its first line
          const landAt = Math.max(1, sy + headingY - landY); // scroll position where they meet

          const detach = clamp01(sy / 240);
          const walk = clamp01(sy / landAt);
          const x = dockX + (gutterX - dockX) * detach;
          const y = sy <= landAt ? dockY + (landY - dockY) * walk : Math.max(16, headingY);
          const s = dockScale + (1 - dockScale) * detach;
          if (snap) gsap.set(el, { x, y, scaleX: s, scaleY: s });
          else {
            xTo(x);
            yTo(y);
            sxTo(s);
            syTo(s);
          }
        };

        // Walking: while you scroll it sways side to side with a small bounce, and settles when you
        // stop. Its own wrapper (.av-walk), so it never fights the position or the nudge.
        const walker = q(".av-walk")[0];
        const bob = gsap
          .timeline({ paused: true, repeat: -1, defaults: { duration: 0.17, ease: "sine.inOut" } })
          .to(walker, { rotation: 7, y: -3 })
          .to(walker, { rotation: 0, y: 0 })
          .to(walker, { rotation: -7, y: -3 })
          .to(walker, { rotation: 0, y: 0 });
        let walking = false;
        let settle: gsap.core.Tween | undefined;
        const step = (velocity: number) => {
          if (Math.abs(velocity) < 30) return;
          if (!walking) {
            walking = true;
            bob.invalidate().restart(); // start a fresh stride from the upright pose
          }
          settle?.kill();
          settle = gsap.delayedCall(0.2, () => {
            walking = false;
            bob.pause();
            gsap.to(walker, { rotation: 0, y: 0, duration: 0.25, ease: "power2.out" });
          });
        };

        gsap.set(el, { transformOrigin: "50% 50%" });
        gsap.set(walker, { transformOrigin: "50% 90%" });
        target(true);
        gsap.to(el, { autoAlpha: 1, duration: 0.2 });
        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            target();
            step(self.getVelocity());
          },
          onRefresh: () => target(true),
        });

        // Section stops: change the face, and nudge toward that section's heading as it arrives.
        const nudge = q(".av-nudge")[0];
        const stops = STOPS.flatMap((s) => {
          const node = document.querySelector<HTMLElement>(s.sel);
          return node ? [{ face: s.face, node }] : [];
        });
        stops.forEach((s, i) => {
          const next = stops[i + 1]?.node;
          ScrollTrigger.create({
            trigger: s.node,
            start: "top 55%",
            endTrigger: next ?? undefined,
            end: next ? "top 55%" : "max",
            onEnter: () => {
              setFace(s.face);
              const head = s.node.querySelector("h2, h3");
              if (!head) return;
              const delta = head.getBoundingClientRect().top - el.getBoundingClientRect().top - SIZE / 4;
              gsap
                .timeline()
                .to(nudge, { y: gsap.utils.clamp(-40, 40, delta), duration: 0.6, ease: "power2.out" })
                .to(nudge, { y: 0, duration: 1.2, ease: "power2.inOut" }, "+=0.8");
            },
            onEnterBack: () => setFace(s.face),
          });
        });
        if (!current) setFace("hello");

        // The two sideways pins slide cards through the margin it walks in, so it steps aside
        // (fades out) from the moment either pins until that section has scrolled off the top:
        // after the pin releases, the row stays slid left, with cards still in the margin.
        // (The pin-spacer GSAP wraps around each pinned block spans the whole pinned scroll.)
        document.querySelectorAll<HTMLElement>(".notes-pin, .rec-pin").forEach((pin) => {
          ScrollTrigger.create({
            trigger: pin.closest(".pin-spacer") ?? pin,
            start: "top top",
            end: "bottom top",
            onToggle: (self) => gsap.to(el, { autoAlpha: self.isActive ? 0 : 1, duration: 0.3 }),
          });
        });

        return () => blinkCall?.kill();
      }

      return () => mm.revert();
    },
    { scope: ref },
  );

  // Decorative only: hidden from assistive tech and never in the way of a click.
  // `invisible` until the walk starts, so it never shows without JavaScript or on small screens.
  return (
    <div ref={ref} aria-hidden className="pointer-events-none invisible fixed top-0 left-0 z-30 size-16">
      <div className="av-nudge size-full">
        <div className="av-walk size-full">
          <AvatarFace className="size-full" />
        </div>
      </div>
    </div>
  );
}
