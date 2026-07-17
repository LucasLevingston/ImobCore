import { waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MOCK_PROPERTY } from '../../../../mocks/handlers/properties'
import { renderHookWithProviders } from '../../../../test-utils/renderHookWithProviders'
import { useProperties } from './useProperties'

describe('useProperties', () => {
  it('should load the paginated list of properties', async () => {
    const { result } = renderHookWithProviders(() => useProperties({}))

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.items).toEqual([MOCK_PROPERTY])
  })
})
