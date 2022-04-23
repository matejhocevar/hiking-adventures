/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  domains: ["*.googleusercontent.com"],
  env: {
    MAPBOX_API_key: process.env.MAPBOX_API_key,
  },
};

module.exports = nextConfig;
