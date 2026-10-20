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
