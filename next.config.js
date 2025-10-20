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
}

module.exports = nextConfig

