"use client";

import { useSyncExternalStore } from "react";
import { site } from "@/content/site";

const fmt = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: site.timeZone,
});

// Re-check every 15s; React only re-renders when the formatted minute actually changes.
function subscribe(onTick: () => void) {
  const id = setInterval(onTick, 15_000);
  return () => clearInterval(id);
}
const now = () => fmt.format(new Date()).toLowerCase();

export function Clock() {
  // The server snapshot is null: the server never guesses a time, so there's no
  // placeholder and no hydration mismatch. The line appears once the browser knows the time.
  const time = useSyncExternalStore(subscribe, now, () => null);

  return (
    <p className="min-h-5 font-mono text-sm text-muted-foreground">
      {time && (
        <>
          It&apos;s <time className="text-foreground tabular-nums">{time}</time> in {site.city}
        </>
      )}
    </p>
  );
}
