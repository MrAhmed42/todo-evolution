/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        // This proxies your frontend calls to your Hugging Face Backend
        source: "/api/:path*",
        destination: "https://ahmed421092-hack-2-phrase-3.hf.space/api/:path*",
      },
    ];
  },
};

export default nextConfig;