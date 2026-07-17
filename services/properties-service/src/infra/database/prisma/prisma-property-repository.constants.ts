import type { DashboardMetrics } from '../../../domain/repositories/property-repository-result.types'

export const EMPTY_STATUS_COUNTS: DashboardMetrics['byStatus'] = {
  Available: 0,
  Reserved: 0,
  Sold: 0,
  Rented: 0,
  Inactive: 0,
}
