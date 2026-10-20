import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/content/site";

// The social preview card (1200×630), drawn with JSX at build time by next/og.
// It sits at the app root, so every route inherits it unless it defines its own.
export const alt = `${site.name}, ${site.role}, ${site.location}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#F4F1EA";
const INK = "#1A1A17";
const MUTED = "#5E5A52";
const ACCENT = "#E4572E";

export default async function Image() {
  const [geist, mono, serif, portrait] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/Geist-Medium.ttf")),
    readFile(join(process.cwd(), "assets/fonts/GeistMono-Regular.ttf")),
    readFile(join(process.cwd(), "assets/fonts/InstrumentSerif-Italic.ttf")),
    readFile(join(process.cwd(), "public/photos/portrait.jpg")),
  ]);
  const [first, last] = site.name.split(" ");
  const host = process.env.NEXT_PUBLIC_SITE_URL ? new URL(site.url).host : "github.com/abeenash";

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: PAPER, position: "relative" }}>
        {/* Faint 12-column grid, like the site */}
        {Array.from({ length: 13 }, (_, i) => (
          <div
            key={i}
            style={{ position: "absolute", top: 0, bottom: 0, left: 40 + i * 93.3, width: 1, background: "rgba(26,26,23,0.05)" }}
          />
        ))}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 0 56px 72px", width: 780 }}>
          <div style={{ display: "flex", fontFamily: "Geist Mono", fontSize: 22, color: MUTED, letterSpacing: 1 }}>
            00 — HELLO · {site.location.toUpperCase()}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "Geist", fontSize: 132, lineHeight: 0.92, letterSpacing: -6, color: INK }}>{first}</div>
            <div style={{ fontFamily: "Geist", fontSize: 132, lineHeight: 0.92, letterSpacing: -6, color: INK }}>{last}</div>
            <div style={{ display: "flex", alignItems: "baseline", marginTop: 28, fontFamily: "Geist", fontSize: 46, letterSpacing: -1, color: INK }}>
              Mobile & Full-Stack&nbsp;
              <span style={{ fontFamily: "Instrument Serif", fontStyle: "italic", fontSize: 54, color: ACCENT }}>Developer</span>
            </div>
          </div>
          <div style={{ display: "flex", fontFamily: "Geist Mono", fontSize: 22, color: INK, borderTop: "1px solid #DEDAD0", paddingTop: 18, width: 640 }}>
            {host}
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element -- next/og renders plain <img>, not next/image */}
        <img
          src={`data:image/jpeg;base64,${portrait.toString("base64")}`}
          alt=""
          width={420}
          height={630}
          style={{ position: "absolute", right: 0, top: 0, width: 420, height: 630, objectFit: "cover", objectPosition: "50% 20%" }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: geist, weight: 500, style: "normal" },
        { name: "Geist Mono", data: mono, weight: 400, style: "normal" },
        { name: "Instrument Serif", data: serif, weight: 400, style: "italic" },
      ],
    },
  );
}
