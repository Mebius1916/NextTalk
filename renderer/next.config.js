/** @type {import('next').NextConfig} */
module.exports = {
  // output: 'export',
  distDir: process.env.NODE_ENV === 'production' ? '../app' : '.next',
  trailingSlash: true,
  webpack: (config) => {
    return config
  },
}