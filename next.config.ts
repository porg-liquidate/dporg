import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export', // For static exports
  // OR for SSR:
  // trailingSlash: true,
};

export default nextConfig;
