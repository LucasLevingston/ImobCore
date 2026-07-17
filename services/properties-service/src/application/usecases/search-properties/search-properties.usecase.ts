import type { Property } from '../../../domain/entities/property.entity'
import type {
  PaginationParams,
  PropertyFilters,
} from '../../../domain/repositories/property-query.types'
import type { PropertyRepository } from '../../../domain/repositories/property-repository'
import type { PaginatedResult } from '../../../domain/repositories/property-repository-result.types'

export class SearchPropertiesUseCase {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async execute(
    query: string,
    filters: PropertyFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Property>> {
    return this.propertyRepository.search(query, filters, pagination)
  }
}
