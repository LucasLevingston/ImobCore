/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  transpilePackages: ['@microfrontends/ui'],
  // Module Federation (docs/ARCHITECTURE.md seção 06) foi ADIADO pra Fase 6:
  // @module-federation/nextjs-mf recusa categoricamente projetos com App
  // Router. Até lá, este app (host) não consome Header/AuthStatus/UserMenu
  // de auth-frontend — não tem UI de sessão própria (só redirect se
  // deslogado, via middleware.ts).
}

module.exports = nextConfig
