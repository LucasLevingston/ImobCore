import * as React from 'react'
import { FormFieldContext } from './form-field-context'
import type { FormFieldContextValue } from './form-context.types'

export function useFormFieldContext(): FormFieldContextValue {
  const context = React.useContext(FormFieldContext)
  if (!context) {
    throw new Error('FormLabel/FormControl/FormMessage precisam estar dentro de um <FormField>')
  }
  return context
}
