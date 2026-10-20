"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useSyncExternalStore } from "react";
import { CORNER_MQ, WALK_MQ } from "./config";

// The avatar's code (and MorphSVG with it) is its own chunk, never part of first load:
// - wide screens fetch it straight away, because the walk starts on the docked avatar;
// - narrower screens fetch it on the first scroll, because the corner companion only appears
//   once the header has scrolled away. Phones download nothing extra for the first paint.
const AvatarGuide = dynamic(() => import("./AvatarGuide").then((m) => m.AvatarGuide), { ssr: false });

function useMedia(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => matchMedia(query).matches,
    () => false, // on the server and during hydration, so nothing differs from the server HTML
  );
}

export function AvatarGuideLoader() {
  const walk = useMedia(WALK_MQ);
  const corner = useMedia(CORNER_MQ);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!corner || scrolled) return;
    const onScroll = () => setScrolled(true);
    window.addEventListener("scroll", onScroll, { passive: true, once: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [corner, scrolled]);

  // `key`: switching modes (e.g. snapping a window to half the screen) mounts a fresh guide.
  if (walk) return <AvatarGuide key="walk" mode="walk" />;
  if (corner && scrolled) return <AvatarGuide key="corner" mode="corner" />;
  return null;
}
