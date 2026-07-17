import type * as React from 'react'

export type Theme = 'light' | 'dark'

export interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export interface ThemeProviderProps {
  children: React.ReactNode
  storageKey?: string
  defaultTheme?: Theme
}
