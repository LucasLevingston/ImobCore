import type { DashboardMetrics } from '../../../domain/repositories/property-repository-result.types'
import type { PrismaClient } from '../../../generated/prisma/client'
import { EMPTY_STATUS_COUNTS } from './prisma-property-repository.constants'

export async function computePropertyDashboardMetrics(
  prisma: PrismaClient,
): Promise<DashboardMetrics> {
  const [total, byStatusGroups, priceAggregate, byCityGroups, byDistrictGroups] = await Promise.all(
    [
      prisma.property.count(),
      prisma.property.groupBy({ by: ['status'], _count: { _all: true } }),
      prisma.property.aggregate({ _avg: { price: true } }),
      prisma.property.groupBy({ by: ['city'], _count: { _all: true } }),
      prisma.property.groupBy({ by: ['district'], _count: { _all: true } }),
    ],
  )

  const byStatus = { ...EMPTY_STATUS_COUNTS }
  for (const group of byStatusGroups) {
    byStatus[group.status] = group._count._all
  }

  return {
    total,
    byStatus,
    averagePrice: priceAggregate._avg.price?.toNumber() ?? 0,
    byCity: byCityGroups.map((group) => ({ city: group.city, count: group._count._all })),
    byDistrict: byDistrictGroups.map((group) => ({
      district: group.district,
      count: group._count._all,
    })),
  }
}
