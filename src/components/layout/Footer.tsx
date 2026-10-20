import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="shell relative z-10 pb-10">
      <div className="flex flex-wrap justify-between gap-4 border-t pt-4 font-mono text-xs text-muted-foreground">
        <p>
          Built with Next.js and GSAP in {site.city} · © {new Date().getFullYear()}
        </p>
        <a href="#top" className="link-draw hover:text-foreground">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
