import Link from "next/link";
import { site } from "@/content/site";
import { Clock } from "@/components/ui/Clock";
import { MarginLabel } from "@/components/ui/MarginLabel";
import { OpenToWork } from "@/components/ui/OpenToWork";
import { HeroMotion } from "@/components/motion/HeroMotion";

// CV (PDF) and Videos links return once Abinash provides them (PROGRESS → MISSING).
const links = [
  { label: "Work", href: "/#work" },
  { label: "Case study", href: "/work/fos" },
  { label: "GitHub", href: site.github, external: true },
  { label: "Email", href: `mailto:${site.email}` },
];

// A Server Component: the HTML arrives complete. `split-pending` + `hero-fade` are hooks
// for the client-side animation (motion/HeroMotion); CSS only hides them while JS runs.
export function Hero() {
  const [first, last] = site.name.split(" ");

  return (
    <section aria-label="Introduction" className="shell relative pb-20 md:pb-28">
      <HeroMotion>
      <div className="page-grid mt-16 md:mt-28">
        <div className="hero-fade col-span-4 mb-6 md:col-span-2 md:mb-0 md:pt-4">
          <MarginLabel n="00">Hello</MarginLabel>
        </div>
        <div className="col-span-4 md:col-span-10">
          <h1 className="display split-pending">
            {first}
            <br />
            {last}
          </h1>
          <p className="split-pending mt-6 text-2xl tracking-tight md:text-4xl">
            Mobile & Full-Stack <span className="accent-word">Developer</span>
          </p>
        </div>
      </div>

      <div className="page-grid mt-14 md:mt-20">
        <p className="hero-fade col-span-4 max-w-xl text-lg leading-relaxed md:col-span-6 md:col-start-3">{site.line}</p>
        <div className="hero-fade col-span-4 mt-8 flex flex-col gap-2 md:col-span-3 md:col-start-10 md:mt-0">
          <OpenToWork />
          <Clock />
        </div>
      </div>

      <ul className="hero-fade page-grid mt-14 gap-y-3 border-t pt-4 font-mono text-sm md:mt-20">
        {links.map((l, i) => (
          <li key={l.label} className={`col-span-2 ${i === 0 ? "md:col-start-3" : ""}`}>
            {l.external ? (
              <a href={l.href} target="_blank" rel="noreferrer" className="link-draw text-accent-text">
                {l.label} ↗
              </a>
            ) : (
              <Link href={l.href} className="link-draw text-accent-text">
                {l.label} →
              </Link>
            )}
          </li>
        ))}
      </ul>
      </HeroMotion>
    </section>
  );
}
