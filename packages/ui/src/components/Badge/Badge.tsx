import * as React from 'react'
import { cn } from '../../lib/utils'
import type { BadgeProps } from './Badge.types'
import { badgeVariants } from './Badge.variants'

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
  ),
)
Badge.displayName = 'Badge'
