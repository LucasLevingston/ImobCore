import type { Property } from '../../../domain/entities/property.entity'
import type {
  PaginatedResult,
  PaginationParams,
  PropertyFilters,
  PropertyRepository,
} from '../../../domain/repositories/property-repository'

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
