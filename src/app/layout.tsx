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
  title: {
    default: site.name,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  authors: [{ name: site.name }],
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
          <GridLines />
          <Header />
          <div className="relative z-10">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
