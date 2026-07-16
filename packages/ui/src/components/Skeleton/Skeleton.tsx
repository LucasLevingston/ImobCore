import * as React from 'react'
import { cn } from '../../lib/utils'

// SRP: só é a forma pulsante — não sabe nada sobre o layout de nenhuma
// entidade de domínio. Composições específicas (skeleton de card de imóvel,
// por exemplo) ficam no app consumidor, empilhando vários Skeleton via className.
export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>

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
