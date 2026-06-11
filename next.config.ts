import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingExcludes: {
    "/api/upload": ["./public/uploads/**/*"],
  },
};

export default nextConfig;
