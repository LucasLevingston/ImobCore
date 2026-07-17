import * as DialogPrimitive from '@radix-ui/react-dialog'
import * as React from 'react'
import { cn } from '../../lib/utils'

export const ModalDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
ModalDescription.displayName = 'ModalDescription'
