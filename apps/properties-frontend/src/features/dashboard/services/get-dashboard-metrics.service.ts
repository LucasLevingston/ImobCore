import { apiClient } from '../../../lib/api-client'
import type { DashboardMetrics } from '../../../types/property'

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  return apiClient.get<DashboardMetrics>('/api/properties/metrics')
}
