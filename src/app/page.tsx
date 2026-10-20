import type { Metadata } from "next";
import { site } from "@/content/site";
import { videos } from "@/content/videos";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Notes } from "@/components/sections/Notes";
import { PinnedStory } from "@/components/sections/PinnedStory";
import { Recognition } from "@/components/sections/Recognition";
import { Started } from "@/components/sections/Started";
import { Videos } from "@/components/sections/Videos";
import { Work } from "@/components/sections/Work";
import { RevealRoot } from "@/components/motion/RevealRoot";
import { AvatarGuide } from "@/components/avatar/AvatarGuide";

// `absolute` skips the layout's "%s — Abinash Adhikari" template for the home page.
export const metadata: Metadata = {
  title: { absolute: `${site.name} — ${site.role}` },
  description: "Mobile apps and the backends behind them, from Lalitpur, Nepal.",
};

// A Server Component: rendered to HTML at build time (static), no JavaScript of its own.
// Interactive pieces (PinnedStory, Lightbox, Clock, ThemeToggle) are small client islands inside it.
export default function Home() {
  // Section numbers ("01 — WORK") follow the order below, so hidden sections never leave gaps.
  let count = 0;
  const n = () => String(++count).padStart(2, "0");

  return (
    <>
      <Hero />
      <RevealRoot>
        <main>
          <Work n={n()} />
          <PinnedStory n={n()} />
          {videos.length > 0 && <Videos n={n()} />}
          <Notes n={n()} />
          <About n={n()} />
          <Recognition n={n()} />
          <Started n={n()} />
          <Contact n={n()} />
        </main>
      </RevealRoot>
      {/* Last on purpose: its ScrollTriggers are created after every pin above, so they measure the final layout. */}
      {site.features.avatarGuide && <AvatarGuide />}
    </>
  );
}
