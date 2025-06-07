import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: true,
      },
    ];
  },
  allowedDevOrigins: [
    'http://192.168.4.10:4000',
    'http://localhost:4000',
    '192.168.4.10'
  ],
};

export default nextConfig;
