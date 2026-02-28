import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Native bindings (resvg) don't bundle well with Turbopack; keep them external.
  serverExternalPackages: ["@resvg/resvg-js"],
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
