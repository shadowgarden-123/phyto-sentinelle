import { imageHosts } from './image-hosts.config.mjs';

const ignoreBuildErrors = process.env.IGNORE_BUILD_ERRORS === 'true';
const ignoreEslintDuringBuilds = process.env.IGNORE_ESLINT_DURING_BUILDS === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for GitHub Pages
  output: 'export',
  // Disable image optimization (required for static export on GH Pages)
  images: {
    unoptimized: true,
    remotePatterns: imageHosts,
    minimumCacheTTL: 60,
  },
  // Ensure trailing slashes for correct static routing
  trailingSlash: true,
  // Base path for GitHub Pages
  basePath: '/phyto-sentinelle',
  
  productionBrowserSourceMaps: true,
  distDir: process.env.DIST_DIR || '.next',

  typescript: {
    ignoreBuildErrors,
  },

  eslint: {
    ignoreDuringBuilds: ignoreEslintDuringBuilds,
  },
};
export default nextConfig;
