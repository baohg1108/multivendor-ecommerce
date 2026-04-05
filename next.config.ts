import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // For development, we need to allow the ngrok URL to access the Next.js app
  allowedDevOrigins: ["broadmindedly-nonecclesiastical-carlee.ngrok-free.dev"],
  // images cloudinary
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
