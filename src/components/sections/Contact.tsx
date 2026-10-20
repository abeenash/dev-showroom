import { site } from "@/content/site";
import { AccentHeading } from "@/components/ui/AccentHeading";

export function Contact({ n }: { n: string }) {
  return (
    <section id="contact" aria-labelledby="contact-h" className="shell py-20 md:py-32">
      <AccentHeading n={n} label="Contact" id="contact-h" before="Have something" accent="worth" after="building?" display />
      <div className="page-grid mt-16 gap-y-12">
        <ul className="col-span-4 space-y-3 font-mono text-sm md:col-span-3 md:col-start-10">
          <li>
            <a className="link-draw break-all text-accent-text" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </li>
          <li>
            <a className="link-draw" href={site.linkedin} target="_blank" rel="noreferrer">
              LinkedIn ↗
            </a>
          </li>
          <li>
            <a className="link-draw" href={site.github} target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
