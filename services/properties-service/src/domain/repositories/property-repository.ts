import type { Property } from '../entities/property.entity'
import type { CreatePropertyData, UpdatePropertyData } from './property-mutation-data.types'
import type { PaginationParams, PropertyFilters } from './property-query.types'
import type { DashboardMetrics, PaginatedResult } from './property-repository-result.types'

// DIP: use cases dependem desta abstração — implementação concreta (Prisma) fica em infra
export interface PropertyRepository {
  create(data: CreatePropertyData): Promise<Property>
  findById(id: string): Promise<Property | null>
  update(id: string, data: UpdatePropertyData): Promise<Property>
  delete(id: string): Promise<void>
  list(filters: PropertyFilters, pagination: PaginationParams): Promise<PaginatedResult<Property>>
  search(
    query: string,
    filters: PropertyFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Property>>
  getDashboardMetrics(): Promise<DashboardMetrics>
}
