import { randomUUID } from 'node:crypto'
import type { Property } from '../../domain/entities/property.entity'
import type {
  CreatePropertyData,
  UpdatePropertyData,
} from '../../domain/repositories/property-mutation-data.types'
import type {
  PaginationParams,
  PropertyFilters,
} from '../../domain/repositories/property-query.types'
import type {
  PaginatedResult,
  DashboardMetrics,
} from '../../domain/repositories/property-repository-result.types'
import type { PropertyRepository } from '../../domain/repositories/property-repository'
import { applyPropertyFilters } from './in-memory-property-filters'
import { paginateProperties } from './in-memory-property-pagination'
import { computeInMemoryDashboardMetrics } from './in-memory-property-dashboard-metrics'

// Fake em memória — permite testar use cases sem subir Postgres (unit, rápido, determinístico)
export class InMemoryPropertyRepository implements PropertyRepository {
  public readonly properties: Property[] = []

  async create(data: CreatePropertyData): Promise<Property> {
    const now = new Date()
    const property: Property = { id: randomUUID(), createdAt: now, updatedAt: now, ...data }
    this.properties.push(property)
    return property
  }

  async findById(id: string): Promise<Property | null> {
    return this.properties.find((p) => p.id === id) ?? null
  }

  async update(id: string, data: UpdatePropertyData): Promise<Property> {
    const index = this.properties.findIndex((p) => p.id === id)
    if (index === -1) {
      throw new Error(`Property ${id} not found`)
    }
    const current = this.properties[index]
    if (!current) {
      throw new Error(`Property ${id} not found`)
    }
    // Remove entradas explicitamente `undefined` antes do spread — sob
    // exactOptionalPropertyTypes, `{...current, ...data}` widened pra `T | undefined`
    // em todo campo presente em `data`, mesmo quando o valor real não é undefined
    const definedChanges = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    ) as Partial<Property>
    const updated: Property = { ...current, ...definedChanges, updatedAt: new Date() }
    this.properties[index] = updated
    return updated
  }

  async delete(id: string): Promise<void> {
    const index = this.properties.findIndex((p) => p.id === id)
    if (index !== -1) {
      this.properties.splice(index, 1)
    }
  }

  async list(
    filters: PropertyFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Property>> {
    return paginateProperties(applyPropertyFilters(this.properties, filters), pagination)
  }

  async search(
    query: string,
    filters: PropertyFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Property>> {
    const lowerQuery = query.toLowerCase()
    const matched = applyPropertyFilters(this.properties, filters).filter(
      (p) =>
        p.title.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.address.toLowerCase().includes(lowerQuery),
    )
    return paginateProperties(matched, pagination)
  }

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    return computeInMemoryDashboardMetrics(this.properties)
  }
}
