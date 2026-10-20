"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";

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

  const flip = () => {
    const next: Theme = current() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
    window.dispatchEvent(new Event(EVENT));
  };

  return (
    <button
      type="button"
      onClick={flip}
      // Hidden without JavaScript, where it couldn't do anything (CSS still follows the system theme).
      className="label link-draw hidden hover:text-foreground js:inline"
      aria-label="Toggle colour theme"
    >
      {theme === null ? "Theme" : theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}
