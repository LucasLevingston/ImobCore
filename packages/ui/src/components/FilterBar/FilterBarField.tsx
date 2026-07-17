import { cn } from '../../lib/utils'
import type { FilterBarFieldProps } from './FilterBar.types'

// role="group" + aria-label associa o rótulo ao(s) controle(s) internos sem
// depender de id/htmlFor casados manualmente — funciona com qualquer campo
// que o app consumidor decidir renderizar (Select, range de preço, etc.).
export function FilterBarField({ label, children, className }: FilterBarFieldProps) {
  return (
    <div role="group" aria-label={label} className={cn('flex flex-col gap-1.5', className)}>
      <span className="text-sm font-medium text-muted-foreground" aria-hidden="true">
        {label}
      </span>
      {children}
    </div>
  )
}
