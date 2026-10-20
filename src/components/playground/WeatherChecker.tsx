"use client";

// Abinash's Weather Checker (2025), ported from JSX to TSX. His flow: type a city → search →
// loading → the city's name, description and temperature, or "City not found!".
// Changes: the fetch moved into a Server Action (getWeather) so the API key stays on the server, and it
// runs on submit inside a transition instead of in a useEffect watching `query` (no effect needed when
// a click is what starts the request). Styling → the site's paper tokens.
import { useState, useTransition, type FormEvent } from "react";
import { getWeather, type WeatherResult } from "@/app/actions/weather";

function WeatherForm({ doQuery }: { doQuery: (city: string) => void }) {
  const [city, setCity] = useState("");

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (!city.trim()) return;
    doQuery(city.trim());
    setCity("");
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-3">
      <input
        type="text"
        aria-label="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter the name of the city"
        className="w-full border-b bg-transparent py-2 outline-none focus:border-accent"
      />
      <button type="submit" className="bg-foreground px-5 py-2.5 font-mono text-sm text-background">
        Search
      </button>
    </form>
  );
}

export default function WeatherChecker() {
  const [weather, setWeather] = useState<WeatherResult | null>(null);
  const [loading, startTransition] = useTransition();

  const doQuery = (city: string) =>
    startTransition(async () => {
      setWeather(await getWeather(city));
    });

  return (
    <div className="space-y-8">
      <WeatherForm doQuery={doQuery} />
      <div aria-live="polite">
        {loading && <p className="font-mono text-sm text-muted-foreground">Loading…</p>}
        {!loading && weather && !weather.ok && <p className="font-mono text-sm text-accent-text">{weather.error}</p>}
        {!loading && weather?.ok && (
          <div className="border-t pt-4">
            <p className="font-serif text-4xl italic">{weather.name}</p>
            <p className="mt-1 text-muted-foreground">{weather.description}</p>
            <p className="mt-2 font-mono text-3xl tabular-nums">{weather.temp} °C</p>
          </div>
        )}
      </div>
    </div>
  );
}
