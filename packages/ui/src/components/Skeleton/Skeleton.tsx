import * as React from 'react'
import { cn } from '../../lib/utils'
import type { SkeletonProps } from './Skeleton.types'

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-label="Carregando conteúdo"
        className={cn('animate-pulse rounded-md bg-muted', className)}
        {...props}
      />
    )
  },
)
Skeleton.displayName = 'Skeleton'
