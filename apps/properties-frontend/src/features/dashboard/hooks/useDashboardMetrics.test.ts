import { waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderHookWithProviders } from '../../../test-utils/renderHookWithProviders'
import { useDashboardMetrics } from './useDashboardMetrics'

describe('useDashboardMetrics', () => {
  it('should load the aggregated dashboard metrics', async () => {
    const { result } = renderHookWithProviders(() => useDashboardMetrics())

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.total).toBe(3)
  })
})
