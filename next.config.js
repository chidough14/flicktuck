/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.pexels.com', 'www.google.com', 'lh3.googleusercontent.com']
  }
}

module.exports = nextConfig
