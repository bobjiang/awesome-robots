import { build } from 'velite'

class VeliteWebpackPlugin {
  static started = false
  constructor(options = {}) {
    this.options = options
  }
  apply(compiler) {
    // executed three times in nextjs !!!
    // twice for the server (nodejs / edge-runtime) and once for the client
    compiler.hooks.beforeCompile.tapPromise('VeliteWebpackPlugin', async () => {
      if (VeliteWebpackPlugin.started) return
      VeliteWebpackPlugin.started = true
      const dev = compiler.options.mode === 'development'
      await build({ watch: dev, clean: !dev })
    })
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.plugins.push(new VeliteWebpackPlugin())
    return config
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.unitree.com',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'unitree.com',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'www.deeprobotics.cn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'deeprobotics.cn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.unix-group.ai',
        port: '',
        pathname: '/public/**',
      },
      {
        protocol: 'https',
        hostname: 'www.rainbow-robotics.com',
        port: '',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'spectrum.ieee.org',
        port: '',
        pathname: '/media-library/**',
      },
      {
        protocol: 'https',
        hostname: 'rainbowrobotics.github.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.engineai.com.cn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'file.engineai.com.cn',
        port: '2390',
        pathname: '/files/**',
      },
      {
        protocol: 'https',
        hostname: 'galaxea-ai.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.boosterobotics.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  poweredByHeader: false,
  compress: true,
}

export default nextConfig