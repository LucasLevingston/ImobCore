import { afterEach, describe, expect, it, vi } from 'vitest'
import { getInitialTheme } from './get-initial-theme'

describe('getInitialTheme', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('should return the default theme when window is undefined (SSR)', () => {
    vi.stubGlobal('window', undefined)
    expect(getInitialTheme('ui-theme', 'dark')).toBe('dark')
  })

  it('should return light when window is undefined and no default theme is given', () => {
    vi.stubGlobal('window', undefined)
    expect(getInitialTheme('ui-theme')).toBe('light')
  })
})
