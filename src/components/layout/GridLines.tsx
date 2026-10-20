// Faint 12-column lines behind the whole page (desktop only). Pure decoration.
export function GridLines() {
  return (
    <div aria-hidden className="grid-lines pointer-events-none fixed inset-0 z-0 hidden md:block">
      <div className="shell page-grid h-full">
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} className="h-full" />
        ))}
      </div>
    </div>
  );
}
