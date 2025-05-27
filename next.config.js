// inserting images and the domains is necessary for rendering images hosted on specific domains
// as in index.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['s.gravatar.com'],
  },
}

module.exports = nextConfig
