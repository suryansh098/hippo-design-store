/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "localhost",
        protocol: "http",
      },
      {
        protocol: "https",
        hostname: "hippo-design-store-production.up.railway.app",
      },
    ],
  },
};

export default nextConfig;
