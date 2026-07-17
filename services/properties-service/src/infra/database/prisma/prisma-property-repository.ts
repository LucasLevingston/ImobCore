import type { Property } from '../../../domain/entities/property.entity'
import type {
  CreatePropertyData,
  UpdatePropertyData,
} from '../../../domain/repositories/property-mutation-data.types'
import type {
  PaginationParams,
  PropertyFilters,
} from '../../../domain/repositories/property-query.types'
import type {
  PaginatedResult,
  DashboardMetrics,
} from '../../../domain/repositories/property-repository-result.types'
import type { PropertyRepository } from '../../../domain/repositories/property-repository'
import type { Prisma, PrismaClient } from '../../../generated/prisma/client'
import { toDomain } from './prisma-property.mapper'
import { buildWhere } from './prisma-property-where.builder'
import { buildUpdateData } from './prisma-property-update.builder'
import { runPaginatedPropertyQuery } from './prisma-paginated-property-query'
import { computePropertyDashboardMetrics } from './prisma-property-dashboard-metrics'

export class PrismaPropertyRepository implements PropertyRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreatePropertyData): Promise<Property> {
    const record = await this.prisma.property.create({ data })
    return toDomain(record)
  }

  async findById(id: string): Promise<Property | null> {
    const record = await this.prisma.property.findUnique({ where: { id } })
    return record ? toDomain(record) : null
  }

  async update(id: string, data: UpdatePropertyData): Promise<Property> {
    const record = await this.prisma.property.update({
      where: { id },
      data: buildUpdateData(data),
    })
    return toDomain(record)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.property.delete({ where: { id } })
  }

  async list(
    filters: PropertyFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Property>> {
    return runPaginatedPropertyQuery(this.prisma, buildWhere(filters), pagination)
  }

  async search(
    query: string,
    filters: PropertyFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Property>> {
    const where: Prisma.PropertyWhereInput = {
      ...buildWhere(filters),
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { address: { contains: query, mode: 'insensitive' } },
      ],
    }
    return runPaginatedPropertyQuery(this.prisma, where, pagination)
  }

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    return computePropertyDashboardMetrics(this.prisma)
  }
}
