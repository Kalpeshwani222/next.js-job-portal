import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // reactCompiler: true,
  images: {
    remotePatterns: [
      {
        hostname: "20cfuklc5h.ufs.sh",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
