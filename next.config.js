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
  },
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production'
  },
  webpack: (config) => {
    // Fix for PDF.js worker
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };
    
    // Handle PDF.js worker files
    config.module.rules.push({
      test: /\.worker\.(js|ts)$/,
      use: { loader: 'worker-loader' },
    });

    // Reduce bundle size and warnings in production
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimize = true;
    }

    return config;
  },
}

module.exports = nextConfig
