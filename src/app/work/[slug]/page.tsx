import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudies, getCaseStudy } from "@/content/case-studies";
import { PhoneFrame } from "@/components/ui/PhoneFrame";

// TanStack's `loader` + `notFound()` became these three exports:
// 1. generateStaticParams: which slugs to build as static HTML at build time.
export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

// 2. Any slug not listed above is a 404 (instead of being rendered on demand).
export const dynamicParams = false;

// 3. Per-page <title> and description. `params` is a Promise in Next 16.
export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const study = getCaseStudy((await params).slug);
  if (!study) return {};
  return { title: `${study.title} case study`, description: study.description };
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const study = getCaseStudy((await params).slug);
  if (!study) notFound();

  return (
    <main className="shell pt-10 pb-20">
      <Link href="/#work" className="label link-draw hover:text-foreground">
        ← Back to work
      </Link>

      <h1 className="display mt-16">{study.title}</h1>
      <p className="mt-4 max-w-3xl text-2xl tracking-tight md:text-3xl">
        {study.tagline.before} <span className="accent-word">{study.tagline.accent}</span> {study.tagline.after}
      </p>

      <dl className="page-grid mt-14 gap-y-6 border-y py-5 text-sm">
        {study.facts.map(([k, v]) => (
          <div key={k} className="col-span-2 md:col-span-3">
            <dt className="label">{k}</dt>
            <dd className="mt-1">{v}</dd>
          </div>
        ))}
      </dl>

      {study.sections.map((s) => (
        <section key={s.heading} className="page-grid border-t py-14 first-of-type:border-t-0">
          <h2 className="col-span-4 text-2xl font-medium tracking-tight md:col-span-3">{s.heading}</h2>
          <div className="col-span-4 mt-4 space-y-4 text-lg leading-relaxed md:col-span-7 md:col-start-5 md:mt-0">
            {s.paragraphs?.map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
            {s.list && (
              <ul className="space-y-2">
                {s.list.map((item) => (
                  <li key={item} className="border-l-2 border-accent pl-4">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      ))}

      <section className="page-grid border-t py-14">
        <h2 className="col-span-4 text-2xl font-medium tracking-tight md:col-span-3">Screenshots</h2>
        <div className="col-span-4 mt-6 flex gap-6 md:col-span-7 md:col-start-5 md:mt-0">
          {study.shots.map((shot) => (
            <PhoneFrame key={shot.alt} shot={shot} className="w-1/2 max-w-60" sizes="(min-width: 768px) 15rem, 45vw" />
          ))}
        </div>
      </section>
    </main>
  );
}
