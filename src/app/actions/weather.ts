"use server";

// The 2025 Weather Checker called OpenWeather straight from the browser with the API key in the code,
// so anyone could copy it. Here the call runs on the server and the key comes from an env var
// that never reaches the browser.

export type WeatherResult =
  | { ok: true; name: string; description: string; temp: number }
  | { ok: false; error: string };

export async function getWeather(city: string): Promise<WeatherResult> {
  const query = city.trim().slice(0, 80);
  if (!query) return { ok: false, error: "Enter a city first." };

  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) return { ok: false, error: "The weather service isn't connected on this site yet." };

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query)}&appid=${key}&units=metric`,
      { cache: "no-store" },
    );
    if (!res.ok) return { ok: false, error: res.status === 404 ? "City not found!" : "Couldn't reach the weather service." };
    const data = await res.json();
    return { ok: true, name: data.name, description: data.weather?.[0]?.description ?? "", temp: data.main?.temp };
  } catch {
    return { ok: false, error: "Couldn't reach the weather service." };
  }
}
