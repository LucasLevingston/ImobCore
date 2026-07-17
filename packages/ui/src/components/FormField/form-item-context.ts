import * as React from 'react'
import type { FormItemContextValue } from './form-context.types'

export const FormItemContext = React.createContext<FormItemContextValue | null>(null)
