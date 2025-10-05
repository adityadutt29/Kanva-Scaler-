/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: '.next', // Default build directory
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Allow absolute imports from src directory
      config.resolve.modules.push(__dirname);
    }
    return config;
  },
};

module.exports = nextConfig;