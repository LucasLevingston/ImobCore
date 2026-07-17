import type { PropertyFilterValues } from '../types'

export interface ListPropertiesParams extends PropertyFilterValues {
  page?: number
  limit?: number
  sortBy?: 'price' | 'area' | 'bedrooms' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}
