# PROGRESS

Claude Code updates this file at the end of every session. Tick a box only when the phase passes `npm run lint` and `npm run build` and has been committed.

## Phases (ship mode: run all of them back to back, committing after each)

- [x] **0. Scaffold:** finish the leftovers: the `metadata` object in `layout.tsx` (built from `site`, title template `%s — Abinash Adhikari`), then commit.
- [x] **1. Design system (port):** Lovable `styles.css` → `globals.css` (with dark theme), the no-flash theme script, GridOverlay, SectionLabel, PhoneFrame, Header, Footer, ThemeToggle, Clock, OpenToWork.
- [ ] **2. Content + images:** typed `src/content/*` built only from FACTS (keep Lovable's types). Prepare the images exactly as FACTS → "Screenshots" says: raw files go to `assets-src/`, sharp generates web copies, blur the Fish Station banner and crop the Activate Windows watermarks, and view every output image to confirm. Use the portrait, photos and certificates as FACTS → "Photos" and "Recognition" describe. Anything unconfirmed is left out and listed under MISSING.
- [ ] **3. Home page (port):** all sections from the Lovable files using next/link, next/image and the Metadata API. It must look complete with JavaScript disabled.
- [ ] **4. Motion (port):** `lib/gsap.ts`, RevealRoot, Hero SplitText, PinnedStory, Notes horizontal pin, all inside `matchMedia`. Check that resizing and route changes leave no stray ScrollTriggers.
- [ ] **5. FOS case study:** `/work/[slug]` with `generateStaticParams`, `generateMetadata` and `notFound`. Copy from FACTS only.
- [ ] **6. Contact + Neon:** Drizzle schema with a `messages` table, a Server Action with zod, a honeypot, `useActionState` and a simple per-IP rate limit. If `DATABASE_URL` is missing, the action must fail gracefully with a calm message (never a crash). Add `.env.example`, `db:generate` and `db:migrate` scripts.
- [ ] **7. Where I started:** port Abinash's original Mood Journal, Weather Checker and Expense Tracker (`E:\PROJECTS\portfolio-with-react\project-portfolio\src`) from JSX to TSX, shown in Lovable's tile + modal style.
- [ ] **8. Ship polish:** Open Graph image (`next/og`), favicon, sitemap and robots (`site.url` comes from an env var), accessibility and contrast pass, `next build` clean, Lighthouse check if possible.
- [ ] **9. Walkthrough:** write `docs/WALKTHROUGH.md` (format in AGENTS.md), plus the MISSING list and deploy steps.

**Later (not today):** an admin page for messages, videos and logbook (useful practice for AMS auth); real certificate scans; video links.

## MISSING (left out of the live site until Abinash provides them)
<!-- Claude Code fills this in during the build -->

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
- 2026-10-20 · 1 · Ported styles.css (light + dark tokens; dark follows the system without JS, `data-theme` overrides it), label raised to 0.75rem, grid lines at 5% ink. Added the derived token `--accent-text` (#B8401C light / #FF6B45 dark) because vermilion #E4572E is only 3.3:1 on paper, so it's used for small text, while the brand vermilion stays for large type, rules and dots. Header/Footer/GridLines/ThemeToggle/ThemeScript in `components/layout`; Clock (useSyncExternalStore, no placeholder), OpenToWork (server), MarginLabel, PhoneFrame (next/image) in `components/ui`. `site.ts` gained email/links/timeZone/url (url from `NEXT_PUBLIC_SITE_URL`).
- 2026-10-20 · 0 · `metadata` export (title template, description, authors from `site`); removed the visible TODO line from the placeholder page; committed the earlier session's fonts/tokens/site.ts leftovers.
