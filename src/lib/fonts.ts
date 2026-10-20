import { Caveat, Geist, Geist_Mono, Instrument_Serif } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Not a variable font, so the weight is required. Only the italic is used (one accent word per heading).
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

// Only for handwritten margin notes, which sit below the fold, so it isn't preloaded.
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  preload: false,
});

// Class names that declare the four --font-* CSS variables; globals.css maps them to Tailwind.
export const fontVariables = [geistSans, geistMono, instrumentSerif, caveat]
  .map((font) => font.variable)
  .join(" ");
