/** @type {import('next').NextConfig} */
const nextConfig = {
  // 允许所有主机访问（开发环境）
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  // 配置图片上传大小限制
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
  },
};

export default nextConfig;
