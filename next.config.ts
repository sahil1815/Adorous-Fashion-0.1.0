import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add this images block to your existing config
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ],
  },
  // ... any other config options you might already have in there
};

export default nextConfig;