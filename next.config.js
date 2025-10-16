/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['mysql2']
  },
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com']
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // For Hostinger deployment
  output: 'standalone',
  trailingSlash: true,
  // Enable static optimization
  generateStaticParams: true,
}

module.exports = nextConfig
