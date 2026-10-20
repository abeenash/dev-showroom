// Paraphrased from the real RMS logbooks #5–#10 quoted in docs/FACTS.md. Never add new lines here.
import type { Note } from "./types";

export const notes: Note[] = [
  {
    n: 5,
    date: "27 Aug 2026",
    text: "Full review of services, hooks and screens. Fixed the release config, tenant lockout, 401s, session restore, duplicate login and a null-user crash. Release APKs can't run in Expo Go: native modules need a dev build.",
  },
  {
    n: 6,
    date: "30 Aug 2026",
    text: "First signed .apk on a real device. Dynamic QR: verification, not HTTP success, confirms payment. A network failure doesn't mean a failed payment.",
  },
  {
    n: 7,
    date: "3 Sep 2026",
    text: "STOMP live events with JWT, heartbeat and backoff reconnect. Native apps send no Origin, so the handshake was refused. Fixed-interval reconnects hammer the server.",
  },
  {
    n: 8,
    date: "7 Sep 2026",
    text: "Local notifications on a dedicated live-alerts channel. Built a WebSocket proxy as a practice workaround, not a production fix.",
  },
  {
    n: 9,
    date: "10 Sep 2026",
    text: "Jest set up: 14 suites, 132 tests, about 55% coverage. Native mocks must mirror the real APIs, or they give false confidence.",
  },
  {
    n: 10,
    date: "13 Sep 2026",
    text: "Production app bundle validated. The WebSocket proxy is a single point of failure, so a flag fallback and the offline banner keep the app healthy.",
  },
];
