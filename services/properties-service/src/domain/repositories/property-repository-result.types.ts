import type { PropertyStatus } from '../entities/property.entity'

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
