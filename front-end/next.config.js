/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  output: 'standalone',
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
