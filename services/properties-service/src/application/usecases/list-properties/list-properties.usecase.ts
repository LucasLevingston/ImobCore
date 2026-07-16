import type { Property } from '../../../domain/entities/property.entity'
import type {
  PaginatedResult,
  PaginationParams,
  PropertyFilters,
  PropertyRepository,
} from '../../../domain/repositories/property-repository'

export class ListPropertiesUseCase {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async execute(
    filters: PropertyFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Property>> {
    return this.propertyRepository.list(filters, pagination)
  }
}
