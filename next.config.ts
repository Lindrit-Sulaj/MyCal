import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      allowedOrigins: ['mycal.lindritsulaj.com', '*.lindritsulaj.com']
    }
  }
};

export default nextConfig;
