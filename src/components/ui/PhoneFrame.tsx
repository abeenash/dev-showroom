import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";

export type Shot = { src: StaticImageData; alt: string };

type Props = {
  shot?: Shot;
  className?: string;
  /** Rendered width hint for next/image's srcset, e.g. "15rem". */
  sizes?: string;
  /** Above the fold: load eagerly (Next 16 deprecates `priority`). */
  eager?: boolean;
  children?: ReactNode;
};

// Flat CSS phone. The screenshot fills the screen; children are HTML overlays on top of it.
export function PhoneFrame({ shot, className = "", sizes = "15rem", eager, children }: Props) {
  return (
    <div className={`phone ${className}`}>
      <div className="phone-screen">
        {shot && (
          <Image
            src={shot.src}
            alt={shot.alt}
            fill
            sizes={sizes}
            loading={eager ? "eager" : "lazy"}
            placeholder="blur"
            className="object-cover object-top"
          />
        )}
        {children}
      </div>
    </div>
  );
}
