/** @type {import('next').NextConfig} */
// Sem ModuleFederationPlugin nesta fase (docs/ARCHITECTURE.md seção 05a) — o
// Portal ainda navega pros MFEs existentes via link externo simples; os
// contratos em src/types/federation/ preparam a troca futura, mas a
// integração real fica pra uma fase seguinte.
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  transpilePackages: ['@microfrontends/ui'],
}

module.exports = nextConfig
