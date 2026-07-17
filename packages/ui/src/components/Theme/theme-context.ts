import * as React from 'react'
import type { ThemeContextValue } from './theme.types'

// Mecanismo de tema vive aqui (não no app consumidor) — mesmo racional do
// Toast: o design system é dono do CSS (.dark em globals.css, darkMode:['class']
// no preset Tailwind), então o toggle da classe também é responsabilidade dele.
export const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined)
