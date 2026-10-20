import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import { minis, type MiniSlug } from "@/content/playground";
import { ExpenseTrackerApp, MoodJournalApp } from "@/components/playground/apps";
import WeatherChecker from "@/components/playground/WeatherChecker";

// Server page choosing a client component: the page itself ships no JS, only the chosen mini-app does.
const apps: Record<MiniSlug, ComponentType> = {
  "mood-journal": MoodJournalApp,
  "weather-checker": WeatherChecker,
  "expense-tracker": ExpenseTrackerApp,
};

export function generateStaticParams() {
  return minis.map((m) => ({ slug: m.slug }));
}

export const dynamicParams = false;

const find = (slug: string) => minis.find((m) => m.slug === slug);

export async function generateMetadata({ params }: PageProps<"/playground/[slug]">): Promise<Metadata> {
  const mini = find((await params).slug);
  return mini ? { title: mini.name, description: `${mini.name}, one of the 2025 React mini-projects I learned with.` } : {};
}

export default async function PlaygroundPage({ params }: PageProps<"/playground/[slug]">) {
  const mini = find((await params).slug);
  if (!mini) notFound();
  const App = apps[mini.slug];

  return (
    <main className="shell flex justify-center py-16 md:py-24">
      {/* The "modal" card look from the Lovable draft, as a real page with its own URL. */}
      <div className="w-full max-w-md border bg-background p-6 md:p-8">
        <div className="mb-2 flex items-baseline justify-between gap-4">
          <h1 className="font-serif text-3xl italic">{mini.name}</h1>
          <Link href="/#started" className="label link-draw hover:text-foreground">
            Close ✕
          </Link>
        </div>
        <p className="mb-8 text-sm text-muted-foreground">{mini.line}</p>
        <App />
        <p className="label mt-10 border-t pt-4">2025 · ported from JSX to TSX</p>
      </div>
    </main>
  );
}
