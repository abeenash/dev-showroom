// Case-study copy. Every sentence traces to docs/FACTS.md (RMS section + logbooks #5–#10).
// "The problem" is Abinash's own words. Not here on purpose: plans ("What I'd do next"),
// because FACTS doesn't have them. The company is never named.
import { rmsProblem, screens } from "./projects";
import type { Shot } from "./types";

export type CaseSection = { heading: string; paragraphs?: string[]; list?: string[] };

export type CaseStudy = {
  slug: string;
  title: string;
  /** Tagline with exactly one accent word. */
  tagline: { before: string; accent: string; after: string };
  description: string;
  facts: [label: string, value: string][];
  sections: CaseSection[];
  shots: Shot[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "rms",
    title: "RMS",
    tagline: { before: "A restaurant staff app, from code review to a", accent: "signed", after: "production build." },
    description:
      "How I built RMS, a React Native restaurant management app for staff, during an internship: orders, live alerts, QR payments, printing, 12 pre-release fixes and 132 tests.",
    facts: [
      ["Role", "Mobile App Intern (React Native)"],
      ["Timeline", "6 Jul – 6 Oct 2026"],
      ["Stack", "React Native, Expo, TypeScript, TanStack Query, STOMP"],
      ["Builds", "Signed APK + production app bundle (EAS)"],
    ],
    sections: [
      { heading: "The problem", paragraphs: [rmsProblem] },
      {
        heading: "What it does",
        list: [
          "Staff log in and pick a table from the dashboard.",
          "They take an order from the menu and update it as the table adds more.",
          "They see live order alerts.",
          "QR promos and dynamic QR payments.",
          "The invoice and receipt can be viewed and printed (POS and KOT buttons).",
        ],
      },
      {
        heading: "Decisions I made",
        list: [
          "Idempotency keys on order creation and updates, so a retry or a double tap can never create a duplicate order.",
          "Optimistic UI: the screen updates straight away, with a clean rollback if the request fails.",
          "For QR payments, verification confirms payment, not an HTTP success. The app polls every 3 seconds, the session expires after 5 minutes, and it can retry. The backend is the source of truth for amounts.",
          "Printing goes through expo-print: it renders an HTML receipt and opens the system print dialog.",
          "Local notifications on a dedicated Android channel for live alerts, with a toast fallback in Expo Go.",
        ],
      },
      {
        heading: "Live events (practice scope)",
        paragraphs: [
          "NEW_ORDER, PAYMENT_CONFIRMED and ORDER_CANCELLED arrive over STOMP on a per-tenant topic. The socket uses JWT auth, a 10-second heartbeat, and an exponential-backoff reconnect (2s up to 60s, at most 10 attempts), because fixed-interval reconnects hammer the server. Messages are de-duplicated by their STOMP message id, and the Authorization header is redacted from logs.",
          "The catch: native apps can't send a browser Origin, so the backend refused the handshake. As a practice workaround, not a production fix, I wrote a small Node WebSocket proxy that injects the Origin and forwards subprotocols. Because that proxy is a single point of failure, the whole live pipeline sits behind an environment flag per build profile, and the flag fallback plus the offline banner keep the app healthy without it.",
        ],
      },
      {
        heading: "What broke, and the 12 fixes",
        paragraphs: [
          "Before release I did a full review of services, hooks and screens. It turned up 12 fixes, including:",
        ],
        list: [
          "a startup tenant lockout",
          "401 handling",
          "session restore",
          "duplicate login submission (a double tap)",
          "a dashboard crash on a null user",
          "offline-banner behaviour",
          "feedback when printing is cancelled",
          "the Android release config",
        ],
      },
      {
        heading: "Tests and builds",
        paragraphs: [
          "Jest with Testing Library: 14 suites, 132 tests passing, about 55% line coverage. One lesson I wrote down: native mocks must mirror the real APIs, or the tests give false confidence.",
          "EAS build profiles for development, preview (an .apk) and production (an app bundle). The first signed .apk ran on a real device; release builds can't run in Expo Go, because native modules need a dev build.",
        ],
      },
    ],
    shots: [screens.rmsTables, screens.rmsOrder],
  },
];

export const getCaseStudy = (slug: string) => caseStudies.find((c) => c.slug === slug);
