import type { Property } from '../../domain/entities/property.entity'
import type { DashboardMetrics } from '../../domain/repositories/property-repository-result.types'

export function computeInMemoryDashboardMetrics(properties: Property[]): DashboardMetrics {
  const total = properties.length
  const byStatus = properties.reduce(
    (acc, p) => {
      acc[p.status] += 1
      return acc
    },
    {
      Available: 0,
      Reserved: 0,
      Sold: 0,
      Rented: 0,
      Inactive: 0,
    } as DashboardMetrics['byStatus'],
  )
  const averagePrice = total === 0 ? 0 : properties.reduce((sum, p) => sum + p.price, 0) / total

  const byCityMap = new Map<string, number>()
  const byDistrictMap = new Map<string, number>()
  for (const p of properties) {
    byCityMap.set(p.city, (byCityMap.get(p.city) ?? 0) + 1)
    byDistrictMap.set(p.district, (byDistrictMap.get(p.district) ?? 0) + 1)
  }

  return {
    total,
    byStatus,
    averagePrice,
    byCity: [...byCityMap.entries()].map(([city, count]) => ({ city, count })),
    byDistrict: [...byDistrictMap.entries()].map(([district, count]) => ({ district, count })),
  }
}
