import type { RemoteManifest } from './remote-manifest'

// Bookkeeping puro de manifests — zero acoplamento com o mecanismo real de
// Module Federation, por isso é o único dos 5 contratos com implementação
// concreta nesta fase (docs/ARCHITECTURE.md seção 05a).
export interface RemoteRegistry {
  register(manifest: RemoteManifest): void
  get(key: string): RemoteManifest | undefined
  list(): RemoteManifest[]
}

export class InMemoryRemoteRegistry implements RemoteRegistry {
  private readonly manifests = new Map<string, RemoteManifest>()

  constructor(initial: RemoteManifest[] = []) {
    for (const manifest of initial) {
      this.register(manifest)
    }
  }

  register(manifest: RemoteManifest): void {
    this.manifests.set(manifest.key, manifest)
  }

  get(key: string): RemoteManifest | undefined {
    return this.manifests.get(key)
  }

  list(): RemoteManifest[] {
    return Array.from(this.manifests.values())
  }
}
