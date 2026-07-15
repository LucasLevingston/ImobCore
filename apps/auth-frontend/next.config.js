const { ModuleFederationPlugin } = require('@module-federation/enhanced/webpack')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  transpilePackages: ['@microfrontends/ui'],
  // Module Federation (docs/ARCHITECTURE.md seção 06): @module-federation/nextjs-mf
  // recusa categoricamente App Router, então usamos o ModuleFederationPlugin cru
  // (@module-federation/enhanced/webpack) direto aqui — sem a integração
  // Next-aware do wrapper (sem rewrite automático de rota, sem SSR do remote).
  // Só entra no build client: os componentes expostos são sempre "use client",
  // consumidos pelo host via dynamic(..., { ssr: false }).
  webpack(config, { isServer }) {
    if (!isServer) {
      config.plugins.push(
        new ModuleFederationPlugin({
          name: 'authFrontend',
          filename: 'static/chunks/remoteEntry.js',
          exposes: {
            './Header': './src/components/federation/Header',
            './AuthStatus': './src/components/federation/AuthStatus',
            './UserMenu': './src/components/federation/UserMenu',
          },
          shared: {
            react: { singleton: true },
            'react-dom': { singleton: true },
          },
          // Geração automática de .d.ts pro host requer rodar tsc num tsconfig
          // sintético à parte — não funcionou aqui (module-federation.io/guide/
          // troubleshooting/type#type-001) e não é essencial: o host declara os
          // tipos dos módulos remotos manualmente (src/types/federation.d.ts)
          dts: false,
        }),
      )
    }
    return config
  },
}

module.exports = nextConfig
