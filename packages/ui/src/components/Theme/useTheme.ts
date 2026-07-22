'use client'

import * as React from 'react'
import type { ThemeContextValue } from './theme.types'
import { ThemeContext } from './theme-context'

export function useTheme(): ThemeContextValue {
  const context = React.useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider')
  }
  return context
}
