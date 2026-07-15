export type PropertyType =
  'Apartment' | 'House' | 'Land' | 'Commercial' | 'Farm' | 'Studio' | 'Penthouse'

export type PropertyStatus = 'Available' | 'Reserved' | 'Sold' | 'Rented' | 'Inactive'

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

export const PROPERTY_TYPES: PropertyType[] = [
  'Apartment',
  'House',
  'Land',
  'Commercial',
  'Farm',
  'Studio',
  'Penthouse',
]

export const PROPERTY_STATUSES: PropertyStatus[] = [
  'Available',
  'Reserved',
  'Sold',
  'Rented',
  'Inactive',
]
