import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      syncWebAssembly: true,
    };
    
    // Alias isomorphic-ws to our stub to fix the 'WebSocket' export error
    config.resolve.alias = {
      ...config.resolve.alias,
      "isomorphic-ws": path.resolve(process.cwd(), "./src/lib/ws-stub.js"),
    };

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    return config;
  },
};

export default nextConfig;
