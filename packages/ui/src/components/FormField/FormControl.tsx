'use client'

import { Slot } from '@radix-ui/react-slot'
import * as React from 'react'
import { useFormFieldContext } from './useFormFieldContext'
import { useFormItemContext } from './useFormItemContext'

// Slot repassa id/aria-* pro input real renderizado como único filho (Input, Select, etc.)
// — FormControl nunca sabe qual elemento de fato recebe esses atributos (OCP via composição).
export const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>((props, ref) => {
  const { id } = useFormItemContext()
  const { error } = useFormFieldContext()
  const describedBy = error ? `${id}-message` : undefined

  return (
    <Slot
      ref={ref}
      id={`${id}-control`}
      aria-invalid={!!error}
      aria-describedby={describedBy}
      {...props}
    />
  )
})
FormControl.displayName = 'FormControl'
