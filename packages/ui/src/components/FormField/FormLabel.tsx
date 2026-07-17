'use client'

import * as React from 'react'
import { cn } from '../../lib/utils'
import { useFormFieldContext } from './useFormFieldContext'
import { useFormItemContext } from './useFormItemContext'

export const FormLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
  const { id } = useFormItemContext()
  const { error } = useFormFieldContext()
  return (
    <label
      ref={ref}
      htmlFor={`${id}-control`}
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        error && 'text-destructive',
        className,
      )}
      {...props}
    />
  )
})
FormLabel.displayName = 'FormLabel'
