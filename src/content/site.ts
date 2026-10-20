// Source: docs/FACTS.md → Identity. Never add a field here that FACTS doesn't back.
export const site = {
  name: "Abinash Adhikari",
  shortName: "A. Adhikari",
  role: "Mobile & Full-Stack Developer",
  line: "I build mobile apps and the backends behind them, then I record myself explaining how they work.",
  city: "Lalitpur",
  location: "Nakkhu, Lalitpur, Nepal",
  timeZone: "Asia/Kathmandu",
  openToWork: true,
  description: "Mobile & Full-Stack Developer based in Nakkhu, Lalitpur, Nepal.",
  email: "abeenashadheekaree77@gmail.com",
  github: "https://github.com/abeenash",
  linkedin: "https://www.linkedin.com/in/abinash-adhikari-801148303",
  instagram: "https://www.instagram.com/a_bee_nash/",
  facebook: "https://www.facebook.com/abinash.adhikari.395",
  cv: "/Abinash_Adhikari_CV.pdf",
  // https://abinasha.com.np in production. Read from the environment (set it in Vercel), never hard-coded.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  features: {
    /** "Little me": the cartoon avatar that walks down the margin on wide screens and rides in the
     *  bottom-left corner on narrower ones (components/avatar). */
    avatarGuide: true,
  },
} as const;

/** The social links shown as icons in Contact (the only place on the site that lists them). */
export const socials = [
  { name: "LinkedIn", href: site.linkedin, icon: "linkedin" },
  { name: "GitHub", href: site.github, icon: "github" },
  { name: "Instagram", href: site.instagram, icon: "instagram" },
  { name: "Facebook", href: site.facebook, icon: "facebook" },
] as const;
