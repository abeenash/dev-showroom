# FACTS — the only source of truth for site copy

Everything on the site must trace back to this file. If a fact isn't here, leave that element out (see AGENTS.md → Content truth rules) and add it to the MISSING list.
Sources: CV (Oct 2026), the RMS repo and its logbooks #5–#10, the AMS repo, and Abinash's answers in chat (round 2: 20 Oct 2026).
Status: ✅ verified · ❓ needs Abinash

## Identity
- ✅ Name: Abinash Adhikari. GitHub: `github.com/abeenash`. LinkedIn: `https://www.linkedin.com/in/abinash-adhikari-801148303`
- ✅ Role title: Mobile & Full-Stack Developer
- ✅ Intro line (Abinash's words): "I build mobile apps and the backends behind them, then I record myself explaining how they work."
- ✅ Based in Nakkhu, Lalitpur, Nepal
- ✅ Email (from CV): abeenashadheekaree77@gmail.com
- ✅ Custom domain: `https://abinasha.com.np`. The code still reads it from the `NEXT_PUBLIC_SITE_URL` env var; never hard-code it.
- ❓ CV: the PDF provided (now in `assets-src/cv/`) shows Abinash's phone number, two references' phone numbers and the old LinkedIn URL, so it can't be published. A clean copy goes at `public/Abinash_Adhikari_CV.pdf` (the hero's "CV (PDF)" link).
- ❓ Whether to show a domain email (e.g. hello@…) instead of the Gmail address
- ✅ Portrait: `public/abinash_details/pictures/001main_portfolio_picture.jpeg` (suit, red tie, on stage)
- ❌ Don't publish the phone number.

## Education
- ✅ Bachelor of Information Management (BIM), Orchid International College, 2022–present
- ✅ +2: Nightingale International College, 2019–2022. SEE: Nightingale International Secondary School, 2019

## Experience
- ✅ Mobile App Intern (React Native), **6 July 2026 – 6 October 2026**. **The company is never named.** Write "during an internship".

## Projects

### RMS — Restaurant Management System (staff app built during the internship) — status: SHIPPED (signed APK and production app bundle)
- ✅ The problem (Abinash's words): "Waiters need a way to manage each table's orders and tell the kitchen right away. They can't always be at a desktop, but they always have a phone in hand. That's where RMS comes in."
- ✅ Stack: React Native, Expo (Expo Router, EAS Build), TypeScript, TanStack Query, Axios, STOMP over WebSocket (`@stomp/stompjs`), expo-notifications, expo-print, Jest + Testing Library
- ✅ What it does: staff log in, pick a table, take an order from the menu, see live order alerts, run QR promos/payments, view and print the invoice/receipt (POS and KOT buttons)
- ✅ Pre-release code review: **12 fixes**, including startup tenant lockout, 401 handling, session restore, duplicate login submission, dashboard null-user crash, offline-banner behaviour, print cancellation feedback, and Android release config. (Don't write "15+"; that was wrong.)
- ✅ Optimistic UI with clean rollback on failure
- ✅ **Idempotency keys** on order creation and updates to prevent duplicate orders
- ✅ Printing uses `expo-print`, which renders an HTML receipt and opens the system print dialog. **Don't say Bluetooth.**
- ✅ Live events (practice scope): NEW_ORDER, PAYMENT_CONFIRMED and ORDER_CANCELLED on a per-tenant topic. Uses JWT auth on the socket, a 10s heartbeat, exponential-backoff reconnect (2s→60s, max 10 attempts), and message de-duplication by STOMP message-id. The Authorization header is redacted from logs.
- ✅ The problem behind the proxy: native apps can't send a browser Origin, so the backend refused the handshake. I built a small Node WebSocket proxy as a **practice workaround** that injects the Origin and forwards subprotocols. It is not a production fix, and the live pipeline sits behind an environment flag for each build profile.
- ✅ Dynamic QR payment (practice scope): polls for verification every 3s, the session expires after 5 minutes, and it retries. "Verification, not HTTP success, confirms payment." The backend is the source of truth for amounts.
- ✅ Local notifications through a dedicated Android channel for live alerts, with a toast fallback in Expo Go. (Describe the channel in words; don't quote its identifier.)
- ✅ Tests: **14 suites, 132 tests passing, ~55% line coverage**
- ✅ Builds: EAS profiles for development, preview (.apk) and production (app bundle)
- ✅ Handwritten note (approved), under the order screen: "the totals had to match the POS to the rupee"
- ❓ YouTube walkthrough link

### AMS — Academic Management System — status: IN PROGRESS (no users yet)
- ✅ **Abinash's solo project.** (Earlier drafts said "built with a teammate"; that was wrong.)
- ✅ Stack: Spring Boot REST API (Java, Maven, Docker Compose) + Expo / React Native mobile app with NativeWind, TanStack Query, Expo Router
- ✅ Roles in the mobile app: **student** and **teacher**. Admin sign-in is refused on mobile.
- ✅ Student: attendance overview and history (grouped by day, filter by subject, thresholds), notices, academics
- ✅ Teacher: mark attendance per subject and section, marks, notices
- ✅ Polish: offline banner, skeleton loaders, a slow-network notice, empty and error states
- ✅ The plan is to build the AMS web side with Next.js later
- ✅ Handwritten notes (approved): under attendance history, "students see their daily attendance at a glance"; under "Attendance submitted", "teachers get the attendance overview"
- ❓ YouTube walkthrough link

### Vendora SIMS — status: BUILT (2026, screenshots in public/shots/vendora)
- ✅ Full-stack web app: Laravel + React + Inertia.js, containerized with Docker
- ✅ Videos: "Sales and Inventory Management System: Vendora" (`XYmZBwiqwzk`) and "Containerizing Vendora" (`Wd_6ydrR-SA`)
- No live link (not needed).

### Bibhid — status: MOCKUP
- ✅ MERN with TypeScript, mock e-commerce platform, OAuth strategy
- No year or live link (not needed).

### Smaller (CV)
- ✅ Notes App (MERN), deployed on Render: **https://sharencare.onrender.com** (free tier, so the first load can be slow)
- ✅ Mobile Notes App: React Native + TypeScript + Appwrite, packaged as an APK and installed on a real device. Video: "notes app using react native" (`dcIrrSUoCYg`)

### Where I started (2025)
- ✅ Mood Journal, Weather Checker, Expense Tracker: React mini-projects in the old portfolio repo (`E:\PROJECTS\portfolio-with-react\project-portfolio\src`), to be ported from JSX to TSX

## Logbook entries (real; paraphrase for the "Notes" strip)
- **#5 — 27 Aug 2026:** Full code review of services, hooks and screens; fixed release config, tenant lockout, 401s, session restore, duplicate login and the null-user crash. Release APKs can't run in Expo Go because native modules need a dev build.
- **#6 — 30 Aug 2026:** First signed .apk on a real device. Dynamic QR: "verification, not HTTP success, confirms payment". A network failure doesn't mean a failed payment.
- **#7 — 3 Sep 2026:** STOMP live events with JWT, heartbeat and backoff reconnect. Native apps have no Origin, so the handshake is refused. Fixed-interval reconnects hammer the server.
- **#8 — 7 Sep 2026:** Local notifications on a dedicated live-alerts channel. Built a WebSocket proxy as a practice workaround, not a production fix.
- **#9 — 10 Sep 2026:** Jest setup: 14 suites, 132 tests, ~55% coverage. "Native mocks must mirror real APIs to avoid false confidence."
- **#10 — 13 Sep 2026:** Production app bundle validated. The WebSocket proxy is a single point of failure, so a flag fallback and the offline banner keep the app healthy.
- Only #5–#10 are shown (not needed: #1–#4).

## Recognition (✅ verified from certificates in `public/abinash_details/`)
Dates on Orchid certificates are in Bikram Sambat (BS). AD years below are conversions; show AD.
1. **Tribhuvan University topper — BIM 1st semester, SGPA 4.0** (2079 batch). Orchid certificate "University topper, SGPA-4 … BIM I Semester Result 2080", dated 2080-08-11 BS (≈ Nov 2023). Evidence: `certificates/Screenshot 2026-10-20 130631.png`, poster `pictures/006bim_1stsem_res.jpeg`, felicitation photos `pictures/007acknowledgement.jpeg` and `008acknowledgement_two.jpeg`. **This is the headline row.**
2. **TU 2nd topper — BIM 3rd semester, SGPA 3.98.** Dated 2081-05-17 BS (≈ Sep 2024). Evidence: `certificates/Screenshot 2026-10-20 130637.png` (photo of the framed certificate)
3. **Topper — BIM 5th semester, SGPA 3.97** (college announcement poster; no certificate). Shown without a year. Evidence: `pictures/004bim_5th_sem_poster.jpeg`
4. **TU 2nd topper — BIM 6th semester, SGPA 3.97.** Dated 2082-12-05 BS (≈ Mar 2026). Evidence: `certificates/Screenshot 2026-10-20 130646.png`
5. **2nd Runner-Up, BizBuzz 2026**, as a member of Orchid International College's team. The event was organized by Kathford International College, and the team won a Rs. 10,000 prize cheque. Evidence: `certificates/Screenshot 2026-10-20 130613.png`, photo with the trophy `pictures/005bizbuzz_2ndrunnerup_photo.jpeg`
6. **Presented a case paper at Growth Forum Nepal** (an international conference on economic growth, organized by Embark College), 8 May 2026, Hotel Himalaya, Lalitpur. The slide in the photo is a market analysis for "Rakura" (Nepal tea exports). No paper title (not needed). Evidence: `certificates/Screenshot 2026-10-20 130605.png`, stage photo `pictures/002for_the_background.jpeg`
7. **Participant — International Conference on Contemporary Research 2026 (ICCR-2026)**, theme "Emerging Trends in Sustainability: Integrating Multidisciplinary Research". 16 May 2026, Southwestern State College, Kathmandu; organized by STEAM Research Centre. Evidence: `certificates/001_research.png`
8. **Participant — Capacity Building Workshop on Scientific Paper Writing for Researchers** (STEAM Research Centre, Professional Development Series 2026), 11 April 2026, Embark College, Lalitpur. Evidence: `certificates/Screenshot 2026-10-20 130557.png`
- ❌ Fundamentals of Cloud Computing: the certificate hasn't been found yet, so leave it out.
- ❌ "Organized research conferences": there's no evidence, so don't claim it.
- Grouping: **Academics** (1–4), **Competitions** (5), **Research** (6–8). Handwritten group captions (Abinash's words, approved):
  - Academics: "Being a developer takes consistency and discipline."
  - Competitions: "Being a developer means stepping into business too."
  - Research: "Being a developer takes research too."

## Photos (✅ Abinash's own; use them, they make the site human)
- `001main_portfolio_picture.jpeg`: the main portrait (About section, and the OG image if it suits)
- `002for_the_background.jpeg`: presenting at Growth Forum Nepal (a natural fit beside the Research row)
- `003hosting_the_attendance_pic.jpeg`: hosting **Orchid Dashain Utsav 2083** on stage with a mic (About, as a human moment)
- `005bizbuzz_2ndrunnerup_photo.jpeg`: with the BizBuzz trophy
- `007` / `008acknowledgement*.jpeg`: being felicitated for the TU topper result. These include college staff, so use them only as Recognition evidence, not as big hero images.
- `004` / `006`: college congratulation posters. Use as Recognition evidence only; their style clashes with the site.

## Screenshots (✅ provided; prepare them before use)
- **RMS** (`assets-src/shots/rms/` → `public/shots/rms/`): `001_rms.jpg` is the table dashboard (clean) and `002_rms.jpg` is the Table 4 order screen. **`002` shows a "Fish Station" menu banner with a real US address and phone number.** Blur that area (about x 46–515, y 1254–1393 on the 1080×2640 original) in the web copy and check the result by viewing the image. There's no receipt screenshot, so the pinned story has no "bill gets printed" step (not needed).
- **AMS** (`public/shots/ams/`): `003` attendance history, `004` teacher's "Attendance submitted", `005` offline error state with "You're offline. Showing saved data." All clean.
- **Vendora** (`public/shots/vendora/`): screenshots dated Feb 2026, so the project year is **2026** (not 2025). Several show a Windows "Activate Windows" watermark at the bottom right: crop it, or prefer the shots without it. Customer names and phone numbers in "Add sale" are seed data, but prefer other shots anyway.
- **Bibhid** (`public/shots/bibhid/`): storefront, login (Google OAuth button) and admin dashboard. Seed data only.
- **Image prep (phase 2):** the originals are huge (up to 4284×5712, 18 MB in total). Move the raw files to `assets-src/` (not served), then generate web copies into `public/` (long edge ≤ 2000px, quality ~80, kebab-case names with no spaces) using `sharp`, which comes with Next.js. Every image must go through `next/image`.

## Known false or unverified claims in the Lovable draft — never copy these
- "Fixed 15+ real-world failures" → it's **12 fixes**
- "Bluetooth printer" / "32-character width" → it's **expo-print with the system print dialog**
- "Two phones, one waiter account; the server now revokes the older session" → the real fix was **duplicate login *submission*** (double-tap)
- "Cart is local first" · "queued actions when offline" · "alert within a second" → unverified. Check the RMS code (`hooks/useTableOrdering.ts`, `components/OfflineBanner.tsx`) before claiming any of them. Live alerts are **practice scope**.
- Case-study story ("waiters were walking orders to the kitchen and shouting totals") → invented. Use Abinash's own "The problem" text above instead.
- Logbooks #3, #12 and #14 don't exist (#14 is even dated after the internship ended). Use only #5–#10 above.
- Award years (2023, 2024–26, 2025) are guesses. Video lengths (08:42, 11:05, 06:18) are made up; don't show durations at all.
- `hello@abinashadhikari.com.np` and `youtube.com/@abinashadhikari` are unconfirmed.
- AMS: "I'm on the mobile side and half the API" and "built with a teammate" are wrong: AMS is solo.
- **Handwritten margin notes:** use only the ones Abinash approved (listed under RMS, AMS and Recognition above). Lovable's "grouping by day was a teacher's idea, not mine" is invented; never use it.

## Videos (✅ YouTube channel "No-vice Novice"; titles from YouTube oEmbed, 20 Oct 2026)
Narration is mixed English and Nepali. Never show durations (not verified). Strip `?si=` tracking parameters.
- Main row ("I explain what I build"):
  - `XYmZBwiqwzk`: "Sales and Inventory Management System: Vendora"
  - `Wd_6ydrR-SA`: "Containerizing Vendora"
  - `dcIrrSUoCYg`: "notes app using react native"
- Second row, "Security labs". Caption (Abinash's words): "Run on my own lab setup, to understand how attacks work so I can build against them."
  - `Qa546IzzZFw`: "Password Cracking Lab Demonstration"
  - `KLdD1l98RCs`: "SQL Injection Lab Demonstration (IT Ethics and Cybersecurity)"
