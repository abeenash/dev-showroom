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

### Phase 2 — Static image imports and typed content
- **What it is:** `import fosOrder from "../../public/shots/fos/order.jpg"` gives you an object with the file's URL, width, height and a tiny blurred preview, all worked out at build time. Pass it to `next/image` and you get correct sizing (no layout shift), responsive `srcset`, modern formats and `placeholder="blur"` for free. Content lives in typed `.ts` files, so a typo in a project's `status` is a compile error, not a broken page.
- **Where it lives:** `src/content/projects.ts:2` (imports), `src/content/types.ts:7` (`Shot`), `src/components/ui/PhoneFrame.tsx:20` (`next/image` with `fill` + `sizes`), `scripts/prepare-images.mjs` (shrinking and blurring originals)
- **Common mistake:** using a string path like `src="/shots/a.jpg"` and forgetting `width`/`height` (Next errors), or serving 5 MB originals and trusting `next/image` to fix it. It resizes on request, but the original still has to be read, and it never removes a phone number in the pixels.
- **AMS bridge:** AMS web's static content (role names, nav items, notice categories) goes in typed `src/content/*.ts` files, while things that change (attendance, marks) come from the Spring Boot API.
- **Your task (TODO(human)):** skipped in ship mode. Add your CV to `public/` and wire the hero link.

---

### Phase 3 — Client islands inside a Server Component page
- **What it is:** `app/page.tsx` is a Server Component, built to static HTML (`○ /` in the build output). Interactive parts are small **client islands** (separate client components dropped into server-rendered HTML): `PinnedStory` (state), `Lightbox` (a `<dialog>`), `Clock`, `ThemeToggle`. A Server Component can render a client component and pass it plain props; the reverse (importing server-only code into a client file) isn't allowed. TanStack's `createFileRoute` + `head()` became a default export + `export const metadata`.
- **Where it lives:** `src/app/page.tsx:22`, `src/components/sections/Recognition.tsx:35` (server list → client `Lightbox`), `src/components/ui/Lightbox.tsx:23` (a real `<a href>` that JS upgrades)
- **Common mistake:** building class names with template strings (`` `${prefix}:flex` ``). Tailwind reads your source as text and never sees the final name, so the style silently never ships. Write class names out in full.
- **AMS bridge:** the AMS notices page can be a Server Component that fetches notices from Spring Boot on the server; only the "mark as read" button or the subject filter needs `"use client"`.
- **Your task (TODO(human)):** skipped in ship mode. Turn off JavaScript in DevTools and scroll the home page: everything should still read.

---

### Phase 4 — Animation libraries in the App Router (client wrappers + cleanup)
- **What it is:** GSAP needs `window`, so it only runs in `"use client"` files. Instead of turning whole sections into client components, small wrappers (`RevealRoot`, `HeroMotion`, `HorizontalPin`) take server-rendered `children` and only add behaviour. `useGSAP` (GSAP's React hook) records every tween and ScrollTrigger made inside it and reverts them on unmount, which is what keeps client-side navigation clean. `gsap.matchMedia()` runs code only while a media query matches and undoes it when it stops matching (resize, reduced motion).
- **Where it lives:** `src/lib/gsap.ts:8` (register plugins only in the browser), `src/components/motion/HeroMotion.tsx:21` (`context.add` for tweens created after `await`), `src/components/sections/PinnedStory.tsx:56` (pin + progress)
- **Common mistake:** creating animations inside a `.then()` or `setTimeout` without `context.add(...)`. They escape cleanup, and after a navigation you get "ghost" ScrollTriggers that pin elements that no longer exist.
- **AMS bridge:** the same pattern fits any browser-only library in AMS web (a chart library for attendance stats, a rich-text editor for notices): a thin client wrapper, server data passed in as props or children.
- **Your task (TODO(human)):** skipped in ship mode. In `RevealRoot.tsx`, change `y: 28` to `y: 60` and watch how much heavier the page feels; then put it back.

---
