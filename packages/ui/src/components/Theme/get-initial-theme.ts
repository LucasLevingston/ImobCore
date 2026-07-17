import { getSystemPreference } from './get-system-preference'
import type { Theme } from './theme.types'

export function getInitialTheme(storageKey: string, defaultTheme?: Theme): Theme {
  if (typeof window === 'undefined') {
    return defaultTheme ?? 'light'
  }
  const stored = window.localStorage.getItem(storageKey)
  if (stored === 'light' || stored === 'dark') {
    return stored
  }
  return defaultTheme ?? getSystemPreference()
}
