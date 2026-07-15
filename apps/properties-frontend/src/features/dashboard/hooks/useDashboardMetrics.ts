import { useQuery } from '@tanstack/react-query'
import { getDashboardMetrics } from '../services/get-dashboard-metrics.service'

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: getDashboardMetrics,
  })
}
