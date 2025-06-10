/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@chakra-ui/react',
    '@emotion/react',
    '@emotion/styled',
    '@internationalized/date',
  ],
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
};

module.exports = nextConfig;
