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

### Phase 5 — Dynamic routes: `[slug]`, `generateStaticParams`, `generateMetadata`, `notFound`
- **What it is:** A folder named `[slug]` matches any value in that URL segment. `generateStaticParams` tells Next.js which values exist, so each page is pre-built as HTML at build time (`●` SSG in the build output). `dynamicParams = false` makes any other slug a 404. `generateMetadata` builds the `<title>` per page. In Next 16, `params` is a **Promise**, so you `await params`.
- **Where it lives:** `src/app/work/[slug]/page.tsx:9` (static params), `:14` (dynamicParams), `:17` (metadata), `:24` (`notFound()`), `src/app/not-found.tsx`
- **Common mistake:** reading `params.slug` without `await` (it was synchronous in Next 14, and Next 16 removed the compatibility shim), or forgetting that `notFound()` throws, so code after it never runs.
- **AMS bridge:** `/students/[id]` and `/subjects/[code]/attendance` in AMS web are the same pattern, but the data changes daily, so you'd leave `dynamicParams` on (rendered on request) and fetch from Spring Boot inside the page.
- **Your task (TODO(human)):** skipped in ship mode. Add an `ams` entry to `caseStudies` (FACTS only), set `hasCaseStudy: true` on AMS, and run `npm run build`: a second `●` route appears.

---

### Phase 6 — Server Actions, `useActionState`, and a database with Drizzle
- **What it is:** A **Server Action** is an `async` function in a `"use server"` file. Pass it to `<form action={...}>` and Next.js wires up the POST for you: no API route, no `fetch`. `useActionState(action, initial)` gives the component the action's last return value (errors, success) plus a `pending` flag. **Drizzle** (a typed SQL toolkit) turns `schema.ts` into SQL migrations (`npm run db:generate`) and applies them (`npm run db:migrate`). `import "server-only"` makes the build fail if client code ever imports the DB.
- **Where it lives:** `src/app/actions/contact.ts:33` (validate → honeypot → rate limit → insert), `src/components/sections/ContactForm.tsx:12` (`useActionState`), `src/db/schema.ts:4`, `src/db/index.ts:3`
- **Common mistake:** trusting the browser. HTML `required` and `type="email"` are only hints; the action must validate again with zod, because anyone can POST to it directly. Also: never prefix a secret with `NEXT_PUBLIC_`, which ships it to every visitor.
- **AMS bridge:** "Mark attendance", "Post notice" and "Save marks" in AMS web are Server Actions. The action calls the Spring Boot API with the teacher's token (instead of Drizzle), returns field errors to `useActionState`, then calls `revalidatePath("/attendance")` so the list refreshes.
- **Your task (TODO(human)):** skipped in ship mode. Submit the form twice quickly with the same text and see both rows in Neon; then think about how you'd add an idempotency key, exactly like FOS orders.

---

### Phase 7 — Browser-only code (`ssr: false`) and secrets that stay on the server
- **What it is:** Every client component is *also* rendered on the server first. Code that touches `localStorage` while rendering would crash there, so `next/dynamic(() => import(...), { ssr: false })` skips server rendering for that component (it's only allowed inside a `"use client"` file). Separately, an API key in a client component ships to every visitor, so the weather fetch moved into a Server Action, where `process.env.OPENWEATHER_API_KEY` stays private.
- **Where it lives:** `src/components/playground/apps.tsx:10` (`ssr: false`), `src/app/actions/weather.ts:11` (server-side fetch), `src/components/playground/WeatherChecker.tsx:42` (`useTransition` calling the action on submit)
- **Common mistake:** "fixing" the localStorage crash with `typeof window !== "undefined"` inside `useState`. The server renders the empty state, the browser renders saved data, and React reports a hydration mismatch. Either skip SSR for that component, or read storage after mount.
- **AMS bridge:** the AMS web app will hold a Spring Boot JWT. Keep it in an httpOnly cookie read by Server Components/Actions, never in `localStorage` in client code, for the same reason the weather key moved.
- **Your task (TODO(human)):** skipped in ship mode. Rotate your OpenWeather key (the old one is public in the 2025 repo), add the new one to `.env.local` and Vercel, and check `/playground/weather-checker`.

---
