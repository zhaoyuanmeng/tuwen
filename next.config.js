/** @type {import('next').NextConfig} */
const nextConfig = {
  // 在这里添加您的 Next.js 配置
  reactStrictMode: true,
  swcMinify: true,
  
  // 示例配置，您可以根据需要修改或删除
  images: {
    domains: ['images.unsplash.com'],
  },
  
  // 其他可能需要的配置...
  // experimental: {
  //   appDir: true,
  // },
}

module.exports = nextConfig