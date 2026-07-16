import type { Property } from '../../../domain/entities/property.entity'

export type PropertyResponse = Omit<Property, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
}

export function toPropertyResponse(property: Property): PropertyResponse {
  return {
    ...property,
    createdAt: property.createdAt.toISOString(),
    updatedAt: property.updatedAt.toISOString(),
  }
}
