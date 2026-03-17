import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 允许所有主机访问（开发环境）
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
