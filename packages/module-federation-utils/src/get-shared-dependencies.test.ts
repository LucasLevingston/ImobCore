import { describe, expect, it } from 'vitest'
import { getSharedDependencies } from './get-shared-dependencies'

describe('getSharedDependencies', () => {
  const dependencies = {
    react: '^19.2.7',
    'react-dom': '^19.2.7',
    next: '^16.0.0',
  }

  it('should read the requiredVersion straight from the declared dependency range', () => {
    const result = getSharedDependencies(dependencies, { react: {} })
    expect(result.react?.requiredVersion).toBe('^19.2.7')
  })

  it('should mark only libs explicitly configured as singleton', () => {
    const result = getSharedDependencies(dependencies, {
      react: { singleton: true },
      next: {},
    })
    expect(result.react?.singleton).toBe(true)
    expect(result.next?.singleton).toBe(false)
  })

  it('should mark only libs explicitly configured as eager', () => {
    const result = getSharedDependencies(dependencies, {
      react: { eager: true },
      next: {},
    })
    expect(result.react?.eager).toBe(true)
    expect(result.next?.eager).toBe(false)
  })

  it('should only include libs explicitly listed in config, never the full dependencies map', () => {
    const result = getSharedDependencies(dependencies, { react: {} })
    expect(Object.keys(result)).toEqual(['react'])
    expect(result.next).toBeUndefined()
  })

  it('should let requiredVersion be overridden when the declared range is not the right one to share', () => {
    const result = getSharedDependencies(dependencies, {
      react: { requiredVersion: '^19.0.0' },
    })
    expect(result.react?.requiredVersion).toBe('^19.0.0')
  })

  it('should throw when a configured lib is not in dependencies and has no explicit requiredVersion', () => {
    expect(() => getSharedDependencies(dependencies, { zustand: {} })).toThrow(
      'getSharedDependencies: "zustand" não está em dependencies e nenhum requiredVersion foi informado explicitamente.',
    )
  })

  it('should return an empty object when config is empty', () => {
    expect(getSharedDependencies(dependencies, {})).toEqual({})
  })
})
