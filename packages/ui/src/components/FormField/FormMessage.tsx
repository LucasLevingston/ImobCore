'use client'

import * as React from 'react'
import { cn } from '../../lib/utils'
import { useFormFieldContext } from './useFormFieldContext'
import { useFormItemContext } from './useFormItemContext'

export const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { id } = useFormItemContext()
  const { error } = useFormFieldContext()
  const content = error?.message ?? children

  if (!content) {
    return null
  }

  return (
    <p
      ref={ref}
      id={`${id}-message`}
      className={cn('text-sm font-medium text-destructive', className)}
      {...props}
    >
      {content}
    </p>
  )
})
FormMessage.displayName = 'FormMessage'
