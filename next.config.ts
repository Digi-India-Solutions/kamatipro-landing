import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // output: "export",
  images: {
    unoptimized: true,
  },
  typescript: {
    // ignoreBuildErrors: true,
  },
};

export default nextConfig;
