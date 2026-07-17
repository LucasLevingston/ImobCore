import * as React from 'react'
import { FormItemContext } from './form-item-context'
import type { FormItemContextValue } from './form-context.types'

export function useFormItemContext(): FormItemContextValue {
  const context = React.useContext(FormItemContext)
  if (!context) {
    throw new Error('FormLabel/FormControl/FormMessage precisam estar dentro de um <FormItem>')
  }
  return context
}
