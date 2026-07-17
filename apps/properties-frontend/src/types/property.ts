// Enums vêm de @microfrontends/validation-schemas — mesma fonte de verdade
// usada pelo schema de validação do backend, evita dessincronia.
export {
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
  type PropertyStatus,
  type PropertyType,
} from '@microfrontends/validation-schemas'

import type { PropertyStatus, PropertyType } from '@microfrontends/validation-schemas'

export interface Property {
  id: string
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
  createdAt: string
  updatedAt: string
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
