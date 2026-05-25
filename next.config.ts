import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizeCss: true,
  },
  generateBuildId: async () => {
    return Date.now().toString();
  },
};

export default nextConfig;