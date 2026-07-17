import type { FieldError } from 'react-hook-form'

export interface FormFieldContextValue {
  name: string
  error: FieldError | undefined
}

export interface FormItemContextValue {
  id: string
}
