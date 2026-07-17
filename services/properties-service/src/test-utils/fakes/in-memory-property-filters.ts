import type { Property } from '../../domain/entities/property.entity'
import type { PropertyFilters } from '../../domain/repositories/property-query.types'

export function applyPropertyFilters(properties: Property[], filters: PropertyFilters): Property[] {
  return properties.filter((p) => {
    if (filters.city && p.city !== filters.city) return false
    if (filters.district && p.district !== filters.district) return false
    if (filters.type && p.type !== filters.type) return false
    if (filters.status && p.status !== filters.status) return false
    if (filters.minPrice !== undefined && p.price < filters.minPrice) return false
    if (filters.maxPrice !== undefined && p.price > filters.maxPrice) return false
    if (filters.bedrooms !== undefined && p.bedrooms !== filters.bedrooms) return false
    if (filters.bathrooms !== undefined && p.bathrooms !== filters.bathrooms) return false
    if (filters.garageSpaces !== undefined && p.garageSpaces !== filters.garageSpaces) return false
    if (filters.minArea !== undefined && p.area < filters.minArea) return false
    if (filters.maxArea !== undefined && p.area > filters.maxArea) return false
    if (filters.acceptsFinancing !== undefined && p.acceptsFinancing !== filters.acceptsFinancing)
      return false
    if (filters.acceptsPets !== undefined && p.acceptsPets !== filters.acceptsPets) return false
    return true
  })
}
