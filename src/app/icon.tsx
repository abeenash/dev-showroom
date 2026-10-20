import { renderMark } from "@/lib/mark";

// Favicon generated at build time (replaces the default Next.js favicon.ico).
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return renderMark(32);
}
