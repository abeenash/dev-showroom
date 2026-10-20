# PROGRESS

Claude Code updates this file at the end of every session. Tick a box only when the phase passes `npm run lint` and `npm run build` and has been committed.

## Phases (ship mode: run all of them back to back, committing after each)

- [x] **0. Scaffold:** finish the leftovers: the `metadata` object in `layout.tsx` (built from `site`, title template `%s — Abinash Adhikari`), then commit.
- [x] **1. Design system (port):** Lovable `styles.css` → `globals.css` (with dark theme), the no-flash theme script, GridOverlay, SectionLabel, PhoneFrame, Header, Footer, ThemeToggle, Clock, OpenToWork.
- [x] **2. Content + images:** typed `src/content/*` built only from FACTS (keep Lovable's types). Prepare the images exactly as FACTS → "Screenshots" says: raw files go to `assets-src/`, sharp generates web copies, blur the Fish Station banner and crop the Activate Windows watermarks, and view every output image to confirm. Use the portrait, photos and certificates as FACTS → "Photos" and "Recognition" describe. Anything unconfirmed is left out and listed under MISSING.
- [x] **3. Home page (port):** all sections from the Lovable files using next/link, next/image and the Metadata API. It must look complete with JavaScript disabled.
- [x] **4. Motion (port):** `lib/gsap.ts`, RevealRoot, Hero SplitText, PinnedStory, Notes horizontal pin, all inside `matchMedia`. Check that resizing and route changes leave no stray ScrollTriggers.
- [x] **5. FOS case study:** `/work/[slug]` with `generateStaticParams`, `generateMetadata` and `notFound`. Copy from FACTS only.
- [ ] **6. Contact + Neon:** Drizzle schema with a `messages` table, a Server Action with zod, a honeypot, `useActionState` and a simple per-IP rate limit. If `DATABASE_URL` is missing, the action must fail gracefully with a calm message (never a crash). Add `.env.example`, `db:generate` and `db:migrate` scripts.
- [ ] **7. Where I started:** port Abinash's original Mood Journal, Weather Checker and Expense Tracker (`E:\PROJECTS\portfolio-with-react\project-portfolio\src`) from JSX to TSX, shown in Lovable's tile + modal style.
- [ ] **8. Ship polish:** Open Graph image (`next/og`), favicon, sitemap and robots (`site.url` comes from an env var), accessibility and contrast pass, `next build` clean, Lighthouse check if possible.
- [ ] **9. Walkthrough:** write `docs/WALKTHROUGH.md` (format in AGENTS.md), plus the MISSING list and deploy steps.

**Later (not today):** an admin page for messages, videos and logbook (useful practice for AMS auth); real certificate scans; video links.

## MISSING (left out of the live site until Abinash provides them)
<!-- Claude Code fills this in during the build -->
- **CV PDF**: the hero's "CV (PDF)" link is hidden. Drop the file at `public/abinash-adhikari-cv.pdf` and add the link back in `src/components/sections/Hero.tsx`.
- **YouTube links**: the Videos section, the hero's "Videos" link and the case-study video are hidden. Add entries to `src/content/videos.ts` and they appear.
- **Handwritten margin notes** (your own words): the Work rows show no Caveat notes. The only one live is the Research line, "Being a developer takes research too."
- **FOS receipt screenshot**: the pinned story's "bill gets printed" step was dropped (4 steps: table → order → live alert → offline).
- **Year of the BIM 5th-semester topper result**: that Recognition row has no year.
- **Vendora / Bibhid live links, and Bibhid's year**: no links shown, and Bibhid shows no year.
- **Growth Forum Nepal paper title**: the row says "Presented a case paper" without a title.
- **Event name for the hosting photo**: the caption says "Hosting an event at Orchid International College".
- **Domain**: `NEXT_PUBLIC_SITE_URL` must be set in Vercel (sitemap, robots, OG URLs).
- **Real FOS backstory** (what staff did before the app): the case study's "The problem" is written only from verified features.
- **AMS teammate credit and your exact parts**: the AMS row says "Built with a teammate" and nothing more.
- **Logbooks #1–#4**: only #5–#10 are shown.

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
- 2026-10-20 · 5 · `/work/[slug]` with `generateStaticParams` (→ `● /work/fos` SSG), `dynamicParams = false`, async `generateMetadata`, `notFound()`; copy in `src/content/case-studies.ts`, FACTS only ("The problem" and "What I'd do next" left out until Abinash provides them). Added `app/not-found.tsx`. Verified: `/work/nope` → 404; client navigation home → /work/fos → back leaves 0 → 2 pin-spacers, no page errors.
- 2026-10-20 · 4 · Added deps `gsap@3.15.0` + `@gsap/react@2.1.2` (locked motion decision; SplitText ships free). Ported `lib/gsap.ts`; new client wrappers `motion/RevealRoot`, `motion/HeroMotion` (SplitText lines + mask, autoSplit, async tweens added to the matchMedia context), `motion/HorizontalPin`; PinnedStory pin + scaleY progress + onToggle screen swap. All inside `gsap.matchMedia()` (desktop+motion for pins). Added a 2.5s CSS fail-safe so `.split-pending` can never stay hidden. Verified in headless Edge: 2 pin-spacers on desktop → 0 after resizing to 390px → 2 again, no horizontal overflow, no page errors.
- 2026-10-20 · 3 · Home page as a Server Component: Hero, Work (phone + browser frames, "Also" line), PinnedStory (client, 4 FACTS-only steps, HTML overlays), Videos (hidden while `videos` is empty), Notes, About (portrait + hosting photo + stack table), Recognition (3 groups; `view` is a real link enhanced into a native `<dialog>` Lightbox), Contact (links; form in phase 6). New `js:` Tailwind variant for progressive enhancement; section numbers are computed so hidden sections leave no gaps. Checked with JS off in headless Edge (light) and fixed clipped Notes. Touched phase-1 ThemeToggle (one class: hidden without JS).
- 2026-10-20 · 2 · Raw images moved to `assets-src/` (gitignored, 18 MB) → `scripts/prepare-images.mjs` (sharp) writes 24 web copies to `public/shots|photos|certs` (≤2000px, q80, EXIF stripped). "Fish Station" banner pixelated+blurred, Vendora admin cropped above the Windows watermark, BizBuzz photo EXIF-rotated; every output viewed. Typed content: `types.ts`, `projects.ts` (+fosSteps), `logbook.ts` (#5–#10), `recognition.ts` (3 groups, 8 rows), `about.ts`, `videos.ts` (empty). Added status "Built" for Vendora (FACTS says BUILT, not shipped). Also added `.claude/settings.local.json` to .gitignore (Abinash asked for no permission prompts).
- 2026-10-20 · 1 · Ported styles.css (light + dark tokens; dark follows the system without JS, `data-theme` overrides it), label raised to 0.75rem, grid lines at 5% ink. Added the derived token `--accent-text` (#B8401C light / #FF6B45 dark) because vermilion #E4572E is only 3.3:1 on paper, so it's used for small text, while the brand vermilion stays for large type, rules and dots. Header/Footer/GridLines/ThemeToggle/ThemeScript in `components/layout`; Clock (useSyncExternalStore, no placeholder), OpenToWork (server), MarginLabel, PhoneFrame (next/image) in `components/ui`. `site.ts` gained email/links/timeZone/url (url from `NEXT_PUBLIC_SITE_URL`).
- 2026-10-20 · 0 · `metadata` export (title template, description, authors from `site`); removed the visible TODO line from the placeholder page; committed the earlier session's fonts/tokens/site.ts leftovers.
