/** @type {import("next").NextConfig} */

const isDev = process.env.NODE_ENV === "development"

const nextConfig = {
  // Solo aplicamos export estatico en produccion (Render).
  ...(isDev ? {} : { output: "export", distDir: "out" }),
  allowedDevOrigins: ["*.trycloudflare.com"],
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: process.cwd(),
  },
}

export default nextConfig
