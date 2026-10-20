"use client";

import { useEffect, useLayoutEffect, useSyncExternalStore, type MouseEvent } from "react";
import { THEME_COLOR } from "@/lib/theme";

type Theme = "light" | "dark";
const EVENT = "themechange";
const dark = "(prefers-color-scheme: dark)";

function readStored(): Theme | null {
  try {
    const t = localStorage.getItem("theme");
    return t === "dark" || t === "light" ? t : null;
  } catch {
    return null;
  }
}

// The theme the visitor is actually seeing: their saved choice, else the system's.
function current(): Theme {
  return readStored() ?? (matchMedia(dark).matches ? "dark" : "light");
}

function subscribe(onChange: () => void) {
  const mq = matchMedia(dark);
  mq.addEventListener("change", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    mq.removeEventListener("change", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

function apply(next: Theme) {
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem("theme", next);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

export function ThemeToggle() {
  // null on the server: the label can't be known until we're in the browser.
  const theme = useSyncExternalStore(subscribe, current, () => null);

  // In dev, Strict Mode's remount resets <html> attributes the inline script set. No-op in production.
  useLayoutEffect(() => {
    const d = document.documentElement;
    d.classList.add("js");
    const t = readStored();
    if (t) d.setAttribute("data-theme", t);
  }, []);

  // Keep <meta name="theme-color"> in step (toggle clicks and system changes alike).
  useEffect(() => {
    if (theme) document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[theme]);
  }, [theme]);

  const flip = (e: MouseEvent<HTMLButtonElement>) => {
    const next: Theme = current() === "dark" ? "light" : "dark";
    // No View Transitions support, or reduced motion: switch instantly.
    if (!("startViewTransition" in document) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply(next);
      return;
    }
    // The new theme spreads out as a circle from the button's centre. The radius is the distance
    // to the farthest corner of the viewport, so the circle ends up covering the whole screen.
    const b = e.currentTarget.getBoundingClientRect();
    const x = b.left + b.width / 2;
    const y = b.top + b.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const root = document.documentElement;
    root.style.setProperty("--theme-x", `${x}px`);
    root.style.setProperty("--theme-y", `${y}px`);
    root.style.setProperty("--theme-radius", `${radius}px`);
    root.classList.add("theme-reveal");
    // The browser snapshots the page (old theme), runs the callback, then shows the live new page
    // on top of the snapshot; CSS (.theme-reveal in globals.css) clips the new one to a growing circle.
    const transition = document.startViewTransition(() => apply(next));
    transition.finished.finally(() => root.classList.remove("theme-reveal"));
  };

  return (
    <button
      type="button"
      onClick={flip}
      // Hidden without JavaScript, where it couldn't do anything (CSS still follows the system theme).
      className="theme-toggle relative -my-2 hidden size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground js:inline-flex"
    >
      <span className="sr-only">
        {theme === null ? "Switch theme" : theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      </span>
      {/* Which icon shows is decided by CSS from <html data-theme> / the system theme (globals.css),
          so it's right from the first paint, before React knows the theme. Moon = go dark, sun = go light. */}
      <svg viewBox="0 0 24 24" className="theme-icon-moon absolute size-4.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" strokeLinejoin="round" />
      </svg>
      <svg viewBox="0 0 24 24" className="theme-icon-sun absolute size-4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
      </svg>
    </button>
  );
}
