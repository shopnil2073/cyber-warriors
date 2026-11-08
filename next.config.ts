import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export", <-- Dynamic Supabase database routing-er jonno eta soriye deya hoyeche
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    typedRoutes: false,
  },
};

export default nextConfig;