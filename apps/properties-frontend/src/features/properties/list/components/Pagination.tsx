import { Button } from '@microfrontends/ui'
import type { PaginationProps } from './Pagination.types'

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  return (
    <nav aria-label="Paginação" className="flex items-center justify-center gap-4">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Anterior
      </Button>
      <span className="text-sm text-muted-foreground">
        Página {page} de {totalPages}
      </span>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Próxima
      </Button>
    </nav>
  )
}
