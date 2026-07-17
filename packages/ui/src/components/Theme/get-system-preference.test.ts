import { afterEach, describe, expect, it, vi } from 'vitest'
import { getSystemPreference } from './get-system-preference'

describe('getSystemPreference', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('should return light when window is undefined (SSR)', () => {
    vi.stubGlobal('window', undefined)
    expect(getSystemPreference()).toBe('light')
  })
})
