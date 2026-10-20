import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { GridLines } from "@/components/layout/GridLines";
import { Header } from "@/components/layout/Header";
import { ThemeScript } from "@/components/layout/ThemeScript";
import { site } from "@/content/site";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

// `template` applies to child segments: /work/fos titled "FOS" becomes "FOS — Abinash Adhikari".
export const metadata: Metadata = {
  // Turns relative URLs (like the generated /opengraph-image) into absolute ones for social cards.
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  authors: [{ name: site.name }],
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    title: `${site.name} — ${site.role}`,
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
};

// The layout wraps every route and stays mounted across navigations,
// so the header, grid lines and footer live here instead of in each page.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: ThemeScript adds `js` / data-theme before React hydrates.
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <div id="top" className="relative">
          {/* First focusable element: lets keyboard users jump past the header. */}
          <a
            href="#content"
            className="label sr-only z-50 bg-background px-3 py-2 text-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
          >
            Skip to content
          </a>
          <GridLines />
          <Header />
          <div id="content" className="relative z-10">
            {children}
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
