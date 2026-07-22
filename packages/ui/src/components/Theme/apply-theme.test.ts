import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { applyTheme } from './apply-theme'

describe('applyTheme', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark')
    window.localStorage.clear()
  })

  afterEach(() => {
    document.documentElement.classList.remove('dark')
    window.localStorage.clear()
  })

  it('should add the dark class and persist "dark" when theme is dark', () => {
    applyTheme('ui-theme', 'dark')

    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(window.localStorage.getItem('ui-theme')).toBe('dark')
  })

  it('should remove the dark class and persist "light" when theme is light', () => {
    document.documentElement.classList.add('dark')

    applyTheme('ui-theme', 'light')

    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(window.localStorage.getItem('ui-theme')).toBe('light')
  })
})
