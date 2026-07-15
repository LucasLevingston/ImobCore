// Contratos de Module Federation (docs/ARCHITECTURE.md seção 05a) — só
// abstrações nesta fase, nenhuma integração real ainda. Quando a integração
// acontecer, só a camada de infra (implementações de ModuleLoader/RemoteLoader)
// muda — nada que dependa só destas interfaces precisa ser tocado.

// Um módulo exposto por um remote (ex.: "./Header" do authFrontend). Espelha
// o vocabulário usado em apps/*/next.config.js (name/exposes/remoteEntry.js).
export interface RemoteModuleManifest {
  readonly scope: string
  readonly module: string
  readonly url: string
}

// Um MFE conhecido pelo Portal, com os módulos que ele expõe.
export interface RemoteManifest {
  readonly key: string
  readonly label: string
  readonly modules: RemoteModuleManifest[]
}
