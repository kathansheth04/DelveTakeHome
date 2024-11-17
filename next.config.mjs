// Option 2: next.config.mjs (ES Modules - keep "type": "module" in package.json)
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  }
}

export default nextConfig