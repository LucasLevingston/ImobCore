import type { Property, PropertyStatus, PropertyType } from '../entities/property.entity'

export interface CreatePropertyData {
  title: string
  description: string
  type: PropertyType
  status: PropertyStatus
  price: number
  condominiumFee: number | null
  iptu: number | null
  bedrooms: number
  bathrooms: number
  garageSpaces: number
  area: number
  lotArea: number | null
  floor: number | null
  furnished: boolean
  acceptsFinancing: boolean
  acceptsPets: boolean
  address: string
  number: string
  district: string
  city: string
  state: string
  zipCode: string
  latitude: number | null
  longitude: number | null
  brokerId: string
}

// `| undefined` explícito em cada campo (não só Partial<>) pra bater com a saída do
// zod .partial()/.optional() sob exactOptionalPropertyTypes — ver docs/ARCHITECTURE.md seção 32
export interface UpdatePropertyData {
  title?: string | undefined
  description?: string | undefined
  type?: PropertyType | undefined
  status?: PropertyStatus | undefined
  price?: number | undefined
  condominiumFee?: number | null | undefined
  iptu?: number | null | undefined
  bedrooms?: number | undefined
  bathrooms?: number | undefined
  garageSpaces?: number | undefined
  area?: number | undefined
  lotArea?: number | null | undefined
  floor?: number | null | undefined
  furnished?: boolean | undefined
  acceptsFinancing?: boolean | undefined
  acceptsPets?: boolean | undefined
  address?: string | undefined
  number?: string | undefined
  district?: string | undefined
  city?: string | undefined
  state?: string | undefined
  zipCode?: string | undefined
  latitude?: number | null | undefined
  longitude?: number | null | undefined
}

export interface PropertyFilters {
  city?: string | undefined
  district?: string | undefined
  type?: PropertyType | undefined
  minPrice?: number | undefined
  maxPrice?: number | undefined
  bedrooms?: number | undefined
  bathrooms?: number | undefined
  garageSpaces?: number | undefined
  minArea?: number | undefined
  maxArea?: number | undefined
  status?: PropertyStatus | undefined
  acceptsFinancing?: boolean | undefined
  acceptsPets?: boolean | undefined
}

export type PropertySortBy = 'price' | 'area' | 'bedrooms' | 'createdAt'
export type SortOrder = 'asc' | 'desc'

export interface PaginationParams {
  page: number
  limit: number
  sortBy: PropertySortBy
  sortOrder: SortOrder
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface DashboardMetrics {
  total: number
  byStatus: Record<PropertyStatus, number>
  averagePrice: number
  byCity: Array<{ city: string; count: number }>
  byDistrict: Array<{ district: string; count: number }>
}

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
