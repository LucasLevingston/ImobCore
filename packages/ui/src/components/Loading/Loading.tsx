import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-8 w-8',
} as const

export interface LoadingProps {
  label?: string
  size?: keyof typeof sizeClasses
  className?: string
}

export function Loading({ label = 'Carregando...', size = 'md', className }: LoadingProps) {
  return (
    <div role="status" className={cn('flex items-center gap-2 text-muted-foreground', className)}>
      <Loader2 className={cn('animate-spin', sizeClasses[size])} aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
