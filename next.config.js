/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'www.notion.so',
      's3.us-west-2.amazonaws.com',
      'guidea-dev-blog-images.s3.us-east-1.amazonaws.com',
    ],
  },
}

module.exports = nextConfig
