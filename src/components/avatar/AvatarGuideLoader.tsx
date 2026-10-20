"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { AVATAR_MQ } from "./config";

// The walking avatar's code (and MorphSVG with it) is its own chunk, fetched only when the screen
// is wide enough and motion is allowed. Phones and laptops never download it.
const AvatarGuide = dynamic(() => import("./AvatarGuide").then((m) => m.AvatarGuide), { ssr: false });

const subscribe = (onChange: () => void) => {
  const mq = matchMedia(AVATAR_MQ);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};

export function AvatarGuideLoader() {
  // false on the server and during hydration, so nothing differs from the server HTML.
  const wide = useSyncExternalStore(subscribe, () => matchMedia(AVATAR_MQ).matches, () => false);
  return wide ? <AvatarGuide /> : null;
}
