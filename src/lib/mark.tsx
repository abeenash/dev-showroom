import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// The site mark: an ink "A" on paper with a vermilion dot (the "Open to work" dot).
// Shared by app/icon.tsx (favicon) and app/apple-icon.tsx.
export async function renderMark(px: number) {
  const geist = await readFile(join(process.cwd(), "assets/fonts/Geist-Medium.ttf"));
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F4F1EA",
          color: "#1A1A17",
          fontFamily: "Geist",
          fontSize: px * 0.78,
          letterSpacing: -px * 0.04,
          position: "relative",
        }}
      >
        A
        <div
          style={{
            position: "absolute",
            right: px * 0.12,
            bottom: px * 0.14,
            width: px * 0.2,
            height: px * 0.2,
            borderRadius: 999,
            background: "#E4572E",
          }}
        />
      </div>
    ),
    { width: px, height: px, fonts: [{ name: "Geist", data: geist, weight: 500, style: "normal" }] },
  );
}
