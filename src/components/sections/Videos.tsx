import { videos } from "@/content/videos";
import { AccentHeading } from "@/components/ui/AccentHeading";
import { LiteYouTube } from "@/components/ui/LiteYouTube";

// Renders nothing until src/content/videos.ts has real links.
export function Videos({ n }: { n: string }) {
  if (videos.length === 0) return null;

  return (
    <section id="videos" aria-labelledby="vid-h" className="shell py-20 md:py-32">
      <AccentHeading n={n} label="Videos" id="vid-h" before="I" accent="explain" after="what I build" />
      <div className="page-grid mt-14 gap-y-12">
        {videos.map((v, i) => (
          <div
            key={v.id}
            className={`col-span-4 ${i === 0 ? "md:col-span-6 md:col-start-3" : "md:col-span-4"} ${i === 1 ? "md:col-start-3" : ""}`}
          >
            <LiteYouTube video={v} />
          </div>
        ))}
      </div>
    </section>
  );
}
