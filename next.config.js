/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Configuração para redirecionar chamadas da API para o servidor Express
  async rewrites() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const apiUrl = isDevelopment 
      ? 'http://localhost:3000/api/:path*'
      : `${process.env.API_BASE_URL || 'https://your-backend-url.vercel.app'}/api/:path*`;
    
    return [
      {
        source: '/api/:path*',
        destination: apiUrl,
      },
    ];
  },

  // Configuração para desenvolvimento
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 