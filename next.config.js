/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img1.styletify.com',
      },
    ],
  },
  // Forzar HTTPS en producción
  async redirects() {
    return [
      {
        source: '/(.*)',
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'http',
          },
        ],
        destination: 'https://empaquesyfundas.com/:path*',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig

