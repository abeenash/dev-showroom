<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Abinash Adhikari — portfolio

This is the personal portfolio of Abinash Adhikari, a **Mobile & Full-Stack Developer** from Nakkhu, Lalitpur, Nepal. Read this file fully at the start of every session. It's the memory between sessions.

## Working mode: SHIP MODE (build first, teach at the end)

The goal is to **ship today**. Abinash also has AMS to work on, so don't build step by step with pauses.
- **Build autonomously.** Run every phase in `docs/PROGRESS.md` back to back in one go. Don't stop for concept briefs, don't leave `TODO(human)` tasks, and don't ask for approval between phases. (If Abinash left a `TODO(human)` unfinished, finish it yourself and explain it in the walkthrough.)
- **Stop only for real blockers:** a secret Abinash must create himself (like `DATABASE_URL`), a login (Vercel, Neon), or a destructive or irreversible action. Everything else gets decided with the rules below and recorded in the PROGRESS log.
- **Commit at every phase boundary.** Each commit is a checkpoint and the safety net:
  1. Run `npm run lint` and `npm run build`. Both must pass before the commit.
  2. Commit as `phase N: <what changed>`.
  3. Tick the phase in PROGRESS and add one log line.
  Never push or deploy unless asked.
- **Teach at the end.** When the build is done, write `docs/WALKTHROUGH.md`, then summarize it in chat (format below).

**At the start of a session:** read this file, `docs/PROGRESS.md` and `docs/FACTS.md`, then run `git status` and `git log --oneline -10`. Uncommitted changes left by an earlier Claude session for an unticked phase are part of the work: review them, keep the good parts and carry on. Don't ask about them.

## Rules that protect earlier work

- **Finished (ticked) phases are locked.** Don't restyle, rename or "clean up" their code unless Abinash asks. If a later phase truly needs a change there, make the smallest change possible and note it in the PROGRESS log.
- **Locked decisions** (below) aren't re-debated.
- Keep one component per job (see the project layout). Find and reuse existing pieces; never build a second version of something.
- Don't add dependencies beyond the ones the plan needs (gsap, @gsap/react, drizzle-orm, drizzle-kit, @neondatabase/serverless, zod, server-only). Use no UI kits, no Framer Motion and no three.js.

## Content truth rules (the live site must look finished)

- **Every fact on the site must come from `docs/FACTS.md`.** That covers dates, numbers, features, roles, awards and quotes. Never invent anything.
- **No visible `TODO` text on the live site.** If a fact or asset is missing, **leave that element out cleanly**:
  - no award year → hide the year column
  - no video ID → don't render that video, and hide the whole Videos section if none are left
  - no certificate scan → no "view" link
  - no screenshot → use the serif-italic name placeholder tile from the Lovable design
  - no portrait → the About section goes without one
  - no handwritten note → no note
- Record everything you left out in a `MISSING` list in PROGRESS and in the walkthrough, so Abinash can fill it in later (a content-only change).
- Logbook entries on the site are paraphrased only from the real logbooks quoted in FACTS (#5–#10). Never write new ones.
- **Never name the internship company.** Not in the copy, alt text, metadata, file names or code comments. Screenshots must have the client branding (restaurant name, logo, phone number) cropped or blurred, and no visible emails or passwords. If you can't confirm a screenshot is clean, don't use it.
- Features described as "practice scope" in FACTS must be called that, or described as built and tested, not running in production.

## The end-of-build walkthrough (`docs/WALKTHROUGH.md`)

Abinash is learning Next.js for AMS web, so explain it like a patient senior dev walking a junior through a pull request. Use plain English and define every new term once. For **each phase** include:
1. **What I built:** the files (as `path:line` links) and what each one does, in 2–4 lines.
2. **What happens at runtime:** the actual flow, step by step. Examples: "you open `/` → Next renders `page.tsx` on the server → the HTML arrives already filled in → the browser loads only the JS for client components → `useGSAP` runs → …". For the contact form: browser → Server Action → zod → Drizzle → Neon → the response comes back.
3. **Why this way:** the Next.js concept, the alternative, and the trade-off. Include **"Lovable/TanStack did X → Next.js does Y"** where it applies.
4. **Try it yourself:** one small change he can make to see the concept move (e.g. "add `"use client"` to X and watch the bundle grow").
5. **AMS bridge:** where the same idea shows up when AMS web is built in Next.js.

End the walkthrough with: the `MISSING` list, the exact deploy and domain steps Abinash must do himself, and anything you weren't sure about.

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
6. **About ("Learning by *building*"):** two paragraphs, a portrait (left out until Abinash sends one), and a "What I've shipped with" table.
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

**Teaching bonus:** each row is a lesson. In the walkthrough, show "TanStack Start did X → Next.js does Y, because Z".

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
