import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/Login",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
