// Source: docs/FACTS.md → Projects. The internship company is never named.
import amsHistory from "../../public/shots/ams/history.jpg";
import amsOffline from "../../public/shots/ams/offline.jpg";
import amsSubmitted from "../../public/shots/ams/submitted.jpg";
import bibhidAdmin from "../../public/shots/bibhid/admin-overview.jpg";
import bibhidLogin from "../../public/shots/bibhid/login.jpg";
import rmsOrder from "../../public/shots/rms/order.jpg";
import rmsTables from "../../public/shots/rms/tables.jpg";
import vendoraAdmin from "../../public/shots/vendora/admin-dashboard.jpg";
import vendoraSales from "../../public/shots/vendora/salesperson-dashboard.jpg";
import type { PinStep, Project, Shot } from "./types";

export const screens = {
  rmsTables: {
    src: rmsTables,
    alt: "RMS app: table dashboard with six available and three occupied tables",
  },
  rmsOrder: {
    src: rmsOrder,
    alt: "RMS app: Table 4 order screen listing the current order and a grand total of Rs. 840",
  },
  amsHistory: {
    src: amsHistory,
    alt: "AMS app: a student's attendance history grouped by day, with Present and Absent tags",
  },
  amsSubmitted: {
    src: amsSubmitted,
    alt: "AMS app: teacher's 'Attendance submitted' confirmation showing 2 present, 1 absent",
  },
  amsOffline: {
    src: amsOffline,
    alt: "AMS app: offline banner reading 'You're offline. Showing saved data.' above a retry state",
  },
  vendoraSales: {
    src: vendoraSales,
    alt: "Vendora: a salesperson's dashboard with daily sales and top products charts",
  },
  vendoraAdmin: {
    src: vendoraAdmin,
    alt: "Vendora: admin dashboard with totals and a critical stock level warning",
  },
  bibhidLogin: {
    src: bibhidLogin,
    alt: "Bibhid: sign-in screen with a 'Continue with Google' button above the email form",
  },
  bibhidAdmin: {
    src: bibhidAdmin,
    alt: "Bibhid: admin overview with revenue, orders and a recent orders table (seed data)",
  },
} satisfies Record<string, Shot>;

export const projects: Project[] = [
  {
    slug: "rms",
    name: "RMS",
    kind: "Restaurant Management System",
    status: "Shipped",
    period: "Jul – Oct 2026 · built during an internship",
    summary:
      "Staff log in, pick a table, take an order from the menu, see live order alerts, run QR promos and payments, and print the invoice. Shipped as a signed APK and a production app bundle.",
    highlight:
      "A pre-release code review turned up 12 fixes: startup tenant lockout, 401 handling, session restore, duplicate login submission, a null-user crash and the Android release config.",
    stack: ["React Native", "Expo", "TypeScript", "TanStack Query", "STOMP over WebSocket", "EAS Build", "Jest"],
    device: "phone",
    shots: [screens.rmsTables, screens.rmsOrder],
    hasCaseStudy: true,
  },
  {
    slug: "ams",
    name: "AMS",
    kind: "Academic Management System",
    status: "In progress",
    summary:
      "One mobile app for students and teachers. Students see attendance history grouped by day, notices and academics; teachers mark attendance per subject and section. Admins can't sign in on mobile. The web side comes next, in Next.js.",
    highlight: "Offline banner, skeleton loaders, a slow-network notice, and real empty and error states.",
    stack: ["Spring Boot", "Java", "Docker Compose", "Expo", "React Native", "NativeWind", "TanStack Query"],
    device: "phone",
    shots: [screens.amsHistory, screens.amsOffline],
  },
  {
    slug: "vendora",
    name: "Vendora SIMS",
    kind: "Sales & inventory management",
    status: "Built",
    period: "2026",
    summary:
      "A full-stack web app for tracking stock and sales. Admins get totals and low-stock warnings; salespeople get a dashboard of their own sales.",
    stack: ["Laravel", "React", "Inertia.js", "Docker"],
    device: "browser",
    shots: [screens.vendoraAdmin, screens.vendoraSales],
  },
  {
    slug: "bibhid",
    name: "Bibhid",
    kind: "E-commerce mockup",
    status: "Mockup",
    summary:
      "A mock e-commerce platform in MERN and TypeScript, with an OAuth sign-in strategy (Google) alongside email login, and an admin dashboard.",
    stack: ["MongoDB", "Express", "React", "Node", "TypeScript", "OAuth"],
    device: "browser",
    shots: [screens.bibhidLogin, screens.bibhidAdmin],
  },
];

/** Smaller projects from the CV, shown as one line each under the work list. */
export const smaller: { text: string; href?: string }[] = [
  // Render's free tier sleeps when idle, so the first load can take a while.
  { text: "Notes App (MERN), deployed on Render", href: "https://sharencare.onrender.com" },
  { text: "Mobile Notes App (React Native, TypeScript, Appwrite), packaged as an APK and run on a real phone" },
];

// The pinned story. Live events and the WebSocket proxy are practice scope (FACTS), and the copy says so.
export const rmsSteps: PinStep[] = [
  {
    n: "01",
    title: "Staff pick a table",
    body: "After login, the dashboard shows every table at a glance: green when it's free, red when it's taken.",
    screen: screens.rmsTables,
  },
  {
    n: "02",
    title: "The order goes in once",
    body: "Each order is sent with an idempotency key, so a double tap can't create a duplicate. The screen updates straight away and rolls back cleanly if the request fails.",
    screen: screens.rmsOrder,
  },
  {
    n: "03",
    title: "Other devices hear about it",
    body: "NEW_ORDER, PAYMENT_CONFIRMED and ORDER_CANCELLED arrive over STOMP with JWT auth, a 10-second heartbeat and backoff reconnects, then show up as a local notification. Built and tested as practice scope.",
    screen: screens.rmsTables,
    overlay: "alert",
  },
  {
    n: "04",
    title: "The connection drops",
    body: "An offline banner tells staff the truth instead of pretending. The live pipeline sits behind a flag, so the app stays healthy without it.",
    screen: screens.rmsOrder,
    overlay: "offline",
  },
];
