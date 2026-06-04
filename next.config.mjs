/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
  // Solo aplicamos export estático en producción (Render)
  ...(isDev ? {} : { output: 'export', distDir: 'out' }),
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  // Proxy de desarrollo para el backend Express
  async rewrites() {
    if (isDev) {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:3000/api/:path*', // Puerto del server.js local
        },
      ];
    }
    return [];
  },
}

export default nextConfig
