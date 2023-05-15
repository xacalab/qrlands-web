/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['antd'],
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
