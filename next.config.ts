import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",        // ⭐ IMPORTANT: enable static export
  reactStrictMode: true,

  images: {
    unoptimized: true,     // ⭐ Required for static hosting (otherwise build breaks)
  },
};

export default nextConfig;
