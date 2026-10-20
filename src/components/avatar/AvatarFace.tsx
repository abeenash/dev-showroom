// "Little me": a flat cartoon of Abinash in the site palette (FACTS → his look: messy black hair,
// thick square black glasses; the vermilion tie echoes his portrait). One inline SVG with named
// parts (classes, not ids, because two copies can be on the page) so GSAP can change the expression.
// Fixed colours, so it looks the same in light and dark themes. Always decorative.

const INK = "#1a1a17";
const PAPER = "#f4f1ea";
const PAPER_2 = "#ebe7dd";
const ACCENT = "#e4572e";

/** Mouth and brow shapes. Every expression morphs between these with MorphSVG. */
export const FACE = {
  mouth: {
    smile: "M27 37.4Q32 41.6 37 37.4Q32 39.6 27 37.4Z",
    grin: "M25.8 36.4Q32 44 38.2 36.4Q32 38 25.8 36.4Z",
    proud: "M28.6 38Q32 40.2 35.4 38Q32 39.1 28.6 38Z",
    flat: "M29 38.4Q32 38.9 35 38.4Q32 39.4 29 38.4Z",
    curious: "M30.4 38.6Q32 37 33.6 38.6Q32 40.6 30.4 38.6Z",
    open: "M28.6 37Q32 36.2 35.4 37Q32 42.2 28.6 37Z",
    relaxed: "M28 38Q32 40.8 36 38Q32 39.5 28 38Z",
  },
  browL: {
    neutral: "M22.4 24.6Q25.8 23.2 29.2 24.6",
    raised: "M22.4 23.8Q25.8 22.4 29.2 23.8",
    focus: "M22.4 23.6Q25.8 24.2 29.2 25.4",
    soft: "M22.4 24.2Q25.8 23.6 29.2 24.8",
  },
  browR: {
    neutral: "M34.8 24.6Q38.2 23.2 41.6 24.6",
    raised: "M34.8 23.4Q38.2 21.8 41.6 23.4",
    focus: "M34.8 25.4Q38.2 24.2 41.6 23.6",
    soft: "M34.8 24.8Q38.2 23.6 41.6 24.2",
  },
} as const;

export function AvatarFace({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden focusable="false">
      {/* Round badge */}
      <circle cx="32" cy="32" r="30" fill={PAPER_2} stroke={INK} strokeWidth="2" />
      {/* Neck, then the suit (its bottom edge follows the badge's circle, so nothing needs clipping),
          collar and the vermilion tie */}
      <path d="M28.3 42.5H35.7V50.2Q32 52.2 28.3 50.2Z" fill={PAPER} stroke={INK} strokeWidth="1.4" />
      <path d="M13.5 55.5C16 51.5 22 49.5 32 49.5S48 51.5 50.5 55.5A30 30 0 0 1 13.5 55.5Z" fill={INK} />
      <path d="M27.2 49.4L32 55.6L36.8 49.4Z" fill={PAPER} />
      <path d="M30.6 52H33.4L34.2 58.6L32 61L29.8 58.6Z" fill={ACCENT} />
      {/* Ears and head */}
      <ellipse cx="19.2" cy="31.5" rx="2.2" ry="3" fill={PAPER} stroke={INK} strokeWidth="1.4" />
      <ellipse cx="44.8" cy="31.5" rx="2.2" ry="3" fill={PAPER} stroke={INK} strokeWidth="1.4" />
      <ellipse cx="32" cy="30.5" rx="13" ry="14.4" fill={PAPER} stroke={INK} strokeWidth="1.8" />
      {/* Messy hair */}
      <path
        d="M18.2 30C16.4 21 20.4 13.4 28 12.2C33 10.4 41.6 11.6 44.8 18.4C47 22.4 46.4 26.6 45.6 30C44.9 27.4 44.1 25.2 42.8 23.6L41.8 21.4L39.6 22.2L38.2 19.8L35.8 21.8L33.6 19.4L31.4 21.6L29.2 19.6L27 21.8L24.8 20.2L23 22.4L21.6 21.6C20.2 24 19 26.8 18.2 30Z M33 12C34.4 9.2 37.6 8.2 39.4 9.4C37.2 9.8 35.8 10.8 35.2 12.6Z M24.2 14.2C24.2 11.6 26.2 10 28.6 10.4C26.8 11.2 25.8 12.4 25.6 14Z"
        fill={INK}
      />
      {/* Brows */}
      <path className="av-brow-l" d={FACE.browL.neutral} fill="none" stroke={INK} strokeWidth="1.7" strokeLinecap="round" />
      <path className="av-brow-r" d={FACE.browR.neutral} fill="none" stroke={INK} strokeWidth="1.7" strokeLinecap="round" />
      {/* Eyes: open dots, plus closed "smiling" arcs that swap in for the nostalgic look */}
      <g className="av-eyes">
        <circle cx="25.8" cy="31" r="1.4" fill={INK} />
        <circle cx="38.2" cy="31" r="1.4" fill={INK} />
      </g>
      <g className="av-eyes-closed" opacity="0" fill="none" stroke={INK} strokeWidth="1.4" strokeLinecap="round">
        <path d="M24 31.4Q25.8 29.6 27.6 31.4" />
        <path d="M36.4 31.4Q38.2 29.6 40 31.4" />
      </g>
      {/* Thick square glasses */}
      <g fill={INK} fillOpacity="0.1" stroke={INK} strokeWidth="2.2" strokeLinejoin="round">
        <rect x="21" y="27.2" width="9.6" height="7.6" rx="1.4" />
        <rect x="33.4" y="27.2" width="9.6" height="7.6" rx="1.4" />
        <path d="M30.6 30.2H33.4" fill="none" />
      </g>
      {/* Glint on the glasses (concentrating) */}
      <g className="av-glint" opacity="0" stroke="#fff" strokeWidth="1.6" strokeLinecap="round">
        <path d="M22.6 30.4L25 28.4" />
        <path d="M35 30.4L37.4 28.4" />
      </g>
      {/* Blush (big grin) */}
      <g className="av-blush" opacity="0" fill={ACCENT} fillOpacity="0.45">
        <ellipse cx="21.8" cy="36.4" rx="2.6" ry="1.3" />
        <ellipse cx="42.2" cy="36.4" rx="2.6" ry="1.3" />
      </g>
      {/* Mouth */}
      <path className="av-mouth" d={FACE.mouth.smile} fill={INK} />
      {/* Waving hand, shown for the hello and goodbye */}
      <g className="av-hand" opacity="0">
        <path
          d="M47.6 53.4L47.4 45.2C47.3 42.4 50 41.4 51.6 42.8L52 39.4C52.2 37.8 54.6 37.8 54.8 39.4L55.4 45C55.8 49.4 53.8 53.6 50.6 53.8Z"
          fill={PAPER}
          stroke={INK}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
