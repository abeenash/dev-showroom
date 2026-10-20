import { site } from "@/content/site";
import { Clock } from "@/components/ui/Clock";
import { OpenToWork } from "@/components/ui/OpenToWork";
import { MarginLabel } from "@/components/ui/MarginLabel";

// Phase 1 placeholder: proves the design system. Replaced by real sections in phase 3.
export default function Home() {
  return (
    <main className="shell py-24">
      <div className="page-grid">
        <MarginLabel n="00">Hello</MarginLabel>
        <div className="col-span-4 md:col-span-10">
          <h1 className="display">{site.name}</h1>
          <p className="mt-6 text-2xl tracking-tight md:text-4xl">
            Mobile & Full-Stack <span className="accent-word">Developer</span>
          </p>
          <div className="mt-10 flex flex-col gap-2">
            <OpenToWork />
            <Clock />
          </div>
        </div>
      </div>
    </main>
  );
}
