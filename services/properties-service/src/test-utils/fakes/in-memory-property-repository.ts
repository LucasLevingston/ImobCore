import { randomUUID } from 'node:crypto'
import type { Property } from '../../domain/entities/property.entity'
import type {
  CreatePropertyData,
  DashboardMetrics,
  PaginatedResult,
  PaginationParams,
  PropertyFilters,
  PropertyRepository,
  UpdatePropertyData,
} from '../../domain/repositories/property-repository'

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
    return this.paginate(this.applyFilters(this.properties, filters), pagination)
  }

  async search(
    query: string,
    filters: PropertyFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Property>> {
    const lowerQuery = query.toLowerCase()
    const matched = this.applyFilters(this.properties, filters).filter(
      (p) =>
        p.title.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.address.toLowerCase().includes(lowerQuery),
    )
    return this.paginate(matched, pagination)
  }

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const total = this.properties.length
    const byStatus = this.properties.reduce(
      (acc, p) => {
        acc[p.status] += 1
        return acc
      },
      {
        Available: 0,
        Reserved: 0,
        Sold: 0,
        Rented: 0,
        Inactive: 0,
      } as DashboardMetrics['byStatus'],
    )
    const averagePrice =
      total === 0 ? 0 : this.properties.reduce((sum, p) => sum + p.price, 0) / total

    const byCityMap = new Map<string, number>()
    const byDistrictMap = new Map<string, number>()
    for (const p of this.properties) {
      byCityMap.set(p.city, (byCityMap.get(p.city) ?? 0) + 1)
      byDistrictMap.set(p.district, (byDistrictMap.get(p.district) ?? 0) + 1)
    }

    return {
      total,
      byStatus,
      averagePrice,
      byCity: [...byCityMap.entries()].map(([city, count]) => ({ city, count })),
      byDistrict: [...byDistrictMap.entries()].map(([district, count]) => ({ district, count })),
    }
  }

  private applyFilters(properties: Property[], filters: PropertyFilters): Property[] {
    return properties.filter((p) => {
      if (filters.city && p.city !== filters.city) return false
      if (filters.district && p.district !== filters.district) return false
      if (filters.type && p.type !== filters.type) return false
      if (filters.status && p.status !== filters.status) return false
      if (filters.minPrice !== undefined && p.price < filters.minPrice) return false
      if (filters.maxPrice !== undefined && p.price > filters.maxPrice) return false
      if (filters.bedrooms !== undefined && p.bedrooms !== filters.bedrooms) return false
      if (filters.bathrooms !== undefined && p.bathrooms !== filters.bathrooms) return false
      if (filters.garageSpaces !== undefined && p.garageSpaces !== filters.garageSpaces)
        return false
      if (filters.minArea !== undefined && p.area < filters.minArea) return false
      if (filters.maxArea !== undefined && p.area > filters.maxArea) return false
      if (filters.acceptsFinancing !== undefined && p.acceptsFinancing !== filters.acceptsFinancing)
        return false
      if (filters.acceptsPets !== undefined && p.acceptsPets !== filters.acceptsPets) return false
      return true
    })
  }

  private paginate(items: Property[], pagination: PaginationParams): PaginatedResult<Property> {
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
    const items_ = sorted.slice(start, start + pagination.limit)

    return {
      items: items_,
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit),
    }
  }
}
