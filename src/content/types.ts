import type { StaticImageData } from "next/image";

// Types kept from the Lovable draft (Shot, Project, PinStep, Video, Note, Award).
// Every value that uses them lives in src/content/* and traces back to docs/FACTS.md.

/** A screenshot or photo. Static imports give next/image the size and a blur placeholder for free. */
export type Shot = {
  src: StaticImageData;
  alt: string;
  /** Handwritten (Caveat) note under the screen in a Work row. Only Abinash's approved words. */
  note?: string;
  /** Short mono caption under an image card (Recognition). */
  caption?: string;
};

export type ProjectStatus = "Shipped" | "In progress" | "Built" | "Mockup";

export type Project = {
  slug: string;
  name: string;
  kind: string;
  status: ProjectStatus;
  /** Omitted when FACTS doesn't confirm a date. */
  period?: string;
  summary: string;
  highlight?: string;
  stack: string[];
  /** "phone" renders PhoneFrames; "browser" renders a flat hairline frame for wide web screenshots. */
  device: "phone" | "browser";
  shots: Shot[];
  hasCaseStudy?: boolean;
  /** Links to videos in the Videos section (by YouTube id), labelled in Abinash's words. */
  videos?: { id: string; label: string }[];
};

/** One step of the pinned RMS story. `overlay` is an HTML state drawn on top of the screenshot. */
export type PinStep = {
  n: string;
  title: string;
  body: string;
  screen: Shot;
  overlay?: "alert" | "offline";
};

/** A YouTube video. `title` is the real YouTube title. */
export type Video = { id: string; title: string };

export type Note = { n: number; date: string; text: string };

export type Award = {
  year?: string;
  title: string;
  detail: string;
  /** Evidence shown in the lightbox: certificate first, then photos. */
  images: Shot[];
};

export type AwardGroup = { name: string; caption?: string; awards: Award[] };
