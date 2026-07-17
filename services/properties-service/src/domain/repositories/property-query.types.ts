import type { PropertyStatus, PropertyType } from '../entities/property.entity'

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
