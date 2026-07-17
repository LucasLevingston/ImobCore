import * as React from 'react'
import { ThemeContext } from './theme-context'
import type { ThemeContextValue } from './theme.types'

export function useTheme(): ThemeContextValue {
  const context = React.useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider')
  }
  return context
}
