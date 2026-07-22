'use client'

import * as React from 'react'
import { applyTheme } from './apply-theme'
import { getInitialTheme } from './get-initial-theme'
import type { Theme, ThemeContextValue, ThemeProviderProps } from './theme.types'
import { ThemeContext } from './theme-context'

export function ThemeProvider({
  children,
  storageKey = 'ui-theme',
  defaultTheme,
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(() =>
    getInitialTheme(storageKey, defaultTheme),
  )

  React.useEffect(() => {
    applyTheme(storageKey, theme)
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
