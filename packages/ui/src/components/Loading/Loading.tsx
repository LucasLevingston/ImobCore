import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'
import { sizeClasses } from './Loading.constants'
import type { LoadingProps } from './Loading.types'

export function Loading({ label = 'Carregando...', size = 'md', className }: LoadingProps) {
  return (
    <div role="status" className={cn('flex items-center gap-2 text-muted-foreground', className)}>
      <Loader2 className={cn('animate-spin', sizeClasses[size])} aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
