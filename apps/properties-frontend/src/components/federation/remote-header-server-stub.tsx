// Stub usado só na compilação SERVER (next.config.js webpack alias). O App
// Router precisa resolver "authFrontend/Header" durante o build do server pra
// gerar o client reference manifest, mesmo com dynamic(..., { ssr: false }) —
// sem o ModuleFederationPlugin nessa passada, o import externo cru quebra o
// SSR. O componente real só é carregado no browser (client build, federado de verdade).
export default function RemoteHeaderServerStub() {
  return null
}
