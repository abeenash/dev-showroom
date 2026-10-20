// Source: docs/FACTS.md → Videos. Titles are the real YouTube titles (fetched from YouTube's
// oEmbed endpoint), never invented. No durations: they aren't verified.
import type { Video } from "./types";

/** "I explain what I build": the main row. */
export const videos: Video[] = [
  { id: "XYmZBwiqwzk", title: "Sales and Inventory Management System: Vendora" },
  { id: "Wd_6ydrR-SA", title: "Containerizing Vendora" },
  { id: "dcIrrSUoCYg", title: "notes app using react native" },
];

/** The smaller second row. The caption is Abinash's own words. */
export const securityLabs = {
  caption: "Run on my own lab setup, to understand how attacks work so I can build against them.",
  videos: [
    { id: "Qa546IzzZFw", title: "Password Cracking Lab Demonstration" },
    { id: "KLdD1l98RCs", title: "SQL Injection Lab Demonstration (IT Ethics and Cybersecurity)" },
  ] satisfies Video[],
};
