import * as React from 'react'
import type { FormFieldContextValue } from './form-context.types'

export const FormFieldContext = React.createContext<FormFieldContextValue | null>(null)
