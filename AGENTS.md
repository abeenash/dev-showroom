<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Abinash Adhikari — portfolio

This is the personal portfolio of Abinash Adhikari, a **Mobile & Full-Stack Developer** from Nakkhu, Lalitpur, Nepal. It's built with Claude Code over many short sessions. This file is the memory between those sessions: read it fully at the start of every session.

## Start and end of every session (non-negotiable)

**At the start:**
1. Read this file, `docs/PROGRESS.md` and `docs/FACTS.md`.
2. Run `git status` and `git log --oneline -10`. If there are uncommitted changes you didn't make, stop and ask about them.
3. Tell Abinash in 3–5 lines: which phase we're in, what was done last, and what you'll do now. Then do only that.

**At the end:**
1. Run `npm run lint` and `npm run build`. Both must pass. If they don't, fix it or say plainly what's broken.
2. Update `docs/PROGRESS.md`: tick the boxes, add a dated session-log entry, and move new open questions to the list.
3. Add this session's Next.js lessons to `docs/LEARNING.md` (format below).
4. Commit with the message `phase N: <what changed>`. Commit only; never push unless asked.

## Rules that protect earlier work

- **Work on one phase at a time.** Touch only the files the current phase needs.
- **Finished phases are locked.** Don't restyle, rename, refactor or "clean up" anything from a ticked phase unless Abinash asks. If a later phase needs a change there, say so first, make the smallest change possible, and record it in the PROGRESS log.
- **Locked decisions** (below) aren't re-debated. Propose a change in chat; don't just do it.
- Keep the one-component-per-job structure in the layout below. Don't create a parallel second version of something that already exists; find it and reuse it.
- Don't add dependencies without saying why in the session log. Use no UI kits (shadcn, MUI, DaisyUI), no Framer Motion and no three.js.

## Content truth rules

- **Every fact on the site must come from `docs/FACTS.md`.** That covers dates, numbers, features, roles, awards and quotes.
- If something isn't there, never invent it. Render a visible `TODO(abinash): …` placeholder and add the question to PROGRESS → Open questions.
- Logbook entries on the site are paraphrased from the real logbooks quoted in FACTS. Never write new "logbook" lines.
- **Never name the internship company.** Not in the copy, alt text, metadata, file names or code comments. Screenshots must have the client branding (restaurant name, logo, phone number) cropped or blurred, and no visible emails or passwords.
- Features described as "practice scope" in FACTS must be called that, or described as built and tested, not running in production.

## Teaching mode (Abinash is learning Next.js)

Abinash will build the AMS web app with Next.js next, so this project is also his Next.js course.
- **Before coding a phase:** give a short concept brief, under 15 lines. Say what the Next.js feature is, why we use it here, and what the alternative would be.
- **During the phase:** leave **one** small, well-scoped piece for him to write himself, marked `TODO(human)`, with a clear spec. Wait for him, then review his code kindly and specifically.
- **After the phase:** append to `docs/LEARNING.md`:
  `### Phase N — <concept>` · what it is (2–3 lines) · where it lives (`path:line`) · common mistake · **AMS bridge:** how the same idea applies to AMS web.
- Explain in plain English and define every new term once. Don't assume knowledge he hasn't shown.

## Locked decisions

| Area | Decision |
| --- | --- |
| Framework | Next.js (App Router, `src/` dir), TypeScript strict, React Server Components by default; `"use client"` only where needed |
| Styling | Tailwind CSS v4 with design tokens as CSS variables in `src/app/globals.css` |
| Motion | GSAP + `@gsap/react` (`useGSAP`), ScrollTrigger, SplitText. Only `transform` and `opacity` are animated. `gsap.matchMedia()` handles reduced motion and mobile. |
| Database | Neon Postgres + Drizzle ORM. Content lives in typed files in `src/content/`, and the database only stores things that change (contact messages first). |
| Hosting | Vercel, with a custom domain (see FACTS) |
| Role title | "Mobile & Full-Stack Developer" |

## Design spec (based on the Lovable draft the user approved)

**Mood:** paper and ink, calm and editorial, warm and human. The warmth comes from the handwritten notes, honest copy and real screenshots, not from effects.

**Tokens:**
- Light theme: paper `#F4F1EA`, ink `#1A1A17`, muted `#5E5A52` (must pass AA on paper), hairline `#DEDAD0`, accent vermilion `#E4572E`.
- Dark theme: `#121210` / `#ECE8DF` / `#A39E93` / `#2A2925` / `#FF6B45`.
- The theme follows the system, with a toggle and no flash on load.

**Type (all via `next/font`):**
- Geist for body and UI.
- **Instrument Serif italic** in vermilion for exactly one accent word per big heading (e.g. "Apps people *actually* open").
- Geist Mono for labels, dates and tags.
- **Caveat** only for the handwritten margin notes.
- Labels are at least 12px. Nothing below AA contrast.

**Layout:**
- Faint vertical 12-column grid lines across the page background, at about 4% opacity.
- Every section starts with a mono margin label (`00 — HELLO`, `01 — WORK` …) in the left gutter, with the content starting at column 3.
- Use hairline rules instead of boxes.

**Signature pieces:**
1. **Hero:**
   - The name sits on two lines in a big, tight grotesk.
   - The role line reads "Mobile & Full-Stack *Developer*".
   - Below it, a one-line intro, with "● Open to work" and a live "It's 11:06 am in Lalitpur" clock on the right. The clock renders on the client only, with no placeholder time.
   - A bottom row of 4 vermilion links (Work, Videos, CV (PDF), Email) sits above a hairline.
2. **Work rows:** two phone mockups side by side (flat CSS phone frame) with a Caveat note and ↑ arrow under them (e.g. "the totals had to match the POS to the rupee"). The text side has: a mono meta line, the title, a serif-italic subtitle, a paragraph, a vermilion left-ruled highlight, a stack line in mono, and a status (● SHIPPED / ○ IN PROGRESS / ○ MOCKUP) next to "Read the case study →".
3. **Pinned story ("How the FOS app handles a *live* order"):** the phone pins on the left while 4 steps scroll on the right, with a vertical vermilion progress rule. Each step swaps the screen and overlays **HTML states** on the screenshot, such as an offline banner or a "NEW ORDER" toast. Don't bake these into new images. On mobile, don't pin; stack the steps instead.
4. **Videos ("I *explain* what I build"):** paper-tone tiles with the duration in mono, the title in serif italic, and a round vermilion play button. Use a lite embed: the YouTube iframe loads only on click.
5. **Notes from the *work*:** logbook entries in mono, scrolling horizontally on desktop (pinned and scrubbed) and stacked vertically on mobile.
6. **About ("Learning by *building*"):** two paragraphs, a portrait (TODO until Abinash sends one), and a "What I've shipped with" table.
7. **Recognition ("*Not to brag,* but…"):** a typographic list with the year in mono, the title, a sub-line and a "view" link that opens a lightbox. The first row is larger.
8. **Where I started:** three small paper tiles linking to the ported mini-projects.
9. **Contact ("Have something *worth* building?"):** underline-only fields, a black "Send message →" button, and the email, LinkedIn and GitHub links.

**Banned** (these make a site look AI-made): gradient blobs and orbs, glassmorphism, neon glows, purple-to-blue gradients, emoji in headings, skill percentages or bars, custom cursors, magnetic buttons, typewriter text, particles, and stock illustrations.

## Reference implementation: port it, don't reinvent it

The approved Lovable draft is at **`E:\abinash-adaptive-portfolio-main`** (TanStack Start + Vite). Its design and GSAP code are good, so port them to Next.js. Its *facts* are not trusted; see FACTS.md → "Known false claims".
- **That folder is read-only.** Never edit, commit or push there. It's synced to Lovable, and touching its git history breaks the user's Lovable project.
- Ignore `src/components/ui/*` (about 45 unused shadcn files), all the Radix, cmdk, recharts and vaul dependencies, and `lovable-error-reporting`, `error-capture` and `error-page`.
- Its images are `*.asset.json` pointers to Lovable's CDN and won't work locally. Use original files in `public/shots/` instead. AMS screenshots are in `E:\ams\shots\`; FOS screenshots come from Abinash, cropped.

| Lovable file | Next.js destination | What changes |
| --- | --- | --- |
| `src/styles.css` | `src/app/globals.css` | Nearly verbatim (both use Tailwind v4). Fonts become `next/font` CSS variables. Raise `label` to ≥ 0.75rem. |
| `src/routes/__root.tsx` | `src/app/layout.tsx` | `head()` becomes the `metadata` export. Google Fonts `<link>` becomes `next/font`. Keep the inline theme/`js` class script (with `suppressHydrationWarning`). Drop QueryClient. |
| `src/routes/index.tsx` | `src/app/page.tsx` | Becomes a Server Component. `useReveal` moves into a small client `<RevealRoot>` wrapper. |
| `src/routes/work.$slug.tsx` | `src/app/work/[slug]/page.tsx` | The `loader` + `notFound()` become `generateStaticParams` + `notFound()` from `next/navigation`. Use `generateMetadata` per project. Case-study copy moves to `src/content/case-studies.ts`. |
| `src/lib/gsap.ts` | `src/lib/gsap.ts` | Same file. Every component that imports it is `"use client"`. |
| `src/components/bits.tsx` | `src/components/ui/*` and `src/components/motion/*` | Split by job. Server: PhoneFrame, SectionLabel, GridOverlay. Client: Clock, OpenToWork, ThemeToggle, RevealRoot. `<img>` becomes `next/image`. |
| `src/components/Hero.tsx` | `sections/Hero.tsx` | Client component. Keep `document.fonts.ready` → SplitText (mask lines) and the `split-pending` FOUC guard. Split the nav into `layout/Header`. |
| `src/components/Work.tsx` | `sections/Work.tsx` | Server component. TanStack `Link` becomes `next/link`. |
| `src/components/PinnedPhone.tsx` | `sections/PinnedStory.tsx` | Client component. Keep the pin, the scaleY progress rule, `onToggle` → active screen, and the tap-to-switch mobile fallback. |
| `src/components/Sections.tsx` | `sections/Videos`, `Notes`, `About`, `Recognition` and `layout/Footer` | Split into one file each. Only Videos (state), Notes (GSAP) and Recognition (lightbox) are client components. The footer says "Built with Next.js and GSAP". |
| `src/components/Starter.tsx` | `sections/Started.tsx` + `/playground/*` | Keep the tile and modal look, but the mini-apps are **Abinash's original code** ported from JSX to TSX, not Lovable's rewrites. |
| `src/components/Contact.tsx` + `lib/contact.functions.ts` | `sections/Contact.tsx` + `src/app/actions/contact.ts` | `createServerFn` becomes a **Server Action** with zod, plus `useActionState`, a honeypot and a Drizzle insert (phase 6). |
| `src/content/*` | `src/content/*` | Rebuild from FACTS.md. Keep the types (`Project`, `Shot`, `PinStep`, `Video`, `Note`, `Award`). |

**Teaching bonus:** each row is a lesson. In every phase's concept brief, show "TanStack Start did X → Next.js does Y, because Z".

## Project layout

```
src/app/                 routes (layout.tsx, page.tsx, work/[slug], playground/*, api only if a route handler is truly needed)
src/components/layout/   Header, Footer, ThemeToggle, GridLines
src/components/sections/ one file per home section (Hero, Work, PinnedStory, Videos, Notes, About, Recognition, Started, Contact)
src/components/ui/       PhoneFrame, MarginLabel, AccentHeading, HandNote, LiteYouTube, Lightbox
src/components/motion/   client-only GSAP wrappers (Reveal, SplitHeading, Pin…)
src/content/             typed content: site, projects, logbook, videos, recognition, links (sourced from docs/FACTS.md)
src/db/                  Drizzle schema + client (server-only)
public/shots/            curated, cropped screenshots (never raw ones)
public/certs/            certificate scans (private numbers blurred)
docs/                    PROGRESS.md, FACTS.md, LEARNING.md
```

## Commands

`npm run dev` · `npm run lint` · `npm run build` · `npm run db:generate` · `npm run db:migrate`
