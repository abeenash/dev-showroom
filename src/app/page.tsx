import { site } from "@/content/site";

// Phase 0 placeholder: proves the four fonts and the paper tokens. Replaced by real sections in phase 3.
export default function Home() {
  const [firstName, lastName] = site.name.split(" ");
  const roleWords = site.role.split(" ");
  const accentWord = roleWords.pop();

  return (
    <main className="mx-auto flex min-h-svh max-w-[88rem] flex-col justify-center gap-8 px-5 md:px-10">
      <p className="font-mono text-xs uppercase tracking-[0.04em] text-muted-foreground">
        00 — Hello · {site.city}
      </p>

      <h1 className="text-[clamp(3rem,11vw,8rem)] font-medium leading-[0.92] tracking-[-0.045em]">
        {firstName}
        <br />
        {lastName}
      </h1>

      <p className="text-3xl tracking-[-0.02em] md:text-5xl">
        {roleWords.join(" ")}{" "}
        <span className="font-serif italic text-accent">{accentWord}</span>
      </p>
    </main>
  );
}
