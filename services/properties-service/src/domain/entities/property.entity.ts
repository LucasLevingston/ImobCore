export type PropertyType =
  | 'Apartment'
  | 'House'
  | 'Land'
  | 'Commercial'
  | 'Farm'
  | 'Studio'
  | 'Penthouse'

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
  createdAt: Date
  updatedAt: Date
}
