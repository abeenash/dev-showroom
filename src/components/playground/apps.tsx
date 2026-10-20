"use client";

import dynamic from "next/dynamic";

// The Mood Journal and Expense Tracker read localStorage while rendering, which doesn't exist on the
// server. `ssr: false` skips server rendering for them (it's only allowed inside a client component),
// so the ported code can keep its original lazy useState(() => localStorage…) initialisers.
const loading = () => <p className="font-mono text-sm text-muted-foreground">Loading…</p>;

export const MoodJournalApp = dynamic(() => import("./MoodJournal"), { ssr: false, loading });
export const ExpenseTrackerApp = dynamic(() => import("./ExpenseTracker"), { ssr: false, loading });
