"use client";

// Abinash's Mood Journal (2025), ported from JSX to TSX. The logic is his: localStorage persistence,
// newest-first entries, emoji filter, delete, reset with confirm. Changes: types, react-hot-toast → an
// inline status line, lucide icons → text, slate/gradient styling → the site's paper tokens, and the
// filter buttons now use the shape from his own commented-out `availableMoodFilters` (the original
// mapped `moods` but read `.value`/`.icon`, which didn't exist, so filtering never worked).
import { useEffect, useState, type FormEvent } from "react";

type Entry = { id: string; emoji: string; note: string; date: string };

const MOOD_JOURNAL_LOCAL_KEY = "mood_entries_v2";

const moods = [
  { emoji: "😀", label: "Happy" },
  { emoji: "😔", label: "Sad" },
  { emoji: "😡", label: "Angry" },
  { emoji: "😭", label: "Crying" },
  { emoji: "😴", label: "Sleepy" },
  { emoji: "🥳", label: "Party" },
  { emoji: "🤯", label: "Mind Blown" },
];

const availableMoodFilters = [{ label: "All", value: "all" }, ...moods.map((m) => ({ label: m.label, value: m.emoji }))];

const btn = "border px-3 py-1.5 font-mono text-xs transition-colors hover:border-accent";

function MoodInput({ onAddMood, onError }: { onAddMood: (emoji: string, note: string) => void; onError: (m: string) => void }) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedMood) {
      onError("Please select a mood.");
      return;
    }
    onAddMood(selectedMood, note);
    setSelectedMood(null);
    setNote("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="label">How are you feeling today?</p>
      <div className="flex flex-wrap gap-2">
        {moods.map((mood) => (
          <button
            key={mood.emoji}
            type="button"
            onClick={() => setSelectedMood(mood.emoji)}
            aria-pressed={selectedMood === mood.emoji}
            title={mood.label}
            aria-label={mood.label}
            className={`border p-2 text-xl transition-colors ${selectedMood === mood.emoji ? "border-accent bg-paper-2" : "hover:border-accent"}`}
          >
            {mood.emoji}
          </button>
        ))}
      </div>
      <input
        type="text"
        aria-label="Note"
        placeholder="Add a short note (optional)…"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full border-b bg-transparent py-2 outline-none focus:border-accent"
      />
      <button type="submit" disabled={!selectedMood} className="bg-foreground px-5 py-2.5 font-mono text-sm text-background disabled:opacity-40">
        Save mood
      </button>
    </form>
  );
}

function MoodList({ entries, onDelete }: { entries: Entry[]; onDelete: (id: string) => void }) {
  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">No moods logged yet</p>;
  }
  return (
    <ul>
      {entries.map((entry) => (
        <li key={entry.id} className="flex items-start justify-between gap-4 border-t py-3">
          <div className="flex items-start gap-3">
            <span className="text-2xl">{entry.emoji}</span>
            <div>
              <p className="text-sm italic">{entry.note || "No note added."}</p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">{entry.date}</p>
            </div>
          </div>
          <button onClick={() => onDelete(entry.id)} className="label link-draw hover:text-foreground" aria-label="Delete mood entry">
            delete
          </button>
        </li>
      ))}
    </ul>
  );
}

export default function MoodJournal() {
  // Reads localStorage while rendering, so this component is loaded with `ssr: false` (see apps.tsx).
  const [moodEntries, setMoodEntries] = useState<Entry[]>(() => {
    const stored = localStorage.getItem(MOOD_JOURNAL_LOCAL_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [filter, setFilter] = useState("all");
  const [status, setStatus] = useState("");

  useEffect(() => {
    localStorage.setItem(MOOD_JOURNAL_LOCAL_KEY, JSON.stringify(moodEntries));
  }, [moodEntries]);

  const addMoodEntry = (emoji: string, note: string) => {
    const newEntry: Entry = {
      id: crypto.randomUUID(),
      emoji,
      note,
      date: new Date().toLocaleString([], { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
    };
    setMoodEntries([newEntry, ...moodEntries]);
    setStatus("Mood saved successfully!");
  };

  const resetJournal = () => {
    if (window.confirm("Are you sure you want to delete all mood entries? This action cannot be undone.")) {
      setMoodEntries([]);
      setStatus("Journal reset!");
    }
  };

  const deleteMoodEntry = (id: string) => {
    setMoodEntries((prev) => prev.filter((entry) => entry.id !== id));
    setStatus("Mood entry deleted!");
  };

  const filteredEntries = filter === "all" ? moodEntries : moodEntries.filter((entry) => entry.emoji === filter);

  return (
    <div className="space-y-8">
      <MoodInput onAddMood={addMoodEntry} onError={setStatus} />
      <p role="status" aria-live="polite" className="min-h-5 font-mono text-xs text-accent-text">
        {status}
      </p>

      <div>
        <p className="label">Filter entries</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {availableMoodFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              aria-pressed={filter === f.value}
              className={`${btn} ${filter === f.value ? "border-accent text-accent-text" : ""}`}
            >
              {f.value === "all" ? f.label : `${f.value} ${f.label}`}
            </button>
          ))}
        </div>
      </div>

      <MoodList entries={filteredEntries} onDelete={deleteMoodEntry} />

      {moodEntries.length > 0 && (
        <button onClick={resetJournal} className={btn}>
          Reset journal
        </button>
      )}
    </div>
  );
}
