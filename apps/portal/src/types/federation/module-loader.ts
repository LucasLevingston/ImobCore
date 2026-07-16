import type { RemoteModuleManifest } from './remote-manifest'

// Mecânica de carregamento em si (o que hoje é feito "na mão" em
// RemoteHeader.tsx/remote-header-server-stub.tsx do properties-frontend —
// dynamic import + stub de SSR). Só contrato nesta fase.
export interface ModuleLoader {
  load<T = unknown>(manifest: RemoteModuleManifest): Promise<T>
}
