import * as React from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../Button'

export interface FilterBarProps {
  children: React.ReactNode
  activeCount?: number
  onClear?: () => void
  className?: string
}

// SRP: só organiza layout/estado de "existe filtro ativo ou não" — não sabe
// o que é um filtro de imóvel. Campos específicos de domínio (cidade, tipo,
// faixa de preço) vivem no app consumidor, compostos via FilterBar.Field.
function FilterBarRoot({ children, activeCount = 0, onClear, className }: FilterBarProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className={cn('rounded-lg border p-4', className)}>
      <div className="flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          className="md:hidden"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          {activeCount > 0 ? `Filtros (${activeCount})` : 'Filtros'}
        </Button>

        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onClear} className="ml-auto">
            <X className="h-4 w-4" aria-hidden="true" />
            Limpar filtros
          </Button>
        )}
      </div>

      <div
        className={cn(
          'flex-col gap-4 md:mt-4 md:flex md:flex-row md:flex-wrap md:items-end',
          isOpen ? 'mt-4 flex' : 'hidden md:flex',
        )}
      >
        {children}
      </div>
    </div>
  )
}

export interface FilterBarFieldProps {
  label: string
  children: React.ReactNode
  className?: string
}

// role="group" + aria-label associa o rótulo ao(s) controle(s) internos sem
// depender de id/htmlFor casados manualmente — funciona com qualquer campo
// que o app consumidor decidir renderizar (Select, range de preço, etc.).
function FilterBarField({ label, children, className }: FilterBarFieldProps) {
  return (
    <div role="group" aria-label={label} className={cn('flex flex-col gap-1.5', className)}>
      <span className="text-sm font-medium text-muted-foreground" aria-hidden="true">
        {label}
      </span>
      {children}
    </div>
  )
}

export interface FilterBarActionsProps {
  children: React.ReactNode
  className?: string
}

function FilterBarActions({ children, className }: FilterBarActionsProps) {
  return <div className={cn('flex items-center gap-2', className)}>{children}</div>
}

export const FilterBar = Object.assign(FilterBarRoot, {
  Field: FilterBarField,
  Actions: FilterBarActions,
})
