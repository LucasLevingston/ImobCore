import type { Property } from '../../../domain/entities/property.entity'
import type { PaginationParams } from '../../../domain/repositories/property-query.types'
import type { PaginatedResult } from '../../../domain/repositories/property-repository-result.types'
import type { Prisma, PrismaClient } from '../../../generated/prisma/client'
import { toDomain } from './prisma-property.mapper'

export async function runPaginatedPropertyQuery(
  prisma: PrismaClient,
  where: Prisma.PropertyWhereInput,
  pagination: PaginationParams,
): Promise<PaginatedResult<Property>> {
  const [records, total] = await Promise.all([
    prisma.property.findMany({
      where,
      orderBy: { [pagination.sortBy]: pagination.sortOrder },
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
    }),
    prisma.property.count({ where }),
  ])

  return {
    items: records.map(toDomain),
    total,
    page: pagination.page,
    limit: pagination.limit,
    totalPages: Math.ceil(total / pagination.limit),
  }
}
