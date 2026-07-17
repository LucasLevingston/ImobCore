import { waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MOCK_PROPERTY } from '../../../../mocks/handlers/properties'
import { renderHookWithProviders } from '../../../../test-utils/renderHookWithProviders'
import { useProperty } from './useProperty'

describe('useProperty', () => {
  it('should load a single property by id', async () => {
    const { result } = renderHookWithProviders(() => useProperty(MOCK_PROPERTY.id))

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(MOCK_PROPERTY)
  })

  it('should error out for an id that does not exist', async () => {
    const { result } = renderHookWithProviders(() => useProperty('ghost'))

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
