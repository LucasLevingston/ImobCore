// Facade que futuramente combina RemoteResolver + ModuleLoader (+ RemoteRegistry
// pra descobrir o manifest) — o único ponto que um componente de UI chamaria
// pra renderizar um remote por chave. Só contrato nesta fase.
export interface RemoteLoader {
  loadByKey<T = unknown>(key: string): Promise<T>
}
