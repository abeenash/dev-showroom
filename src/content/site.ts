// Source: docs/FACTS.md → Identity. Never add a field here that FACTS doesn't back.
export const site = {
  name: "Abinash Adhikari",
  shortName: "A. Adhikari",
  role: "Mobile & Full-Stack Developer",
  line: "I build mobile apps and the backends behind them.",
  city: "Lalitpur",
  location: "Nakkhu, Lalitpur, Nepal",
  timeZone: "Asia/Kathmandu",
  openToWork: true,
  description: "Mobile & Full-Stack Developer based in Nakkhu, Lalitpur, Nepal.",
  email: "abeenashadheekaree77@gmail.com",
  github: "https://github.com/abeenash",
  linkedin: "https://linkedin.com/in/abinash-adhikari",
  // The domain isn't in FACTS, so it comes from the environment (set it in Vercel).
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;
