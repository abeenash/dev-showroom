"use client";

import { useState } from "react";
import type { Video } from "@/content/types";

// Lite embed: only a poster and a button until clicked, so no YouTube scripts or cookies load up front.
export function LiteYouTube({ video }: { video: Video }) {
  const [on, setOn] = useState(false);

  return (
    <figure>
      <div className="relative aspect-video w-full overflow-hidden border bg-paper-2">
        {on ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1`}
            title={video.caption}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <a
            href={`https://www.youtube.com/watch?v=${video.id}`}
            onClick={(e) => {
              e.preventDefault();
              setOn(true);
            }}
            className="group absolute inset-0 flex flex-col justify-between p-5 text-left"
            aria-label={`Play video: ${video.caption}`}
          >
            <span className="label relative">{video.length}</span>
            <span className="relative flex items-end justify-between gap-4">
              <span className="font-serif text-3xl italic leading-none">{video.title}</span>
              <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-accent text-background transition-transform duration-300 group-hover:scale-110">
                <svg viewBox="0 0 24 24" className="ml-1 size-5" fill="currentColor" aria-hidden>
                  <path d="M7 4.5v15l13-7.5z" />
                </svg>
              </span>
            </span>
          </a>
        )}
      </div>
      <figcaption className="mt-3 text-sm text-muted-foreground">{video.caption}</figcaption>
    </figure>
  );
}
