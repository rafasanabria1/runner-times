/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/races',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
