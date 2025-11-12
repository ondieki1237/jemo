/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Allow Next Image optimization for external images hosted on Cloudinary
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Enable Next's image optimization (will be used in production)
    unoptimized: false,
  },
  // Enable SWC minification for smaller bundles
  swcMinify: true,
}

export default nextConfig
