import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  output: "standalone",  // ⭐ REQUIRED for Render Next.js

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "finance-app-i0ff.onrender.com",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
