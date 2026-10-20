import Image from "next/image";
import { about, stack } from "@/content/about";
import { AccentHeading } from "@/components/ui/AccentHeading";

export function About({ n }: { n: string }) {
  return (
    <section id="about" aria-labelledby="about-h" className="shell py-20 md:py-32">
      <AccentHeading n={n} label="About" id="about-h" before="Learning by" accent="building" />

      <div className="page-grid mt-14 gap-y-12">
        <div className="col-span-4 md:col-span-6 md:col-start-3">
          <div className="space-y-5 text-lg leading-relaxed">
            {about.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>

          <p className="label mt-14">What I&apos;ve shipped with</p>
          <dl className="mt-4 text-sm">
            {stack.map((g) => (
              <div key={g.group} className="flex gap-4 border-t py-2.5">
                <dt className="w-20 shrink-0 font-mono text-xs leading-5 text-muted-foreground">{g.group}</dt>
                <dd>{g.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="col-span-4 space-y-10 md:col-span-3 md:col-start-10">
          <Image
            src={about.portrait.src}
            alt={about.portrait.alt}
            sizes="(min-width: 768px) 22vw, 100vw"
            placeholder="blur"
            className="h-auto w-full"
          />
          <figure className="w-2/3">
            <Image
              src={about.hosting.src}
              alt={about.hosting.alt}
              sizes="(min-width: 768px) 15vw, 66vw"
              placeholder="blur"
              className="h-auto w-full"
            />
            <figcaption className="mt-2 font-mono text-xs text-muted-foreground">
              Hosting an event at Orchid International College
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
