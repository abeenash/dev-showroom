import type { MetadataRoute } from "next";
import { caseStudies } from "@/content/case-studies";
import { minis } from "@/content/playground";
import { site } from "@/content/site";

// Served at /sitemap.xml. URLs come from NEXT_PUBLIC_SITE_URL, so set it in Vercel *before* building.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    ...caseStudies.map((c) => ({ url: `${site.url}/work/${c.slug}`, changeFrequency: "yearly" as const, priority: 0.8 })),
    ...minis.map((m) => ({ url: `${site.url}/playground/${m.slug}`, changeFrequency: "yearly" as const, priority: 0.3 })),
  ];
}
