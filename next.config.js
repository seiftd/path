/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['mysql2'],
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com']
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // For Vercel deployment
  output: 'standalone',
  trailingSlash: true,
}

module.exports = nextConfig
