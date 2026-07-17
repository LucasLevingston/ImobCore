import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../Button'
import { ELLIPSIS } from './utils/pagination.constants'
import { getPaginationRange } from './utils/getPaginationRange'
import type { PaginationProps } from './Pagination.types'

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  const items = getPaginationRange(currentPage, totalPages, siblingCount)

  function goTo(page: number) {
    if (page === currentPage) {
      return
    }
    onPageChange(page)
  }

  return (
    <nav aria-label="Paginação" className={cn('flex items-center justify-center gap-1', className)}>
      <Button
        variant="outline"
        size="icon"
        aria-label="Página anterior"
        disabled={currentPage <= 1}
        onClick={() => goTo(currentPage - 1)}
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </Button>

      {items.map((item, index) =>
        item === ELLIPSIS ? (
          // eslint-disable-next-line react/no-array-index-key -- elipse não tem identidade própria; posição é estável dentro do range calculado
          <span key={`ellipsis-${index}`} aria-hidden="true" className="px-2 text-muted-foreground">
            …
          </span>
        ) : (
          <Button
            key={item}
            variant={item === currentPage ? 'default' : 'outline'}
            size="icon"
            aria-current={item === currentPage ? 'page' : undefined}
            onClick={() => goTo(item)}
          >
            {item}
          </Button>
        ),
      )}

      <Button
        variant="outline"
        size="icon"
        aria-label="Próxima página"
        disabled={currentPage >= totalPages}
        onClick={() => goTo(currentPage + 1)}
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </Button>
    </nav>
  )
}
