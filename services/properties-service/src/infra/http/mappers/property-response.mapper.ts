import type { Property } from '../../../domain/entities/property.entity'
import type { PropertyResponse } from './property-response.mapper.types'

export function toPropertyResponse(property: Property): PropertyResponse {
  return {
    ...property,
    createdAt: property.createdAt.toISOString(),
    updatedAt: property.updatedAt.toISOString(),
  }
}
