"use client";

import Image from "next/image";
import { useRef, useState, type ReactNode } from "react";
import type { Shot } from "@/content/types";

type Props = {
  title: string;
  images: Shot[];
  /** Which image opens first (the one that was clicked). */
  start?: number;
  className?: string;
  children: ReactNode;
};

// The trigger is a real link to the image, so it still works without JavaScript.
// With JavaScript it opens a native <dialog>: focus trapping, Esc-to-close and the
// backdrop come from the browser, not from a UI kit. It's a zoom: the image is
// always visible on the page too, never only in here.
export function Lightbox({ title, images, start = 0, className = "", children }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [i, setI] = useState(start);
  const shot = images[i];

  return (
    <>
      <a
        href={images[start].src.src}
        className={className}
        onClick={(e) => {
          e.preventDefault();
          setI(start);
          dialog.current?.showModal();
        }}
      >
        {children}
      </a>
      <dialog
        ref={dialog}
        aria-label={title}
        className="m-auto w-[min(56rem,calc(100vw-2rem))] bg-background p-0 text-foreground backdrop:bg-background/95"
        // A click on the dialog element itself (not its content) is a click on the backdrop.
        onClick={(e) => e.target === dialog.current && dialog.current.close()}
      >
        <div className="p-4 md:p-6">
          <div className="flex items-baseline justify-between gap-4">
            <p className="label">{title}</p>
            <button type="button" onClick={() => dialog.current?.close()} className="label link-draw hover:text-foreground">
              Close ✕
            </button>
          </div>
          <Image
            src={shot.src}
            alt={shot.alt}
            sizes="(min-width: 768px) 54rem, 100vw"
            placeholder="blur"
            className="mt-4 h-auto max-h-[72vh] w-full border object-contain"
          />
          {images.length > 1 && (
            <div className="mt-4 flex items-center justify-between font-mono text-sm">
              <button
                type="button"
                onClick={() => setI((i - 1 + images.length) % images.length)}
                className="link-draw text-accent-text"
              >
                ← Prev
              </button>
              <span className="text-muted-foreground tabular-nums">
                {i + 1} / {images.length}
              </span>
              <button type="button" onClick={() => setI((i + 1) % images.length)} className="link-draw text-accent-text">
                Next →
              </button>
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}
