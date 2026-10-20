# WALKTHROUGH: how this portfolio works, and what to learn from it

Written for Abinash after the ship-mode build (2026-10-20). Read it top to bottom once, with the code open beside it. Every `path:line` is clickable in VS Code.

---

## 1. What got built

| URL | File | How it's rendered |
| --- | --- | --- |
| `/` | `src/app/page.tsx` | Static HTML at build time (`○`), plus small client islands |
| `/work/fos` | `src/app/work/[slug]/page.tsx` | Static, one page per slug from `generateStaticParams` (`●`) |
| `/playground/mood-journal`, `/weather-checker`, `/expense-tracker` | `src/app/playground/[slug]/page.tsx` | Static shell; the mini-app runs in the browser |
| `/opengraph-image`, `/icon`, `/apple-icon` | `src/app/opengraph-image.tsx`, `icon.tsx`, `apple-icon.tsx` | PNGs drawn from JSX at build time |
| `/sitemap.xml`, `/robots.txt` | `src/app/sitemap.ts`, `robots.ts` | Generated at build time |
| any unknown URL | `src/app/not-found.tsx` | 404 inside the normal layout |
| *(no URL)* the contact form's POST | `src/app/actions/contact.ts` | A Server Action: runs on the server per request |

Folders: `src/content/` holds every fact on the site (typed, from `docs/FACTS.md`); `src/components/{layout,sections,ui,motion,playground}` holds one component per job; `src/db/` holds the Drizzle schema and client; `scripts/prepare-images.mjs` turns the raw photos in `assets-src/` (not committed) into the web copies in `public/`.

---

## 2. How one request flows through it

**A visitor opens the home page.**
1. Vercel serves `/` as a ready-made HTML file. It was rendered once, during `npm run build`, from `src/app/page.tsx`, so there's no server work per visit.
2. The HTML already contains every word and every `<img srcset>`. The root layout (`src/app/layout.tsx:32`) wrapped it with the header, grid lines and footer, and put a tiny inline script in `<head>` (`src/components/layout/ThemeScript.tsx:7`). That script runs before first paint: it applies a saved dark/light choice and adds the `js` class.
3. The browser downloads only the JavaScript for the client islands: ThemeToggle, Clock, the motion wrappers, PinnedStory, Lightbox and ContactForm. React **hydrates** them, meaning it attaches to the HTML that's already there rather than re-drawing it.
4. The Clock reads the time (it rendered nothing on the server on purpose, `src/components/ui/Clock.tsx:22`). GSAP splits the hero name into lines and slides them up (`src/components/motion/HeroMotion.tsx:21`), and ScrollTriggers pin the FOS phone and the logbook strip, but only on desktop with motion allowed (`gsap.matchMedia()`).

**The visitor sends a message.**
1. `<form action={action}>` in `src/components/sections/ContactForm.tsx:28` posts the fields to the Server Action `sendMessage` (`src/app/actions/contact.ts:32`). With JS on, React does this with `fetch` and keeps the page; with JS off, the browser does a normal form POST. Both work.
2. On the server: honeypot check → zod validation (`:44`) → if `DATABASE_URL` is missing, a calm "email me instead" message → hash the IP (`:62`), count that IP's messages in the last 10 minutes (max 3) → `INSERT` into Neon through Drizzle.
3. The action returns a plain object (`{ status: "ok", name }` or errors). `useActionState` (`ContactForm.tsx:12`) puts it in `state`, and the form re-renders as "Thanks, Abinash."

---

## 3. The ideas worth learning (in the AGENTS.md format)

### 1 — Server Components by default, client islands where needed
- **What it is:** Components render on the server into HTML and send no JavaScript, unless the file starts with `"use client"`. Only pieces that need state, effects or browser APIs are client components, and a server component can render them and pass them props or `children`.
- **Where it lives:** `src/app/page.tsx:23` (server page), `src/components/sections/Recognition.tsx:36` (server list → client `Lightbox`), `src/components/motion/RevealRoot.tsx` (client wrapper around server children)
- **Common mistake:** putting `"use client"` at the top of a whole page because one button needs `onClick`. The whole subtree then ships as JS.
- **AMS bridge:** AMS web's dashboard, notices list and attendance tables are server components that fetch from Spring Boot; only filters, "mark present" toggles and dialogs are client islands.

### 2 — Layouts, metadata and metadata files
- **What it is:** `layout.tsx` wraps every page and stays mounted across navigations. `export const metadata` / `generateMetadata` write `<title>`/`<meta>` tags; special files (`opengraph-image.tsx`, `icon.tsx`, `sitemap.ts`, `robots.ts`) become real URLs.
- **Where it lives:** `src/app/layout.tsx:11` (title template + `metadataBase`), `src/app/work/[slug]/page.tsx:17` (per-page metadata, keeps the parent's OG image via `ResolvingMetadata`), `src/app/opengraph-image.tsx:17`
- **Common mistake:** a page's `openGraph` *replaces* the layout's, so the share image silently disappears unless you carry it forward.
- **AMS bridge:** `title.template: "%s — AMS"` in the root layout, plus a `(dashboard)/layout.tsx` for the sidebar that only logged-in pages share.

### 3 — Dynamic routes built ahead of time
- **What it is:** `[slug]` matches any value; `generateStaticParams` lists the values to pre-build; `dynamicParams = false` 404s the rest; `notFound()` renders `not-found.tsx`. `params` is a Promise in Next 16.
- **Where it lives:** `src/app/work/[slug]/page.tsx:9`, `:14`, `:36`; the same pattern in `src/app/playground/[slug]/page.tsx:16`
- **Common mistake:** `params.slug` without `await`.
- **AMS bridge:** `/subjects/[code]` and `/students/[id]` use the same file shape, but keep `dynamicParams` on, because new students appear every day.

### 4 — Server Actions + `useActionState` (forms without an API route)
- **What it is:** an `async` function in a `"use server"` file that a form can call directly; `useActionState` gives you its last result and a `pending` flag. It works even with JavaScript off.
- **Where it lives:** `src/app/actions/contact.ts:32`, `src/components/sections/ContactForm.tsx:12`; also `src/app/actions/weather.ts:11` called from a transition (`src/components/playground/WeatherChecker.tsx:43`)
- **Common mistake:** trusting client-side checks. Validate again on the server (zod), because anyone can call the action directly.
- **AMS bridge:** every AMS write (mark attendance, post a notice, save marks) becomes an action that calls Spring Boot and returns field errors; then `revalidatePath()` refreshes the list.

### 5 — Keeping secrets and server code on the server
- **What it is:** `process.env.X` is only readable on the server, unless it's prefixed `NEXT_PUBLIC_` (then it's baked into the browser bundle at build time). `import "server-only"` turns "the DB client leaked into the browser" into a build error.
- **Where it lives:** `src/db/index.ts:3`, `src/app/actions/weather.ts` (the 2025 app had its API key in browser code; now it doesn't), `.env.example`
- **Common mistake:** `NEXT_PUBLIC_DATABASE_URL`. Also forgetting that `NEXT_PUBLIC_SITE_URL` must be set *before* the build.
- **AMS bridge:** the Spring Boot JWT lives in an httpOnly cookie read by server code, never in `localStorage`.

### 6 — Hydration, and browser-only code
- **What it is:** the server's HTML and React's first browser render must match. For values only the browser knows, either render nothing on the server (`useSyncExternalStore` with a `null` server snapshot), fix the DOM before paint with an inline script, or skip SSR for that component (`next/dynamic` with `ssr: false`).
- **Where it lives:** `src/components/ui/Clock.tsx:22`, `src/components/layout/ThemeScript.tsx`, `src/components/playground/apps.tsx:10`
- **Common mistake:** `useState(() => localStorage.getItem(...))` in a normal client component, which crashes on the server or causes a hydration mismatch.
- **AMS bridge:** "last selected subject" or "collapsed sidebar" preferences: read them after mount, or store them in a cookie the server can read.

### 7 — Animation libraries in the App Router
- **What it is:** GSAP runs only in client wrappers. `useGSAP` records and reverts everything on unmount, and `gsap.matchMedia()` adds or removes pins as the screen size or reduced-motion setting changes. Tweens created after an `await` must go through `context.add()`.
- **Where it lives:** `src/lib/gsap.ts`, `src/components/motion/HeroMotion.tsx:28`, `src/components/sections/PinnedStory.tsx:60`, `src/components/motion/HorizontalPin.tsx:14`
- **Common mistake:** "ghost" ScrollTriggers after navigating, caused by tweens created outside the context. (Verified here: 2 pins on the home page → 0 on `/work/fos` → 2 after going back.)
- **AMS bridge:** chart or calendar libraries for AMS web get the same treatment: a thin client wrapper with data passed in.

### 8 — Images and fonts handled by the framework
- **What it is:** `next/image` with static imports knows each file's size (no layout shift), serves responsive sizes and modern formats, and shows a blur placeholder. `next/font` self-hosts Google fonts as CSS variables. Neither one cleans your pixels: the phone number was blurred by `scripts/prepare-images.mjs` before any of this.
- **Where it lives:** `src/content/projects.ts:2`, `src/components/ui/PhoneFrame.tsx:21`, `src/lib/fonts.ts`, `scripts/prepare-images.mjs`
- **Common mistake:** relying on `priority`, which is deprecated in Next 16 (use `loading="eager"`/`preload`), or serving 5 MB originals.
- **AMS bridge:** student photos from the API need `images.remotePatterns` in `next.config.ts` before `next/image` will load them.

### TanStack Start → Next.js, one line each

| Lovable draft (TanStack Start) | This site (Next.js 16) | Why |
| --- | --- | --- |
| `head()` in `__root.tsx` | `export const metadata` in `layout.tsx` | Typed, merged per route, special files for OG/icons |
| Google Fonts `<link>` | `next/font` (`src/lib/fonts.ts`) | Self-hosted, no layout shift, no third-party request |
| `createFileRoute` + `loader` + `notFound()` | `generateStaticParams` + `notFound()` | Pages pre-built as HTML |
| `createServerFn` | Server Action + `useActionState` | Works without JS, no client fetch code |
| `<img>` + `*.asset.json` | `next/image` + static imports | Sizes, formats, placeholders |
| Everything a client component | Server by default, client islands | Less JavaScript for visitors |

---

## 4. MISSING: left out until you provide it

Nothing on the site says "TODO"; these things are simply absent. Add the item and the element comes back.

- **CV PDF**: put it at `public/abinash-adhikari-cv.pdf` and add a "CV (PDF)" link in `src/components/sections/Hero.tsx`.
- **YouTube links**: add them to `src/content/videos.ts`; the Videos section appears automatically, numbered correctly.
- **Your own handwritten margin notes** for the Work rows (only the Research line is live).
- **FOS receipt screenshot**, with branding cropped (re-adds a "bill gets printed" step).
- **Year of the BIM 5th-semester topper result.**
- **Vendora / Bibhid live links**, and **Bibhid's year**.
- **Growth Forum Nepal paper title.**
- **Event name** for the hosting photo.
- **The real FOS backstory** (what staff did before the app), for a "The problem" section in the case study.
- **AMS teammate credit** and exactly which parts were yours.
- **Logbooks #1–#4**, if they exist.
- **Domain name** → `NEXT_PUBLIC_SITE_URL`.
- **A fresh OpenWeather key** → `OPENWEATHER_API_KEY` (the old one is public in the 2025 repo).

---

## 5. Deploy and domain

1. **Push to GitHub.** Create an empty repo on github.com (no README), then: `git remote add origin https://github.com/abeenash/<repo>.git` and `git push -u origin master`.
2. **Import on Vercel.** vercel.com → Add New → Project → pick the repo. Framework auto-detects as Next.js; leave the build settings alone.
3. **Environment variables** (Project → Settings → Environment Variables, for Production *and* Preview):
   - `DATABASE_URL`: the same Neon connection string as in your `.env.local`. The `messages` table already exists there; I ran the migration.
   - `NEXT_PUBLIC_SITE_URL`: `https://<your-domain>` with no trailing slash. Set it **before** the first deploy, because it's baked in at build time.
   - `OPENWEATHER_API_KEY`: a newly rotated key.
4. **Deploy**, then open the `*.vercel.app` URL and check `/`, `/work/fos`, a playground app, and send yourself a test message.
5. **Custom domain.** Project → Settings → Domains → add `<your-domain>` (and `www.<your-domain>`, set to redirect to the apex). Vercel then shows the exact DNS records:
   - If your registrar lets you edit records: an **A** record for `@` and a **CNAME** for `www`, with the values Vercel displays.
   - If it only lets you set nameservers (common for `.com.np`): use `ns1.vercel-dns.com` and `ns2.vercel-dns.com`.
   - HTTPS is issued automatically once DNS resolves (minutes to a few hours).
6. **If the domain differs** from what you put in `NEXT_PUBLIC_SITE_URL`, update it and click **Redeploy**.
7. **Check after launch:** `https://<domain>/sitemap.xml` and `/robots.txt` show your domain; paste the URL into a social-card preview tool to see the OG image; read messages in the Neon console → Tables → `messages` (an admin page is on the "later" list).

**Day-to-day commands:** `npm run dev` · `npm run lint` · `npm run build` · `npm run images` (re-generate web images after adding raw files to `assets-src/`) · `npm run db:generate` then `npm run db:migrate` (after editing `src/db/schema.ts`).
