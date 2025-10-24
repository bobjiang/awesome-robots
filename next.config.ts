import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclude formbold-react from server components to avoid SSR issues
  serverComponentsExternalPackages: ['formbold-react'],

  // Webpack configuration to mark formbold-react as external for server builds
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push('formbold-react');
      }
    }
    return config;
  },
};

export default nextConfig;
