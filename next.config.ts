import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The CV opens in the browser's PDF viewer (inline), and "Save" suggests this filename.
  // (A `download` attribute on the link would skip the viewer and download straight away.)
  async headers() {
    return [
      {
        source: "/Abinash_Adhikari_CV.pdf",
        headers: [{ key: "Content-Disposition", value: 'inline; filename="Abinash_Adhikari_CV.pdf"' }],
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
