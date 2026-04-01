/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  staticPageGenerationTimeout: 120,
  // Отключаем статическую оптимизацию для всех страниц
  experimental: {
    clientRouterFilter: true,
  },
}

module.exports = nextConfig