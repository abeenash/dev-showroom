import type { Metadata } from "next";
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
