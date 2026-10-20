import Link from "next/link";

// Rendered for notFound() calls and unknown URLs, inside the root layout (header + footer stay).
export default function NotFound() {
  return (
    <main className="shell py-32">
      <div className="page-grid">
        <p className="label col-span-4 md:col-span-2">404 — Lost</p>
        <div className="col-span-4 md:col-span-10">
          <h1 className="h-section">
            Nothing <span className="accent-word">here</span>, yet.
          </h1>
          <Link href="/" className="link-draw mt-8 inline-block font-mono text-sm text-accent-text">
            ← Back home
          </Link>
        </div>
      </div>
    </main>
  );
}
