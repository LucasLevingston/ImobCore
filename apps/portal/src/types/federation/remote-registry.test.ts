import { describe, expect, it } from 'vitest'
import { InMemoryRemoteRegistry } from './remote-registry'
import type { RemoteManifest } from './remote-manifest'

const authManifest: RemoteManifest = {
  key: 'authFrontend',
  label: 'Autenticação',
  modules: [
    {
      scope: 'authFrontend',
      module: './Header',
      url: 'http://localhost:3000/_next/static/chunks/remoteEntry.js',
    },
  ],
}

const propertiesManifest: RemoteManifest = {
  key: 'propertiesFrontend',
  label: 'Imóveis',
  modules: [],
}

describe('InMemoryRemoteRegistry', () => {
  it('should start empty', () => {
    const registry = new InMemoryRemoteRegistry()
    expect(registry.list()).toEqual([])
  })

  it('should register and retrieve a manifest by key', () => {
    const registry = new InMemoryRemoteRegistry()
    registry.register(authManifest)

    expect(registry.get('authFrontend')).toEqual(authManifest)
  })

  it('should return undefined for a key that was never registered', () => {
    const registry = new InMemoryRemoteRegistry()
    expect(registry.get('unknown')).toBeUndefined()
  })

  it('should list every registered manifest', () => {
    const registry = new InMemoryRemoteRegistry()
    registry.register(authManifest)
    registry.register(propertiesManifest)

    expect(registry.list()).toEqual([authManifest, propertiesManifest])
  })

  it('should overwrite a manifest registered again under the same key', () => {
    const registry = new InMemoryRemoteRegistry()
    registry.register(authManifest)
    const updated: RemoteManifest = { ...authManifest, label: 'Auth (atualizado)' }
    registry.register(updated)

    expect(registry.get('authFrontend')).toEqual(updated)
    expect(registry.list()).toHaveLength(1)
  })

  it('should accept initial manifests via the constructor', () => {
    const registry = new InMemoryRemoteRegistry([authManifest, propertiesManifest])

    expect(registry.list()).toHaveLength(2)
    expect(registry.get('propertiesFrontend')).toEqual(propertiesManifest)
  })
})
