import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // https://nextjs.org/docs/app/guides/static-exports
  output: process.env.NEXT_OUTPUT === "export" ? "export" : "standalone",
  images: { unoptimized: process.env.NEXT_OUTPUT === "export" },
  experimental: { cpus: 2, staticGenerationMaxConcurrency: 2 },
};

export default nextConfig;
