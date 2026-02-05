import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://ahmed421092-hack-2-phrase-3.hf.space/api/:path*",
      },
    ];
  },
};

export default nextConfig;