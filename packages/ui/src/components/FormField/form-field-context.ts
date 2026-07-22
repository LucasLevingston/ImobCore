'use client'

import * as React from 'react'
import type { FormFieldContextValue } from './form-context.types'

// 'use client': createContext em módulo server-side quebra o build assim
// que qualquer Server Component importar algo do barrel de @microfrontends/ui
// (docs/ARCHITECTURE.md — mesmo caso do Theme).
export const FormFieldContext = React.createContext<FormFieldContextValue | null>(null)
