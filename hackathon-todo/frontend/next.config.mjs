/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://ahmed421092-hack-2-phrase-3.hf.space",
      },
    ];
  },
};

export default nextConfig;