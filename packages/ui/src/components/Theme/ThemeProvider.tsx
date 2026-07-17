'use client'

import * as React from 'react'
import { ThemeContext } from './theme-context'
import type { Theme, ThemeContextValue, ThemeProviderProps } from './theme.types'

function getSystemPreference(): Theme {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'light'
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getInitialTheme(storageKey: string, defaultTheme?: Theme): Theme {
  if (typeof window === 'undefined') {
    return defaultTheme ?? 'light'
  }
  const stored = window.localStorage.getItem(storageKey)
  if (stored === 'light' || stored === 'dark') {
    return stored
  }
  return defaultTheme ?? getSystemPreference()
}

export function ThemeProvider({
  children,
  storageKey = 'ui-theme',
  defaultTheme,
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(() =>
    getInitialTheme(storageKey, defaultTheme),
  )

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    window.localStorage.setItem(storageKey, theme)
  }, [theme, storageKey])

  const setTheme = React.useCallback((next: Theme) => {
    setThemeState(next)
  }, [])

  const toggleTheme = React.useCallback(() => {
    setThemeState((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [])

  const value = React.useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
