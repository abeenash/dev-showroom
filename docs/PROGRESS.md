# PROGRESS

Claude Code updates this file at the end of every session. Tick a box only when the phase passes `npm run lint` and `npm run build` and has been committed.

## Phases

- [ ] **0. Scaffold:** create-next-app (TS, Tailwind, App Router, `src/`, ESLint), git init, kit files in place, fonts via `next/font`. *Learn: App Router file conventions, layouts, Server vs Client Components.*
- [ ] **1. Design system (port):** Lovable `styles.css` → `globals.css`, the theme script, GridOverlay, SectionLabel, PhoneFrame, Header (from the Hero nav), Footer, ThemeToggle. *Learn: next/font vs a Google Fonts link, Tailwind v4 `@theme`/`@utility`, where the client boundary goes.*
- [ ] **2. Content layer:** typed `src/content/*` built only from `docs/FACTS.md` (keep Lovable's types), with TODO placeholders for anything unconfirmed. Add the real screenshots to `public/shots/`. **TODO(human): Abinash writes the handwritten margin notes.** *Learn: typing data, importing it in Server Components.*
- [ ] **3. Home page, static (port):** every section from the Lovable files, using next/link, next/image and the Metadata API. No GSAP yet: the page must look complete without JS. *Learn: Server vs Client Components in practice, composition.*
- [ ] **4. Motion (port):** `lib/gsap.ts`, RevealRoot (`data-reveal`), Hero SplitText (`fonts.ready` + `split-pending`), PinnedStory, Notes horizontal pin. Check that resizing and route changes don't leave ScrollTriggers behind. *Learn: `"use client"`, `useGSAP` scope and cleanup, `matchMedia`, hydration.*
- [ ] **5. Case studies (port):** `/work/[slug]` from `work.$slug.tsx`, with `generateStaticParams`, `generateMetadata` and `notFound`. Write the copy from FACTS only. *Learn: dynamic routes, static generation, TanStack loader vs Next.js.*
- [ ] **6. Contact + database:** Neon + Drizzle, a `messages` table, a Server Action with zod validation, honeypot and rate limit. *Learn: Server Actions, env vars, `server-only`, migrations.* (Directly reusable in AMS.)
- [ ] **7. Admin (small):** password login, signed cookie, `proxy.ts`, a page to read messages and manage videos and logbook entries. Reuse the patterns in `E:\PROJECTS\salina_portfolio\src\lib\session.ts`. *Learn: auth, cookies, proxy, protecting Server Actions.* (Core for AMS web.)
- [ ] **8. Where I started:** port Mood Journal, Weather Checker and Expense Tracker from JSX to TSX under `/playground/*`. *Learn: client state, hydration-safe localStorage.*
- [ ] **9. Polish:** Open Graph image (`next/og`), sitemap, robots, accessibility pass, Lighthouse ≥ 95, certificate lightbox, real screenshots and scans.
- [ ] **10. Ship:** Vercel, env vars, Neon production branch, custom domain, then retire or redirect the old abeenash.vercel.app.

## Open questions (for Abinash)
- Custom domain name? Domain email or Gmail?
- Portrait photo?
- AMS: credit the teammate? Which parts were yours?
- Exact award titles and years; certificate scans
- YouTube links
- Vendora / Bibhid: years, screenshots, live links
- Logbooks #1–#4, if they exist
- Original FOS screenshots (order screen + receipt), with the restaurant branding cropped out
- The real story behind FOS: what problem did the restaurant staff have before the app?

## Session log
<!-- newest first: YYYY-MM-DD · phase · what changed · anything touched outside the phase -->
