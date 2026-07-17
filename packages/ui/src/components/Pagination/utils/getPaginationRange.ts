import { ELLIPSIS } from './pagination.constants'
import type { PaginationItem } from './pagination.types'

function range(start: number, end: number): number[] {
  const length = end - start + 1
  return length > 0 ? Array.from({ length }, (_, index) => start + index) : []
}

// Função pura, extraída do componente visual — calcula quais números de
// página (e onde entram elipses) mostrar, sem depender de renderização.
export function getPaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount = 1,
): PaginationItem[] {
  const totalPageNumbers = siblingCount * 2 + 5

  if (totalPages <= totalPageNumbers) {
    return range(1, totalPages)
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

  const shouldShowLeftEllipsis = leftSiblingIndex > 2
  const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1

  if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
    const leftItemCount = 3 + siblingCount * 2
    return [...range(1, leftItemCount), ELLIPSIS, totalPages]
  }

  if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
    const rightItemCount = 3 + siblingCount * 2
    return [1, ELLIPSIS, ...range(totalPages - rightItemCount + 1, totalPages)]
  }

  return [1, ELLIPSIS, ...range(leftSiblingIndex, rightSiblingIndex), ELLIPSIS, totalPages]
}
