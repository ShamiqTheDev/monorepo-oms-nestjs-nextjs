//@ts-check

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: { remotePatterns: [{ protocol: 'https', hostname: 'fkxtcglewmtnujkrgpcc.supabase.co', port: '', pathname: '**' }] },

  compiler: {
    // For other options, see https://nextjs.org/docs/architecture/nextjs-compiler#emotion
  },

  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  transpilePackages: ['@atdb/client-providers'],
  swcMinify: true,
};

module.exports = nextConfig;
