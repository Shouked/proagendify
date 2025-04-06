/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'proagendify.onrender.com'], // Adicione o domínio do Render
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`, // Usa a variável de ambiente
      },
    ];
  },
};

module.exports = nextConfig;
