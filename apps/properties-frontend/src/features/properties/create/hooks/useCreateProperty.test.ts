import { waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { makePropertyFormValues } from '../../../../test-utils/factories/make-property-form-values'
import { renderHookWithProviders } from '../../../../test-utils/renderHookWithProviders'
import { useCreateProperty } from './useCreateProperty'

describe('useCreateProperty', () => {
  it('should create a property and return the created record', async () => {
    const { result } = renderHookWithProviders(() => useCreateProperty())

    result.current.mutate(makePropertyFormValues())

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.id).toBe('property-new')
  })
})
