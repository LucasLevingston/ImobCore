'use client'

import * as React from 'react'
import type { FormItemContextValue } from './form-context.types'
import { FormItemContext } from './form-item-context'

export function useFormItemContext(): FormItemContextValue {
  const context = React.useContext(FormItemContext)
  if (!context) {
    throw new Error('FormLabel/FormControl/FormMessage precisam estar dentro de um <FormItem>')
  }
  return context
}
