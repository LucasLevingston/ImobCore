import { describe, expect, it } from 'vitest'
import { getDashboardMetrics } from './get-dashboard-metrics.service'

describe('getDashboardMetrics', () => {
  it('should call GET /api/properties/metrics and return the aggregated metrics', async () => {
    const result = await getDashboardMetrics()

    expect(result.total).toBe(3)
    expect(result.byStatus.Sold).toBe(1)
  })
})
