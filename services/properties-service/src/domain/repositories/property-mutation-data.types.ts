import type { PropertyStatus, PropertyType } from '../entities/property.entity'

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
