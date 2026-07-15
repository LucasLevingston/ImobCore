import type { ListPropertiesQuery } from '../../../application/dto/list-properties-query.dto'
import type {
  PaginationParams,
  PropertyFilters,
} from '../../../domain/repositories/property-repository'

export function toFiltersAndPagination(query: ListPropertiesQuery): {
  filters: PropertyFilters
  pagination: PaginationParams
} {
  const { page, limit, sortBy, sortOrder, ...filters } = query
  return { filters, pagination: { page, limit, sortBy, sortOrder } }
}
