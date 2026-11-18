import type { NextConfig } from "next";

// PREVIEW_EXPORT=1 builds a fully static copy (used for the shareable preview link).
const isExport = process.env.PREVIEW_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isExport ? { output: "export", trailingSlash: false } : {}),
};

export default nextConfig;
