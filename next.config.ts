import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Allow LAN device hitting the dev server (Next 16+ top-level option).
  allowedDevOrigins: ["192.168.1.171:3000"],
};

export default nextConfig;
