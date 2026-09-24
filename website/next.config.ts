import type { NextConfig } from "next";

// Set BASE_PATH when the site is served from a sub-path, e.g. GitHub Pages
// project sites ("/ReactNativeSchool").
const basePath = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
