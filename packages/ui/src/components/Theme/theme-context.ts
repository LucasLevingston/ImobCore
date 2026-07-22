'use client'

import * as React from 'react'
import type { ThemeContextValue } from './theme.types'

// Mecanismo de tema vive aqui (não no app consumidor) — mesmo racional do
// Toast: o design system é dono do CSS (.dark em globals.css, darkMode:['class']
// no preset Tailwind), então o toggle da classe também é responsabilidade dele.
// 'use client': React.createContext em módulo sem essa diretiva é executado
// no bundle de SERVER quando importado (mesmo transitivamente) por um Server
// Component — createContext não existe nesse runtime, quebra o build inteiro
// (TypeError: f.createContext is not a function) assim que qualquer página
// sem 'use client' importar qualquer coisa do barrel de @microfrontends/ui.
export const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined)
