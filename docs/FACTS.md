# FACTS — the only source of truth for site copy

Everything on the site must trace back to this file. If a fact isn't here, render `TODO(abinash): …` and ask.
Sources: CV (Oct 2026), the FOS repo and its logbooks #5–#10, the AMS repo, and Abinash's answers in chat.
Status: ✅ verified · ❓ needs Abinash

## Identity
- ✅ Name: Abinash Adhikari. GitHub: `github.com/abeenash`. LinkedIn: `linkedin.com/in/abinash-adhikari`
- ✅ Role title: Mobile & Full-Stack Developer
- ✅ Based in Nakkhu, Lalitpur, Nepal
- ✅ Email (from CV): abeenashadheekaree77@gmail.com
- ❓ Custom domain name (registered; the name isn't confirmed yet). Lovable used `abinashadhikari.com.np`, which is unconfirmed.
- ❓ Whether to show a domain email (e.g. hello@…) instead of the Gmail address
- ❓ Portrait photo
- ❌ Don't publish the phone number.

## Education
- ✅ Bachelor of Information Management (BIM), Orchid International College, 2022–present
- ✅ +2: Nightingale International College, 2019–2022. SEE: Nightingale International Secondary School, 2019

## Experience
- ✅ Mobile App Intern (React Native), **6 July 2026 – 6 October 2026**. **The company is never named.** Write "during an internship".

## Projects

### FOS — restaurant staff app (built during the internship) — status: SHIPPED (signed APK and production app bundle)
- ✅ Stack: React Native, Expo (Expo Router, EAS Build), TypeScript, TanStack Query, Axios, STOMP over WebSocket (`@stomp/stompjs`), expo-notifications, expo-print, Jest + Testing Library
- ✅ What it does: staff log in, pick a table, take an order from the menu, see live order alerts, run QR promos/payments, view and print the invoice/receipt (POS and KOT buttons)
- ✅ Pre-release code review: **12 fixes**, including startup tenant lockout, 401 handling, session restore, duplicate login submission, dashboard null-user crash, offline-banner behaviour, print cancellation feedback, and Android release config. (Don't write "15+"; that was wrong.)
- ✅ Optimistic UI with clean rollback on failure
- ✅ **Idempotency keys** on order creation and updates to prevent duplicate orders
- ✅ Printing uses `expo-print`, which renders an HTML receipt and opens the system print dialog. **Don't say Bluetooth.**
- ✅ Live events (practice scope): NEW_ORDER, PAYMENT_CONFIRMED and ORDER_CANCELLED on `/topic/tenant/{tenantSlug}`. Uses JWT auth on the socket, a 10s heartbeat, exponential-backoff reconnect (2s→60s, max 10 attempts), and message de-duplication by STOMP message-id. The Authorization header is redacted from logs.
- ✅ The problem behind the proxy: native apps can't send a browser Origin, so the backend refused the handshake. I built a small Node WebSocket proxy as a **practice workaround** that injects the Origin and forwards subprotocols. It is not a production fix, and the live pipeline sits behind an `EXPO_PUBLIC_WS_ENABLED` flag for each build profile.
- ✅ Dynamic QR payment (practice scope): polls for verification every 3s, the session expires after 5 minutes, and it retries. "Verification, not HTTP success, confirms payment." The backend is the source of truth for amounts.
- ✅ Local notifications through a "FOS Live Alerts" Android channel, with a toast fallback in Expo Go
- ✅ Tests: **14 suites, 132 tests passing, ~55% line coverage**
- ✅ Builds: EAS profiles for development, preview (.apk) and production (app bundle)
- ❓ YouTube walkthrough link

### AMS — Academic Management System — status: IN PROGRESS (no users yet)
- ✅ Built with a teammate. ❓ Credit the teammate by name or link? ❓ Exactly which parts are Abinash's?
- ✅ Stack: Spring Boot REST API (Java, Maven, Docker Compose) + Expo / React Native mobile app with NativeWind, TanStack Query, Expo Router
- ✅ Roles in the mobile app: **student** and **teacher**. Admin sign-in is refused on mobile.
- ✅ Student: attendance overview and history (grouped by day, filter by subject, thresholds), notices, academics
- ✅ Teacher: mark attendance per subject and section, marks, notices
- ✅ Polish: offline banner, skeleton loaders, a slow-network notice, empty and error states
- ✅ The plan is to build the AMS web side with Next.js later
- ❓ YouTube walkthrough link

### Vendora SIMS — status: ❓ (shipped? where?)
- ✅ Full-stack web app: Laravel + React + Inertia.js, containerized with Docker
- ❓ Year, screenshots, live link

### Bibhid — status: MOCKUP
- ✅ MERN with TypeScript, mock e-commerce platform, OAuth strategy
- ❓ Year, screenshots

### Smaller (CV)
- ✅ Notes App (MERN), deployed on Render
- ✅ Mobile Notes App: React Native + TypeScript + Appwrite, packaged as an APK and installed on a real device

### Where I started (2025)
- ✅ Mood Journal, Weather Checker, Expense Tracker: React mini-projects in the old portfolio repo (`E:\PROJECTS\portfolio-with-react\project-portfolio\src`), to be ported from JSX to TSX

## Logbook entries (real; paraphrase for the "Notes" strip)
- **#5 — 27 Aug 2026:** Full code review of services, hooks and screens; fixed release config, tenant lockout, 401s, session restore, duplicate login and the null-user crash. Release APKs can't run in Expo Go because native modules need a dev build.
- **#6 — 30 Aug 2026:** First signed .apk on a real device. Dynamic QR: "verification, not HTTP success, confirms payment". A network failure doesn't mean a failed payment.
- **#7 — 3 Sep 2026:** STOMP live events with JWT, heartbeat and backoff reconnect. Native apps have no Origin, so the handshake is refused. Fixed-interval reconnects hammer the server.
- **#8 — 7 Sep 2026:** Local notifications ("FOS Live Alerts"). Built a WebSocket proxy as a practice workaround, not a production fix.
- **#9 — 10 Sep 2026:** Jest setup: 14 suites, 132 tests, ~55% coverage. "Native mocks must mirror real APIs to avoid false confidence."
- **#10 — 13 Sep 2026:** Production app bundle validated. The WebSocket proxy is a single point of failure, so a flag fallback and the offline banner keep the app healthy.
- ❓ Logbooks #1–#4 aren't in the repo. Add them if they exist.

## Recognition
- ✅ Tribhuvan University topper, BIM 1st semester. ❓ Year
- ✅ Academic certificates for BIM 3rd, 5th and 6th semesters. ❓ Exact title of each (topper? distinction?) and years
- ✅ Fundamentals of Cloud Computing certificate. ❓ Issuer and year
- ✅ STEAM research capacity-building workshop (participant). ❓ Year
- ✅ Research conferences organized and attended. ❓ Names, roles, years
- Scans are coming (CamScanner). Blur registration, symbol and roll numbers and any date of birth.

## Known false or unverified claims in the Lovable draft — never copy these
- "Fixed 15+ real-world failures" → it's **12 fixes**
- "Bluetooth printer" / "32-character width" → it's **expo-print with the system print dialog**
- "Two phones, one waiter account; the server now revokes the older session" → the real fix was **duplicate login *submission*** (double-tap)
- "Cart is local first" · "queued actions when offline" · "alert within a second" → unverified. Check the FOS code (`hooks/useTableOrdering.ts`, `components/OfflineBanner.tsx`) before claiming any of them. Live alerts are **practice scope**.
- Case-study story ("waiters were walking orders to the kitchen and shouting totals") → invented. Ask Abinash for the real context.
- Logbooks #3, #12 and #14 don't exist (#14 is even dated after the internship ended). Use only #5–#10 above.
- Award years (2023, 2024–26, 2025) are guesses. Video lengths (08:42, 11:05, 06:18) are made up.
- `hello@abinashadhikari.com.np` and `youtube.com/@abinashadhikari` are unconfirmed.
- AMS: "I'm on the mobile side and half the API" is unconfirmed.
- **Handwritten margin notes** ("the totals had to match the POS to the rupee", "grouping by day was a teacher's idea, not mine") were invented by Lovable. Keep the style, but Abinash writes the real notes himself: a `TODO(human)` in the content phase.

## Videos
- ❓ Links live in the GitHub READMEs. Narration is mixed English and Nepali. Captions and timestamps come later.
