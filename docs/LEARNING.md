# LEARNING — Next.js, one phase at a time

Claude Code appends one entry per phase. Abinash reads it, then does the `TODO(human)` task from that phase.

Entry format:

### Phase N — <concept>
- **What it is:** 2–3 plain-English lines
- **Where it lives:** `src/...:line`
- **Common mistake:** …
- **AMS bridge:** how the same idea applies to the AMS web app
- **Your task (TODO(human)):** … · ✅ done / reviewed

---

### Phase 0 — The Metadata API and `next/font`
- **What it is:** Instead of writing `<title>` and `<meta>` tags by hand (TanStack's `head()`), a layout or page exports a `metadata` object and Next.js writes the tags. A `title.template` like `"%s — Abinash Adhikari"` wraps every child page's title. `next/font` downloads Google fonts at build time and serves them from your own domain, so there's no layout shift and no request to Google.
- **Where it lives:** `src/app/layout.tsx:7` (metadata), `src/lib/fonts.ts:3` (fonts)
- **Common mistake:** expecting the template to apply to the root page itself. It only applies to *child* segments, which is why `title.default` is required.
- **AMS bridge:** the AMS web root layout sets `template: "%s — AMS"`, and each page (`/attendance`, `/notices`) just exports `title: "Attendance"`.
- **Your task (TODO(human)):** skipped in ship mode; the metadata object was written for you. Try changing the template and watch the tab title.

---

### Phase 1 — Root layout, Server vs Client Components, and hydration
- **What it is:** `app/layout.tsx` wraps every page and stays mounted when you navigate, so Header, GridLines and Footer live there once. Every component is a **Server Component** (rendered to HTML, ships no JS) unless the file starts with `"use client"`. Only ThemeToggle and Clock need the browser, so only they are client components. *Hydration* = React in the browser attaching to the server's HTML; if the two disagree you get a hydration error.
- **Where it lives:** `src/app/layout.tsx:23` (layout), `src/components/ui/Clock.tsx:23` (`useSyncExternalStore` with a `null` server snapshot = no guessed time), `src/components/layout/ThemeScript.tsx:4` (inline script that sets the theme before first paint)
- **Common mistake:** putting `"use client"` on a whole page because one button needs `onClick`. Keep the page a Server Component and make just the button a client component.
- **AMS bridge:** the AMS web dashboard shell (sidebar, top bar) goes in `app/(dashboard)/layout.tsx`, and only interactive bits (a filter dropdown, a "mark all present" button) get `"use client"`.
- **Your task (TODO(human)):** skipped in ship mode. Read `Clock.tsx` and explain to yourself why `useSyncExternalStore` beats `useState` + `useEffect` here.

---
