// Módulos remotos federados (webpack Module Federation, docs/ARCHITECTURE.md seção
// 06) não são pacotes npm reais — não têm .d.ts próprio pro TypeScript resolver.
// Declaração manual porque a geração automática via @module-federation/dts-plugin
// não funcionou (ver comentário em auth-frontend/next.config.js).
declare module 'authFrontend/Header' {
  import type { ComponentType } from 'react'
  const Header: ComponentType
  export default Header
}
