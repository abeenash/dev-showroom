# WALKTHROUGH: how this portfolio works, and what to learn from it

Written for Abinash after the ship-mode build (2026-10-20). Read it top to bottom once, with the code open beside it. Every `path:line` is clickable in VS Code.

---

## 1. What got built

| URL | File | How it's rendered |
| --- | --- | --- |
| `/` | `src/app/page.tsx` | Static HTML at build time (`○`), plus small client islands |
| `/work/rms` | `src/app/work/[slug]/page.tsx` | Static, one page per slug from `generateStaticParams` (`●`) |
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
4. The Clock reads the time (it rendered nothing on the server on purpose, `src/components/ui/Clock.tsx:22`). GSAP splits the hero name into lines and slides them up (`src/components/motion/HeroMotion.tsx:21`), and ScrollTriggers pin the RMS phone, the logbook strip and the Recognition story, but only on desktop with motion allowed (`gsap.matchMedia()`).

**The visitor sends a message.**
1. `<form action={action}>` in `src/components/sections/ContactForm.tsx:28` posts the fields to the Server Action `sendMessage` (`src/app/actions/contact.ts:32`). With JS on, React does this with `fetch` and keeps the page; with JS off, the browser does a normal form POST. Both work.
2. On the server: honeypot check → zod validation (`:44`) → if `DATABASE_URL` is missing, a calm "email me instead" message → hash the IP (`:62`), count that IP's messages in the last 10 minutes (max 3) → `INSERT` into Neon through Drizzle.
3. The action returns a plain object (`{ status: "ok", name }` or errors). `useActionState` (`ContactForm.tsx:12`) puts it in `state`, and the form re-renders as "Thanks, Abinash."

---

## 3. The ideas worth learning (in the AGENTS.md format)

### 1 — Server Components by default, client islands where needed
- **What it is:** Components render on the server into HTML and send no JavaScript, unless the file starts with `"use client"`. Only pieces that need state, effects or browser APIs are client components, and a server component can render them and pass them props or `children`.
- **Where it lives:** `src/app/page.tsx:23` (server page), `src/components/sections/Recognition.tsx:17` (server cards → client `Lightbox`), `src/components/motion/RevealRoot.tsx` (client wrapper around server children)
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
- **Where it lives:** `src/lib/gsap.ts`, `src/components/motion/HeroMotion.tsx:28`, `src/components/sections/PinnedStory.tsx:60`, `src/components/motion/HorizontalPin.tsx:27`
- **Common mistake:** "ghost" ScrollTriggers after navigating, caused by tweens created outside the context. (Verified here: 3 pins on the home page → 0 on `/work/rms` → 3 after going back.)
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

## 4. Round 2: corrections, new content, two design upgrades

Same format as above: what I built, what happens at runtime, why this way, try it yourself, and the AMS bridge.

### R1 — Renaming the restaurant app to RMS (routes and static params)
- **What I built:** the slug changed in two content files: `src/content/projects.ts:58` and `src/content/case-studies.ts:22`. The screenshot folder moved to `public/shots/rms` with `git mv`, so git records a rename rather than a delete plus an add. Every identifier, alt text, heading and doc changed with it. AMS lost "with a teammate". LinkedIn and the Notes App link were fixed. The hero has your full line, and GitHub moved to Contact and the footer.
- **What happens at runtime:** nothing happens at request time. During `npm run build`, Next calls `generateStaticParams()` (`src/app/work/[slug]/page.tsx:9`). That returns `[{ slug: "rms" }]` because it maps over `caseStudies`, so the build output lists `● /work/rms`. The old slug is no longer generated, and `dynamicParams = false` (`:14`) turns it into a 404 instead of trying to render it on demand.
- **Why this way:** the route file never mentions a project. The slug lives only in content, so a rename is a content change and the routing follows. TanStack's `createFileRoute` + `loader` worked the same way, but Next pre-builds the page as HTML. A rename on a live site would also need a redirect (`redirects()` in `next.config.ts`) so old links and search results keep working. The site isn't deployed yet, so none was needed.
- **Try it yourself:** change `slug: "rms"` to `"rms-app"` in `case-studies.ts` only, then run `npm run build`. The route list shows `/work/rms-app`, and the Work row's "Read the case study" link now 404s, because it builds `/work/${p.slug}` from `projects.ts`. That's why both files must agree.
- **AMS bridge:** if you rename "Subjects" to "Courses" in AMS web, rename the route folder (`app/courses/[code]`) and add a permanent redirect from the old path in `next.config.ts`, because by then real users will have bookmarks.

### R2 — New content from your own words
- **What I built:**
  - Five videos with their real YouTube titles, fetched from YouTube's oEmbed API (`src/content/videos.ts`). There are no durations, because none are verified, and a smaller "Security labs" row carries your caption.
  - Each video tile has an anchor (`src/components/ui/LiteYouTube.tsx:15`), so the Vendora row can link straight to its two videos.
  - Your approved handwritten notes sit under the phone screens (`src/content/projects.ts:68`, `:82`).
  - The three Recognition captions, the Orchid Dashain Utsav 2083 caption, and your "The problem" text. That text is one constant (`projects.ts:53`) used by both the RMS row and the case study.
- **What happens at runtime:** this is all static content. Clicking a video tile swaps the tile for a `youtube-nocookie.com` iframe. Until then, no YouTube code or cookies load.
- **Why this way:** one constant used in two places can't drift apart. The Shot type gained an optional `note`, so the note travels with the screenshot it describes.
- **Try it yourself:** add `{ ...screens.amsOffline, note: "…" }` as a third AMS shot and watch the row lay out three phones.
- **AMS bridge:** the same "content in typed files" idea gives AMS one source for role names, notice categories or grading thresholds, shared by the server pages and client forms.

### R3 — One pin component, two sections (Notes and Recognition)
- **What I built:**
  - `HorizontalPin` (`src/components/motion/HorizontalPin.tsx:21`) now takes `pin` and `track` selectors and an optional `speed`. Notes passes `.notes-pin` / `.notes-track` (`src/components/sections/Notes.tsx:11`), and Recognition passes `.rec-pin` / `.rec-track` with `speed={0.55}` (`src/components/sections/Recognition.tsx:47`).
  - Recognition is now one row of chapter cards, award cards and image cards (`Recognition.tsx:17`). Clicking an image zooms it in the existing Lightbox, which gained a `start` prop (`src/components/ui/Lightbox.tsx:20`).
- **What happens at runtime (desktop, motion allowed):**
  1. `gsap.matchMedia()` runs the handler (`HorizontalPin.tsx:27`).
  2. The handler measures how far the row must slide: its full width minus the window width (`:31`).
  3. It creates one tween whose ScrollTrigger pins the section for that distance × `speed` and scrubs `x` from 0 to minus that distance.
  4. When the row's images finish loading, it calls `ScrollTrigger.refresh()` once (`:62`).
  5. If you Tab to a card that's off to the right, a `focusin` handler (`:47`) scrolls the page to the point where that card has slid into view.
- **Why this way:**
  - **No duplicated code:** one component means one place to fix bugs.
  - **Selectors, not refs:** the cards are Server Components, so the client wrapper can't hand refs to them. Selectors scoped to the wrapper (`useGSAP`'s `scope`) find the elements without turning the content into client code.
  - **Page order:** two pins on one page must be created top to bottom, so the lower one measures its start after the upper one's spacer exists. Effects run in mount order, which is page order (verified: story → notes → recognition).
  - **No layout shift:** every image card has a fixed height and a width taken from the static import's aspect ratio. The row's length is right before any image arrives, which is why CLS stays at 0.
  - **Less scrolling:** `speed` below 1 makes the row move faster than you scroll.
  - **`overflow-clip`:** the section uses it instead of `overflow-hidden`, because a hidden overflow can still be scrolled by the browser when a link inside it gets focus.
- **Try it yourself:** set `speed={1}` on Recognition and feel how much longer the section gets. Then remove `invalidateOnRefresh` and resize the window mid-pin: the row's end position goes stale.
- **AMS bridge:** a generic "pinned horizontal timeline" could show a student's semester-by-semester results. Pass it the selectors and it works anywhere.

### R3 — Scroll-snap as the no-JavaScript mobile fallback
- **What I built:** without the pin, each Recognition group is a horizontal row: `overflow-x-auto` with `snap-x snap-mandatory` on the container and `snap-start` on each card (`Recognition.tsx:63`). The row sits inside a `role="region"` with an `aria-label` and `tabIndex={0}` (`:60`), plus a small "swipe →" hint.
- **What happens at runtime:** the browser does all of it. Swiping scrolls the row, and when you let go it settles with a card's left edge aligned (snap). The region is focusable, so the arrow keys scroll it, and screen readers announce "Academics: scroll sideways for more".
- **Why this way:** CSS scroll-snap has no JavaScript, no library and no main-thread work, and it works with JS off. The pinned version and the swipe rows are the same HTML; the `lg:motion-safe:js:` classes decide which layout applies. The condition matches HorizontalPin's `matchMedia` exactly, so the CSS and the JS can never disagree.
- **Try it yourself:** in DevTools, emulate `prefers-reduced-motion: reduce` on a desktop window. The pin disappears and you get three swipe rows, with the same markup.
- **AMS bridge:** on AMS mobile web, a horizontal row of subject cards or a day-picker strip is a scroll-snap row, with no carousel library.

### R4 — The "spreading" theme switch (View Transitions API)
- **What I built:**
  - The toggle (`src/components/layout/ThemeToggle.tsx:59`) shows a moon in light mode and a sun in dark mode. CSS picks the icon from the same selectors as the colour tokens (`src/app/globals.css:225`), so it's right from the first paint.
  - The reveal is pure CSS (`globals.css:256` to `:274`).
  - `<meta name="theme-color">` is set by the inline script before paint (`src/components/layout/ThemeScript.tsx:7`) and kept in sync by the toggle.
- **What happens at runtime:**
  1. On click, the button's centre `(x, y)` and the distance to the farthest screen corner (`Math.hypot`, `:71`) are written to `--theme-x`, `--theme-y` and `--theme-radius` on `<html>`. The class `theme-reveal` is added.
  2. `document.startViewTransition(() => apply(next))` (`:79`) runs.
  3. **The browser takes a screenshot of the page as it is now** (old theme) and keeps it as `::view-transition-old(root)`.
  4. It runs the callback, which sets `data-theme`. Every CSS variable flips at once, but you don't see it yet.
  5. It shows the **live new page** as `::view-transition-new(root)`, stacked above the old screenshot.
  6. Normally the two crossfade. The CSS turns that off and instead animates the new layer's `clip-path` from `circle(0)` to `circle(radius)` around the button, over 0.65s with `cubic-bezier(0.22, 1, 0.36, 1)`: a fast start and a long, soft finish. Outside the circle you still see the old screenshot, inside it the new page, so the theme looks like it spreads out from the button.
  7. When `transition.finished` resolves, the class is removed (`:80`).
- **Why the circle works:** the radius is the distance to the *farthest* corner, so the final circle covers the whole viewport whichever corner the button is in. Animating a `clip-path` on a snapshot is cheap: the browser isn't re-laying out the page 60 times a second, just revealing more of an image it already has.
- **Why this way:**
  - **Turning the "dark" class on yourself:** just flipping `data-theme` changes everything in one frame, and there's no way to animate "every colour on the page" from a single point.
  - **No overlay element:** a circular overlay div could only fake it with one colour. The View Transitions API animates the actual page.
  - **The toggle stays crisp:** it has its own `view-transition-name` (`globals.css:253`), so it's captured separately and drawn above the reveal.
  - **Fallbacks:** without View Transitions support, or with reduced motion (`ThemeToggle.tsx:62`), the theme switches instantly. The no-flash inline script is untouched.
  - **No jumps in the pins:** the theme changes colours, not sizes, so the ScrollTrigger pins needed no refresh. Verified: toggling inside the Notes and Recognition pins left the scroll position and both row transforms identical.
- **Try it yourself:** change `0.65s` to `3s` in `globals.css` and toggle slowly, to watch the old screenshot and the live page side by side. Then change `circle(...)` to `inset(0 0 0 100%)` → `inset(0)` for a wipe instead.
- **AMS bridge:** Next.js can drive View Transitions on route changes, for example a smooth crossfade from the subject list into a subject's page. The same "old snapshot, new live page" model applies.

---

## 5. Round 3: inbox notifications, contact links, and "little me"

### F1 — Resend and `after()`: an email after the response
- **What I built:** `src/lib/notify.ts:20` sends you an email through Resend. Its settings:
  - **To and from:** to `CONTACT_TO_EMAIL`, from `CONTACT_FROM_EMAIL` or Resend's test sender (`:13`).
  - **Reply-to:** the visitor (`:47`), so "Reply" just works.
  - **Body:** a plain-text and an HTML version, with everything the visitor typed escaped (`:17`).
  - **No key:** it logs once and does nothing (`:23`).

  The contact action calls it with `after(() => notifyNewMessage(parsed.data))` (`src/app/actions/contact.ts:85`), only once the Neon insert has succeeded.
- **What happens at runtime:**
  1. The browser posts the form to the Server Action.
  2. The action validates the input, rate-limits, and inserts into Neon.
  3. `after(...)` *registers* the email job; it doesn't run it yet.
  4. The action returns `{ status: "ok" }`, React renders "Thanks, {name}", and the response goes out.
  5. **Then** the callback runs: Resend's API returns an email ID (logged as `contact: notification email sent <id>`).

  On Vercel, `after()` uses the platform's `waitUntil`, which keeps the serverless function alive until the email call finishes even though the visitor already has the answer. It worked with JavaScript off too: a plain HTML form POST still sent the email.
- **Why this way:**
  - **No `await` on the send:** awaiting it inside the action would make every visitor wait on a third-party API, and a Resend outage would turn into a failed form.
  - **No fire-and-forget:** a bare `notifyNewMessage()` without `await` might simply be killed when the serverless function freezes after responding. `after()` is the supported version of "do this later".
  - **Neon stays the source of truth:** the email is a notification, so its failure is logged and never shown.
  - **Lovable/TanStack comparison:** TanStack Start had no equivalent built in; you'd reach for a queue or the platform's `waitUntil` yourself.
- **Try it yourself:** temporarily add `await new Promise(r => setTimeout(r, 5000))` at the top of `notifyNewMessage`, submit the form, and notice "Thanks" still appears instantly. Then move the call out of `after()` and await it directly: now "Thanks" takes 5 seconds.
- **AMS bridge:** "a notice was posted → email the section's students", "attendance below threshold → notify the student". Save first, then send in `after()`. A big fan-out (hundreds of emails) belongs in a real queue, but the shape is the same.

### F2 — MorphSVG: blobs that change shape
- **What I built:**
  - **Links:** Contact is now the only place with links. The email is on one line, with a copy button (`src/components/ui/CopyEmail.tsx:18`) whose result is announced through an `aria-live` region (`:36`). The footer is just the credit line and "Back to top".
  - **Icons:** the four socials (`src/content/site.ts:27`) are inline Simple Icons glyphs, each in a blob (`src/components/ui/SocialBlobs.tsx`).
  - **Blob shapes:** three shapes generated in `src/lib/blob.ts:5`. Seven points around a circle at slightly different distances are joined with smooth Bézier curves, so every shape has the same structure.
  - **Loading MorphSVG:** the plugin loads on demand (`src/lib/gsap.ts:16`).
- **What happens at runtime:** a normal tween animates numbers, like `x: 0 → 100`. **MorphSVG** animates a path's `d` attribute, its outline, from one shape into another. It does this by lining up the points of both paths and interpolating each one, so the outline "flows". Three shapes on a `yoyo` timeline go A → B → C → B → A forever, at 6–8s per pass and different for each blob, so they never pulse together. Separate nested elements carry the other motions, so tweens never fight over the same `transform`:
  - The `li` rises in.
  - `.social-float` floats.
  - `.social-hello` bounces.
  - The icon lifts on hover (CSS).
- **Why this way:** CSS can't morph between two arbitrary paths smoothly, but MorphSVG can, and it's part of `gsap` (free since 3.13), so there's no new dependency. It's loaded with a dynamic `import()` once the contact animations start, so its ~10 KB isn't part of first load. The blob morphs are created inside `context.add()` after that import (`SocialBlobs.tsx:49`), the same rule as the SplitText fonts lesson: anything created after an `await` must join the context, or it won't be cleaned up.
- **Try it yourself:** in `src/lib/blob.ts`, change one radius in the second shape from `47` to `30` and watch that blob grow a dent as it morphs. Then give one shape 8 radii instead of 7: MorphSVG still copes, but the morph looks less smooth, because the points no longer line up one-to-one.
- **AMS bridge:** an attendance ring that morphs from "loading" into the real percentage arc, or an empty-state illustration that breathes. Same plugin, same paused-until-visible rule.

### F2 — The Page Visibility API: pause when nobody's watching
- **What I built:** in `SocialBlobs.tsx`, every idle loop is created **paused**. One `sync()` (`:71`) plays them only when *both* of these are true:
  - The contact section is on screen (a ScrollTrigger `onToggle`, `:79`).
  - `document.visibilityState === "visible"`, which is updated by the `visibilitychange` event (`:96`).

  When you come back to the tab with Contact showing, the icons do one keyframed "hello" bounce (`:92`).
- **What happens at runtime:** switching tabs or minimising the window fires `visibilitychange`, and `visibilityState` becomes `"hidden"`. We pause everything. Coming back fires it again with `"visible"`: we resume, and if the section is on screen, we bounce.
- **Why this way:**
  - **Battery:** the browser already throttles hidden tabs, but pausing explicitly also covers the *visible-but-scrolled-away* case.
  - **Accessibility:** WCAG 2.2.2 says moving content that lasts more than 5 seconds needs a way to stop. Never moving when off-screen, and nothing at all with reduced motion, keeps it calm.
  - **Easy to clean up:** the listener is removed in the matchMedia cleanup.
- **Try it yourself:** open DevTools → Console, run `document.addEventListener("visibilitychange", () => console.log(document.visibilityState))`, then switch tabs and back.
- **AMS bridge:** refetch the attendance list when a teacher returns to the tab (`visibilitychange` → `visible`), and stop polling while it's hidden. TanStack Query's `refetchOnWindowFocus` is built on exactly this.

### F3 — "Little me": mapping scroll to position and expressions
- **What I built:**
  - **The face:** a flat SVG of you (`src/components/avatar/AvatarFace.tsx`): glasses, messy hair and a vermilion tie. Its named parts (`av-mouth`, `av-brow-l`, `av-eyes` …) let GSAP change the expression, and the mouth and brow shapes are data (`FACE`, `:12`).
  - **The dock:** it sits beside "A. Adhikari" in the header on every page and every screen.
  - **The walk:** on the home page, `AvatarGuideLoader` (`src/components/avatar/AvatarGuideLoader.tsx:19`) fetches the walking version (`AvatarGuide.tsx`) **only when** the screen is at least 1536px wide and motion is allowed (`next/dynamic`, `:9`).
  - **The switch:** `site.features.avatarGuide` (`src/content/site.ts:22`) turns the whole thing on or off.
- **What happens at runtime (wide screen):**
  1. **Position** is a function of the scroll position (`target()`, `AvatarGuide.tsx:143`), recomputed on every scroll frame:
     - At the top, it sits exactly on the docked copy, scaled to 40px.
     - Over the first 240px it slides into the empty margin and grows to 64px.
     - Its height then follows page progress, `walk = scrollY / landAt` (`:159`), from the top of the screen to a landing line near the bottom. `landAt` is the scroll position where "Have something worth building?" reaches that line (`:156`).
     - After that it rides along beside the heading (`:161`).
  2. **Walking pace:** `gsap.quickTo` (`:132`) eases toward each new target over 1s, which gives the slight lag (like `scrub: 1`).
  3. **Expressions:** 11 "stops" (`:35`) each get a ScrollTrigger from that section's top crossing 55% of the screen to the next one's. `onEnter` / `onEnterBack` call `setFace()` (`:91`), which morphs the mouth and brows with MorphSVG in 0.25s and fades the glint, blush and closed-eye arcs. The wave and the talking mouth are short timelines, and a `delayedCall` blinks every 3–6s.
  4. **Getting out of the way:** while the Notes or Recognition row is pinned and sliding, its cards pass through the margin, so the avatar fades out until that section has left the screen (`:207`).
  5. **Pins and order:** pinned sections need no special code. Pins add scroll distance, so page progress simply moves more slowly through them. The guide mounts after hydration, after all the pins exist, so its triggers measure the final layout.
- **Why this way:**
  - **Computed position, not a timeline:** a single `y: 0 → 100%` timeline couldn't "start on the dock", "land beside a heading" *and* "ride along with it". A function from scroll position to `{x, y, scale}`, plus `quickTo` for smoothing, can express all three.
  - **Transforms only:** that means no layout shift (CLS stayed 0).
  - **1536px, not 1024px (a deviation):** between 1024 and 1535px the free margin is only 40–100px. The 64px avatar would sit on the RMS screenshots, the AMS text and the sliding Notes cards, which breaks your own "never over content" rule. I checked every width with a script that scrolls 61 steps and tests the avatar's box against every text run, image and field.
  - **No cost for phones:** loading it through `next/dynamic` means phones and laptops never download its code. Measured with the flag on and off, the Lighthouse scores were the same within run-to-run noise.
- **After launch: two fixes.**
  - **Chromium bug:** `gsap.quickTo(el, "scale")` failed in Chromium, because `scale` is a shorthand GSAP splits into `scaleX` and `scaleY`, so quickTo can't retarget it. In Chrome and Brave the avatar stayed at its docked size, and a warning was printed on every frame. Now there's one quickTo per property, plus a walking sway (the `.av-walk` wrapper) while you scroll.
  - **Corner mode:** most visitors are on phones, laptops or split screens, where the walk never happens. So `AvatarGuideLoader` now picks one of two modes from two media queries (`src/components/avatar/config.ts`):
    - **"walk"** from 1536px, as described above.
    - **"corner"** below that. A 44px avatar (40px on phones) appears in the bottom-left corner once the header has scrolled away, with the same faces, blink and sway, plus a little hop on each new section. It steps aside wherever it would cover the contact form, the buttons, the links at the bottom or a sliding row.

    The corner version's code is fetched on the **first scroll**, so it costs nothing on first load: Lighthouse fetched the same 11 scripts as before. Snapping a window between full and half screen swaps the modes, because the loader gives each mode its own `key`, so React mounts a fresh guide and the old one's GSAP context is reverted.
- **Try it yourself:** in `AvatarGuide.tsx`, change `{ sel: "#videos", face: "talking" }` to `face: "grin"`, or add a stop for the Vendora row (`#work ol > li:nth-child(3)`). In the browser, `document.querySelector("[data-face]").dataset.face` shows the current expression as you scroll.
- **AMS bridge:** the same "scroll position → state" mapping drives a progress indicator for a long form (a student's profile setup), and the "load only when the media query matches" loader is how you'd keep a heavy desktop-only chart out of the phone bundle.

---

## 6. MISSING: left out until you provide it

Nothing on the site says "TODO"; these things are simply absent. Add the item and the element comes back.

- **A public CV PDF.** The one you gave me shows your phone number, your two references' phone numbers and your old LinkedIn URL, so I didn't publish it. It's kept at `assets-src/cv/` (not committed). Re-export it without phone numbers or the references page and with the new LinkedIn URL, save it as `public/Abinash_Adhikari_CV.pdf`, and add the one-line link back in `src/components/sections/Hero.tsx` (the comment there shows it). `next.config.ts:6` already serves it inline with that filename.
- **Fundamentals of Cloud Computing certificate.** Once you find it, it becomes another Research or Competitions card.
- **RMS and AMS walkthrough videos.** Add them to `src/content/videos.ts` and they join the main row.
- **`OPENWEATHER_API_KEY` in Vercel.** Use the new key that's in `.env.local`.

---

## 7. Deploy and domain (abinasha.com.np)

1. **Push to GitHub.** Create an empty repo on github.com (no README), then: `git remote add origin https://github.com/abeenash/<repo>.git` and `git push -u origin master`.
2. **Import on Vercel.** vercel.com → Add New → Project → pick the repo. Framework auto-detects as Next.js; leave the build settings alone.
3. **Environment variables** (Project → Settings → Environment Variables, for Production *and* Preview), **before** the first deploy:
   - `DATABASE_URL`: the same Neon connection string as in your `.env.local`. The `messages` table already exists.
   - `NEXT_PUBLIC_SITE_URL`: `https://abinasha.com.np` (no trailing slash). It's baked in at build time, which is why it must be set first.
   - `OPENWEATHER_API_KEY`: the key from your `.env.local`.
   - `RESEND_API_KEY`: the key from your `.env.local` (resend.com → API Keys). Without it, messages are still saved; you just get no email.
   - `CONTACT_TO_EMAIL`: your inbox, the same value as in `.env.local`.
   - `CONTACT_FROM_EMAIL`: leave it **unset** for now. The code then uses `Portfolio <onboarding@resend.dev>`, Resend's test sender, which can only deliver to the email address your Resend account was created with. So `CONTACT_TO_EMAIL` must be that address until step 9.
4. **Deploy**, then open the `*.vercel.app` URL and check `/`, `/work/rms`, the videos, a playground app, and send yourself a test message. It should land in your inbox (check spam the first time), and Vercel → your project → Logs shows `contact: notification email sent <id>`.
5. **Add the domain in Vercel.** Project → Settings → Domains → add `abinasha.com.np`, then add `www.abinasha.com.np` and set it to redirect to `abinasha.com.np`. Vercel will say the domain isn't configured yet. That's expected.
6. **Point the nameservers at Vercel (register.com.np).** `.com.np` domains are managed at register.com.np, where you can set nameservers but usually not individual records. Log in → your domain → nameserver settings, and replace the current ones with:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`

   Save. If the panel asks for a reason or approval, follow it; `.np` changes are sometimes reviewed by hand.
7. **Wait.** Nameserver changes for `.np` can take **a few hours, sometimes up to 24–48 hours**. Vercel's Domains page turns green when it sees them, and then issues the HTTPS certificate automatically. Nothing on your side needs to change while you wait; the `*.vercel.app` URL keeps working.
   - With Vercel's nameservers, Vercel now runs all DNS for the domain. If you later want email at `@abinasha.com.np`, add its MX records in Vercel → Domains → DNS records.
8. **Check after launch:** `https://abinasha.com.np/sitemap.xml` and `/robots.txt` show the domain; paste the URL into a social-card preview tool to see the OG image; toggle the theme; send a message and reply to the notification (it should go to the visitor's address); every message is also in the Neon console → Tables → `messages`.
9. **Later: send from your own domain** (better deliverability, any recipient):
   1. In resend.com → Domains, add `abinasha.com.np`.
   2. Resend shows a few DNS records (an MX and a TXT for SPF, a TXT for DKIM, usually on a `send.` subdomain). Your DNS lives at Vercel now (step 6), so add them in Vercel → Domains → `abinasha.com.np` → DNS records.
   3. Wait until Resend says **Verified**.
   4. In Vercel, set `CONTACT_FROM_EMAIL` to `Portfolio <hello@abinasha.com.np>` (any name @ your domain works for sending), then **Redeploy**.

**Day-to-day commands:** `npm run dev` · `npm run lint` · `npm run build` · `npm run images` (re-generate web images after adding raw files to `assets-src/`) · `npm run db:generate` then `npm run db:migrate` (after editing `src/db/schema.ts`).

---

## 8. Things I wasn't sure about

- **The avatar walks only from 1536px.** Below that there's no empty margin wide enough. Since the post-launch update, narrower screens (laptops, split screen, phones) get the **corner companion** instead (see Round 3, F3). In the corner it sometimes sits over a line of text as you scroll past. You chose that trade-off, and it still steps aside for the contact form, the buttons, the links at the bottom and the sliding rows. To turn the avatar off entirely, set `site.features.avatarGuide` to `false`.
- **Lighthouse after Round 3:** desktop 94–96, `/work/rms` 100, mobile 86–90 (Round 2 was 97 / 90–94). The avatar isn't the cause: with its flag off, mobile measured 87–89. The difference comes from the contact section's new client code (the copy button and the animated icons, about +30ms of main-thread time) plus normal run-to-run noise. Accessibility, best practices and SEO stay at 100, and layout shift at 0.
- **The CV:** you asked for it to be linked, but publishing it would publish three phone numbers, two of them other people's. I chose not to (see MISSING).
- **Video titles** are exactly as on YouTube, including the lowercase "notes app using react native". If you'd like it capitalised, rename it on YouTube and update `src/content/videos.ts`.
- **The Vendora row's link labels** ("Vendora explained", "Containerizing Vendora with Docker") are your descriptions from chat, not the YouTube titles.
- **AMS on the home page** now shows "attendance history" and "Attendance submitted" (the two screens with your notes). The offline-banner screenshot is no longer on the home page.
- **Recognition is long** even at `speed={0.55}`: about 6,000px of scrolling on a 900px-tall screen, because there are 13 images. To shorten it, lower `speed` again or drop a felicitation photo.
- **The theme reveal starts from the button,** which is in the header at the top of the page. If the header ever becomes sticky, the reveal will also start correctly mid-page.

**Day-to-day commands:** `npm run dev` · `npm run lint` · `npm run build` · `npm run images` (re-generate web images after adding raw files to `assets-src/`) · `npm run db:generate` then `npm run db:migrate` (after editing `src/db/schema.ts`).
