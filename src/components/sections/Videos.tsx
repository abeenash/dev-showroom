import { securityLabs, videos } from "@/content/videos";
import { AccentHeading } from "@/components/ui/AccentHeading";
import { HandNote } from "@/components/ui/HandNote";
import { LiteYouTube } from "@/components/ui/LiteYouTube";

// Renders nothing while src/content/videos.ts has no videos.
export function Videos({ n }: { n: string }) {
  if (videos.length === 0) return null;

  return (
    <section id="videos" aria-labelledby="vid-h" className="shell py-20 md:py-32">
      <AccentHeading n={n} label="Videos" id="vid-h" before="I" accent="explain" after="what I build" />

      <div className="page-grid mt-14">
        <ul className="col-span-4 grid gap-6 sm:grid-cols-2 md:col-span-10 md:col-start-3 lg:grid-cols-3">
          {videos.map((v) => (
            <li key={v.id}>
              <LiteYouTube video={v} />
            </li>
          ))}
        </ul>
      </div>

      {securityLabs.videos.length > 0 && (
        <div className="page-grid mt-16 gap-y-4 border-t pt-6">
          <div className="col-span-4 md:col-span-2">
            <h3 className="label">Security labs</h3>
          </div>
          <div className="col-span-4 md:col-span-10">
            <HandNote>{securityLabs.caption}</HandNote>
            <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {securityLabs.videos.map((v) => (
                <li key={v.id}>
                  <LiteYouTube video={v} size="sm" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
