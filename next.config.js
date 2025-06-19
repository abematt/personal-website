/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverComponentsExternalPackages: ['notion-client']
    }
  }
  
  module.exports = nextConfig