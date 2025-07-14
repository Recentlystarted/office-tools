/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '',
  assetPrefix: '',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  env: {
    // Removed NEXT_PUBLIC_API_BASE for security - now using proxy routes
    NEXT_PUBLIC_MAX_FILE_SIZE: process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '52428800', // 50MB
    NEXT_PUBLIC_API_TIMEOUT: process.env.NEXT_PUBLIC_API_TIMEOUT || '600000' // 10 minutes
  },
  experimental: {
    optimizePackageImports: ['lucide-react']
  }
}

module.exports = nextConfig
