import type { RemoteModuleManifest } from './remote-manifest'

// Resolve uma chave de módulo (ex.: "propertiesFrontend/Dashboard") pro seu
// manifest concreto. Só contrato nesta fase — implementação real fica pra
// quando a integração de Module Federation acontecer de fato.
export interface RemoteResolver {
  resolve(key: string): RemoteModuleManifest | undefined
}
