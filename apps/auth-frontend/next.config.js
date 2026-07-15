/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  transpilePackages: ['@microfrontends/ui'],
  // Module Federation (docs/ARCHITECTURE.md seção 06) foi ADIADO pra Fase 6:
  // @module-federation/nextjs-mf recusa categoricamente projetos com App
  // Router (checagem hardcoded na lib — "App Directory is not supported by
  // nextjs-mf", sem flag de bypass). Os componentes já existem e são
  // testados em src/components/federation/ — só a exposição via webpack
  // fica pendente até decidirmos o mecanismo real (ModuleFederationPlugin
  // cru via @module-federation/enhanced, ou outra estratégia) com um
  // consumer de verdade (properties-frontend) pra testar contra.
}

module.exports = nextConfig
