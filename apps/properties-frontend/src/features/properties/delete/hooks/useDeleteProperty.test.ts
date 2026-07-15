import { waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderHookWithProviders } from '../../../../test-utils/renderHookWithProviders'
import { useDeleteProperty } from './useDeleteProperty'

describe('useDeleteProperty', () => {
  it('should delete a property successfully', async () => {
    const { result } = renderHookWithProviders(() => useDeleteProperty())

    result.current.mutate('property-1')

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})
