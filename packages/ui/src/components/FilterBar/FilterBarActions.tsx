import { cn } from '../../lib/utils'
import type { FilterBarActionsProps } from './FilterBar.types'

export function FilterBarActions({ children, className }: FilterBarActionsProps) {
  return <div className={cn('flex items-center gap-2', className)}>{children}</div>
}
