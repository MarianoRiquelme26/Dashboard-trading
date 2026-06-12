/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === 'development'

const nextConfig = {
  // Solo aplicamos export estático en producción (Render)
  ...(isDev ? {} : { output: 'export', distDir: 'out' }),
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: process.cwd(),
  },
}

export default nextConfig
