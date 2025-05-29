// inserting images and the domains is necessary for rendering images hosted on specific domains
// as in index.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's.gravatar.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
