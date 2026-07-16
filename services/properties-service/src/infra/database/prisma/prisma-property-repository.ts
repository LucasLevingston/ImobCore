import type { Property } from '../../../domain/entities/property.entity'
import type {
  CreatePropertyData,
  DashboardMetrics,
  PaginatedResult,
  PaginationParams,
  PropertyFilters,
  PropertyRepository,
  UpdatePropertyData,
} from '../../../domain/repositories/property-repository'
import type {
  Prisma,
  PrismaClient,
  Property as PrismaProperty,
} from '../../../generated/prisma/client'

function toDomain(record: PrismaProperty): Property {
  return {
    ...record,
    price: record.price.toNumber(),
    condominiumFee: record.condominiumFee?.toNumber() ?? null,
    iptu: record.iptu?.toNumber() ?? null,
    area: record.area.toNumber(),
    lotArea: record.lotArea?.toNumber() ?? null,
    latitude: record.latitude?.toNumber() ?? null,
    longitude: record.longitude?.toNumber() ?? null,
  }
}

// Cada chave só entra no objeto se definida — Prisma.PropertyWhereInput não declara
// `| undefined` explícito, então sob exactOptionalPropertyTypes um spread condicional
// é obrigatório (atribuir `undefined` direto pra chave quebraria o typecheck)
function buildWhere(filters: PropertyFilters): Prisma.PropertyWhereInput {
  return {
    ...(filters.city !== undefined ? { city: filters.city } : {}),
    ...(filters.district !== undefined ? { district: filters.district } : {}),
    ...(filters.type !== undefined ? { type: filters.type } : {}),
    ...(filters.status !== undefined ? { status: filters.status } : {}),
    ...(filters.acceptsFinancing !== undefined
      ? { acceptsFinancing: filters.acceptsFinancing }
      : {}),
    ...(filters.acceptsPets !== undefined ? { acceptsPets: filters.acceptsPets } : {}),
    ...(filters.bedrooms !== undefined ? { bedrooms: filters.bedrooms } : {}),
    ...(filters.bathrooms !== undefined ? { bathrooms: filters.bathrooms } : {}),
    ...(filters.garageSpaces !== undefined ? { garageSpaces: filters.garageSpaces } : {}),
    ...(filters.minPrice !== undefined || filters.maxPrice !== undefined
      ? {
          price: {
            ...(filters.minPrice !== undefined ? { gte: filters.minPrice } : {}),
            ...(filters.maxPrice !== undefined ? { lte: filters.maxPrice } : {}),
          },
        }
      : {}),
    ...(filters.minArea !== undefined || filters.maxArea !== undefined
      ? {
          area: {
            ...(filters.minArea !== undefined ? { gte: filters.minArea } : {}),
            ...(filters.maxArea !== undefined ? { lte: filters.maxArea } : {}),
          },
        }
      : {}),
  }
}

function buildUpdateData(data: UpdatePropertyData): Prisma.PropertyUpdateInput {
  return {
    ...(data.title !== undefined ? { title: data.title } : {}),
    ...(data.description !== undefined ? { description: data.description } : {}),
    ...(data.type !== undefined ? { type: data.type } : {}),
    ...(data.status !== undefined ? { status: data.status } : {}),
    ...(data.price !== undefined ? { price: data.price } : {}),
    ...(data.condominiumFee !== undefined ? { condominiumFee: data.condominiumFee } : {}),
    ...(data.iptu !== undefined ? { iptu: data.iptu } : {}),
    ...(data.bedrooms !== undefined ? { bedrooms: data.bedrooms } : {}),
    ...(data.bathrooms !== undefined ? { bathrooms: data.bathrooms } : {}),
    ...(data.garageSpaces !== undefined ? { garageSpaces: data.garageSpaces } : {}),
    ...(data.area !== undefined ? { area: data.area } : {}),
    ...(data.lotArea !== undefined ? { lotArea: data.lotArea } : {}),
    ...(data.floor !== undefined ? { floor: data.floor } : {}),
    ...(data.furnished !== undefined ? { furnished: data.furnished } : {}),
    ...(data.acceptsFinancing !== undefined ? { acceptsFinancing: data.acceptsFinancing } : {}),
    ...(data.acceptsPets !== undefined ? { acceptsPets: data.acceptsPets } : {}),
    ...(data.address !== undefined ? { address: data.address } : {}),
    ...(data.number !== undefined ? { number: data.number } : {}),
    ...(data.district !== undefined ? { district: data.district } : {}),
    ...(data.city !== undefined ? { city: data.city } : {}),
    ...(data.state !== undefined ? { state: data.state } : {}),
    ...(data.zipCode !== undefined ? { zipCode: data.zipCode } : {}),
    ...(data.latitude !== undefined ? { latitude: data.latitude } : {}),
    ...(data.longitude !== undefined ? { longitude: data.longitude } : {}),
  }
}

const EMPTY_STATUS_COUNTS: DashboardMetrics['byStatus'] = {
  Available: 0,
  Reserved: 0,
  Sold: 0,
  Rented: 0,
  Inactive: 0,
}

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
    return this.paginatedQuery(buildWhere(filters), pagination)
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
    return this.paginatedQuery(where, pagination)
  }

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const [total, byStatusGroups, priceAggregate, byCityGroups, byDistrictGroups] =
      await Promise.all([
        this.prisma.property.count(),
        this.prisma.property.groupBy({ by: ['status'], _count: { _all: true } }),
        this.prisma.property.aggregate({ _avg: { price: true } }),
        this.prisma.property.groupBy({ by: ['city'], _count: { _all: true } }),
        this.prisma.property.groupBy({ by: ['district'], _count: { _all: true } }),
      ])

    const byStatus = { ...EMPTY_STATUS_COUNTS }
    for (const group of byStatusGroups) {
      byStatus[group.status] = group._count._all
    }

    return {
      total,
      byStatus,
      averagePrice: priceAggregate._avg.price?.toNumber() ?? 0,
      byCity: byCityGroups.map((group) => ({ city: group.city, count: group._count._all })),
      byDistrict: byDistrictGroups.map((group) => ({
        district: group.district,
        count: group._count._all,
      })),
    }
  }

  private async paginatedQuery(
    where: Prisma.PropertyWhereInput,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Property>> {
    const [records, total] = await Promise.all([
      this.prisma.property.findMany({
        where,
        orderBy: { [pagination.sortBy]: pagination.sortOrder },
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
      }),
      this.prisma.property.count({ where }),
    ])

    return {
      items: records.map(toDomain),
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit),
    }
  }
}
