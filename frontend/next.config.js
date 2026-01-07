/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 1. Docker Optimization: Reduces image size drastically
  output: 'standalone',

  // 2. Image Domain Whitelist (Optional but good practice)
  // Allows standard <img> tags to work, but required if you use <Image />
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow external images from the scraper
      },
    ],
  },

  // 3. Proxy Rewrites
  async rewrites() {
    // In Docker, this environment variable will point to 'http://backend:3000'
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';

    return [
      {
        // Capture any request to /api/... from the frontend
        source: '/api/:path*',
        // Proxy it to the NestJS backend (ensuring /api prefix is preserved)
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
}

module.exports = nextConfig;