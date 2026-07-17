import type { Property } from '../../domain/entities/property.entity'
import type { PaginationParams } from '../../domain/repositories/property-query.types'
import type { PaginatedResult } from '../../domain/repositories/property-repository-result.types'

export function paginateProperties(
  items: Property[],
  pagination: PaginationParams,
): PaginatedResult<Property> {
  const sorted = [...items].sort((a, b) => {
    const direction = pagination.sortOrder === 'asc' ? 1 : -1
    const aValue = a[pagination.sortBy]
    const bValue = b[pagination.sortBy]
    if (aValue instanceof Date && bValue instanceof Date) {
      return (aValue.getTime() - bValue.getTime()) * direction
    }
    if (aValue < bValue) return -1 * direction
    if (aValue > bValue) return 1 * direction
    return 0
  })

  const total = sorted.length
  const start = (pagination.page - 1) * pagination.limit
  const pageItems = sorted.slice(start, start + pagination.limit)

  return {
    items: pageItems,
    total,
    page: pagination.page,
    limit: pagination.limit,
    totalPages: Math.ceil(total / pagination.limit),
  }
}
