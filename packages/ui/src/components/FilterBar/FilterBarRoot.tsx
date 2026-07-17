import * as React from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../Button'
import type { FilterBarProps } from './FilterBar.types'

// SRP: só organiza layout/estado de "existe filtro ativo ou não" — não sabe
// o que é um filtro de imóvel. Campos específicos de domínio (cidade, tipo,
// faixa de preço) vivem no app consumidor, compostos via FilterBar.Field.
export function FilterBarRoot({ children, activeCount = 0, onClear, className }: FilterBarProps) {
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
