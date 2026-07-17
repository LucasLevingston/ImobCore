import type { PropertyFilters } from '../../../domain/repositories/property-query.types'
import type { Prisma } from '../../../generated/prisma/client'

// Cada chave só entra no objeto se definida — Prisma.PropertyWhereInput não declara
// `| undefined` explícito, então sob exactOptionalPropertyTypes um spread condicional
// é obrigatório (atribuir `undefined` direto pra chave quebraria o typecheck)
export function buildWhere(filters: PropertyFilters): Prisma.PropertyWhereInput {
  return {
    ...(filters.city !== undefined ? { city: filters.city } : {}),
    ...(filters.district !== undefined ? { district: filters.district } : {}),
    ...(filters.type !== undefined ? { type: filters.type } : {}),
    ...(filters.status !== undefined ? { status: filters.status } : {}),
    ...(filters.acceptsFinancing !== undefined
      ? { acceptsFinancing: filters.acceptsFinancing }
      : {}),
    ...(filters.acceptsPets !== undefined ? { acceptsPets: filters.acceptsPets } : {}),
    ...(filters.bedrooms !== undefined ? { bedrooms: filters.bedrooms } : {}),
    ...(filters.bathrooms !== undefined ? { bathrooms: filters.bathrooms } : {}),
    ...(filters.garageSpaces !== undefined ? { garageSpaces: filters.garageSpaces } : {}),
    ...(filters.minPrice !== undefined || filters.maxPrice !== undefined
      ? {
          price: {
            ...(filters.minPrice !== undefined ? { gte: filters.minPrice } : {}),
            ...(filters.maxPrice !== undefined ? { lte: filters.maxPrice } : {}),
          },
        }
      : {}),
    ...(filters.minArea !== undefined || filters.maxArea !== undefined
      ? {
          area: {
            ...(filters.minArea !== undefined ? { gte: filters.minArea } : {}),
            ...(filters.maxArea !== undefined ? { lte: filters.maxArea } : {}),
          },
        }
      : {}),
  }
}
