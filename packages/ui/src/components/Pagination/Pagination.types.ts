// DIP: componente controlado — não guarda nem persiste o número da página
// (URL search param vs. useState é decisão do app consumidor).
export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  siblingCount?: number
  className?: string
}
