import { imageHosts } from './image-hosts.config.mjs';

const ignoreBuildErrors = true;
const ignoreEslintDuringBuilds = true;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for GitHub Pages
  output: 'export',
  // Disable image optimization
  images: {
    unoptimized: true,
    remotePatterns: imageHosts,
    minimumCacheTTL: 60,
  },
  // Ensure trailing slashes
  trailingSlash: true,
  // Base path for GitHub Pages
  basePath: '/phyto-sentinelle',
  
  productionBrowserSourceMaps: true,
  distDir: '.next',

  typescript: {
    // !! WARN !! Dangerously allow production builds to successfully complete 
    // even if your project has type errors.
    ignoreBuildErrors: true,
  },

  eslint: {
    // !! WARN !! Dangerously allow production builds to successfully complete 
    // even if your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};
export default nextConfig;
