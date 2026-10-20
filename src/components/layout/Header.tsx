import Link from "next/link";
import { site } from "@/content/site";
import { AvatarFace } from "@/components/avatar/AvatarFace";
import { ThemeToggle } from "./ThemeToggle";

const nav = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export function Header() {
  return (
    <header className="shell relative z-10 pt-6">
      <nav aria-label="Primary" className="page-grid items-baseline border-b pb-4">
        <Link href="/" className="label col-span-2 flex items-center gap-3 text-foreground md:col-span-3">
          {/* "Little me", docked. On wide desktop screens the home page's AvatarGuide takes it for a walk. */}
          {site.features.avatarGuide && <AvatarFace className="avatar-dock -my-3 size-10 shrink-0" />}
          {site.shortName}
        </Link>
        <div className="col-span-2 flex justify-end gap-5 md:col-span-9">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="label link-draw hidden hover:text-foreground sm:inline">
              {n.label}
            </Link>
          ))}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
