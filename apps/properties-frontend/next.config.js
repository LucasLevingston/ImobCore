const path = require('node:path')
const { ModuleFederationPlugin } = require('@module-federation/enhanced/webpack')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  transpilePackages: ['@microfrontends/ui'],
  // Module Federation (docs/ARCHITECTURE.md seção 06): host consumindo authFrontend
  // como remote via ModuleFederationPlugin cru (mesmo racional do next.config.js
  // de auth-frontend — nextjs-mf não suporta App Router). A URL do remote é baked
  // em build-time (convenção NEXT_PUBLIC_* já usada em todo o monorepo).
  webpack(config, { isServer }) {
    if (!isServer) {
      config.plugins.push(
        new ModuleFederationPlugin({
          name: 'propertiesFrontend',
          remotes: {
            authFrontend: `authFrontend@${process.env.NEXT_PUBLIC_AUTH_FRONTEND_URL}/_next/static/chunks/remoteEntry.js`,
          },
          // eager: true + requiredVersion fixo — mesmo motivo do next.config.js
          // de auth-frontend (RUNTIME-006 + auto-scanner da MF pegando o
          // peerDependency canary interno do Next em vez da versão real instalada)
          shared: {
            react: { singleton: true, eager: true, requiredVersion: '^19.2.7' },
            'react-dom': { singleton: true, eager: true, requiredVersion: '^19.2.7' },
          },
          dts: false,
        }),
      )
    } else {
      // App Router ainda precisa resolver "authFrontend/Header" na compilação
      // SERVER pra gerar o client reference manifest (mesmo com dynamic ssr:false)
      // — sem o plugin nessa passada, o import federado cru quebra o SSR.
      // Aponta pra um stub aqui; o componente real só carrega no browser.
      config.resolve.alias['authFrontend/Header'] = path.resolve(
        __dirname,
        'src/components/federation/remote-header-server-stub.tsx',
      )
    }
    return config
  },
}

module.exports = nextConfig
