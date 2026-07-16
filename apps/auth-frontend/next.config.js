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
          // eager: true — sem isso, o runtime da MF exige um "async boundary"
          // (bootstrap via import() dinâmico) antes de qualquer código tocar
          // react/react-dom; o App Router do Next não expõe esse boundary no
          // entry chunk, então loadShareSync corre na frente da negociação
          // assíncrona e quebra a hidratação inteira com RUNTIME-006
          // (module-federation.io/guide/troubleshooting/runtime#runtime-006)
          // requiredVersion fixo — o auto-scanner da MF lê o peerDependency
          // interno do Next (uma build canary/RC do React usada internamente
          // por features de RSC), não a versão de react-dom de fato resolvida
          // — sem isso, ele recusa a própria versão que ele mesmo fornece.
          // Fase 9: projeto migrou pra React 19 de verdade, mas o Next ainda
          // vendora sua própria cópia interna independente disso — o pin
          // continua necessário (não é algo que "React 19 real" resolveu).
          shared: {
            react: { singleton: true, eager: true, requiredVersion: '^19.2.7' },
            'react-dom': { singleton: true, eager: true, requiredVersion: '^19.2.7' },
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
