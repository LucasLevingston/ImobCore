import { describe, expect, it } from 'vitest'
import { MODULES } from './modules'

describe('MODULES', () => {
  it('should contain exactly 8 modules', () => {
    expect(MODULES).toHaveLength(8)
  })

  it('should have unique keys', () => {
    const keys = MODULES.map((module) => module.key)
    expect(new Set(keys).size).toBe(keys.length)
  })

  it('should point Dashboard at the Portal home as an internal route', () => {
    const dashboard = MODULES.find((module) => module.key === 'dashboard')
    expect(dashboard).toMatchObject({ href: '/', kind: 'internal' })
  })

  it('should point Imóveis at the properties-frontend as an external link', () => {
    const properties = MODULES.find((module) => module.key === 'properties')
    expect(properties).toMatchObject({
      href: 'http://localhost:3003',
      kind: 'external',
    })
  })

  it('should mark the not-yet-built modules as placeholder, internal routes', () => {
    const placeholderKeys = ['clients', 'visits', 'ai', 'analytics', 'admin', 'settings']
    for (const key of placeholderKeys) {
      const module = MODULES.find((m) => m.key === key)
      expect(module?.kind).toBe('placeholder')
      expect(module?.href.startsWith('/')).toBe(true)
    }
  })
})
