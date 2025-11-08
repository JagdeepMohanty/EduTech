/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@mui/material', '@mui/icons-material'],
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
}

module.exports = nextConfig