/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure proper handling of client-side navigation
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  // Add proper redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
}

export default nextConfig;
