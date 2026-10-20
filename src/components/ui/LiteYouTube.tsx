"use client";

import { useState } from "react";
import type { Video } from "@/content/types";

type Props = { video: Video; size?: "lg" | "sm" };

// Lite embed: only a paper tile and a button until clicked, so no YouTube scripts or cookies load up front.
// `id="video-<id>"` lets other sections link straight to a video (e.g. the Vendora work row).
export function LiteYouTube({ video, size = "lg" }: Props) {
  const [on, setOn] = useState(false);
  const lg = size === "lg";

  return (
    <figure id={`video-${video.id}`} className="scroll-mt-8">
      <div className="relative aspect-video w-full overflow-hidden border bg-paper-2">
        {on ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1`}
            title={video.title}
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
            className={`group absolute inset-0 flex flex-col justify-between text-left ${lg ? "p-5" : "p-4"}`}
            aria-label={`Play video: ${video.title}`}
          >
            <span className="label">YouTube</span>
            <span className="flex items-end justify-between gap-4">
              <span className={`font-serif italic leading-none ${lg ? "line-clamp-3 text-2xl md:text-3xl" : "line-clamp-4 text-lg"}`}>
                {video.title}
              </span>
              <span
                className={`flex shrink-0 items-center justify-center rounded-full bg-accent text-background transition-transform duration-300 group-hover:scale-110 ${lg ? "size-14" : "size-10"}`}
              >
                <svg viewBox="0 0 24 24" className={`ml-0.5 ${lg ? "size-5" : "size-4"}`} fill="currentColor" aria-hidden>
                  <path d="M7 4.5v15l13-7.5z" />
                </svg>
              </span>
            </span>
          </a>
        )}
      </div>
    </figure>
  );
}
