// Source: docs/FACTS.md → "Where I started (2025)".
export const minis = [
  { slug: "mood-journal", name: "Mood Journal", line: "How you feeling? Happy? Sad? Jot it down!" },
  { slug: "weather-checker", name: "Weather Checker", line: "Which city are we looking for today?" },
  { slug: "expense-tracker", name: "Expense Tracker", line: "Keep tabs on your spending with ease." },
] as const;

export type MiniSlug = (typeof minis)[number]["slug"];
