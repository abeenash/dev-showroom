// Source: docs/FACTS.md → Education, Experience, Projects, Photos.
import hosting from "../../public/photos/hosting-college-event.jpg";
import portrait from "../../public/photos/portrait.jpg";
import type { Shot } from "./types";

export const about = {
  paragraphs: [
    "I'm studying for a Bachelor of Information Management at Orchid International College (2022–now). From July to October 2026 I was a mobile app intern, building a React Native staff app from code review to a signed production build.",
    "Next I'm building the web side of AMS, the academic management system I'm building on my own, in Next.js. This site is where I learned it. I live in Nakkhu, Lalitpur.",
  ],
  portrait: { src: portrait, alt: "Abinash Adhikari in a dark suit and red tie, on stage" } satisfies Shot,
  hosting: { src: hosting, alt: "Abinash hosting an event at Orchid International College, holding a microphone" } satisfies Shot,
};

// "What I've shipped with": only tools named in FACTS (plus Next.js and Postgres, which run this site).
export const stack: { group: string; items: string[] }[] = [
  { group: "Mobile", items: ["React Native", "Expo", "EAS Build"] },
  { group: "Web", items: ["React", "Next.js", "Inertia.js"] },
  { group: "Backend", items: ["Spring Boot", "Laravel", "Node + Express"] },
  { group: "Data", items: ["PostgreSQL", "MongoDB", "Appwrite"] },
  { group: "Testing", items: ["Jest", "Testing Library"] },
  { group: "Infra", items: ["Docker", "Render", "Vercel"] },
];
