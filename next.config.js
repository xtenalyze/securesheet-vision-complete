/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Enable static export for deployment flexibility
  output: process.env.EXPORT_MODE === 'true' ? 'export' : undefined,
  trailingSlash: process.env.EXPORT_MODE === 'true',
  
  // Image optimization settings
  images: {
    unoptimized: process.env.EXPORT_MODE === 'true',
    domains: [
      'localhost',
      'via.placeholder.com',
      'placehold.co',
    ],
    formats: ['image/webp', 'image/avif'],
  },

  // Environment variables available to client
  env: {
    NEXT_PUBLIC_APP_NAME: 'SecureVision Professional',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
    NEXT_PUBLIC_DEMO_MODE: process.env.NEXT_PUBLIC_DEMO_MODE || 'false',
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
