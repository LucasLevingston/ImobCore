import { waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { makePropertyFormValues } from '../../../../test-utils/factories/make-property-form-values'
import { renderHookWithProviders } from '../../../../test-utils/renderHookWithProviders'
import { useUpdateProperty } from './useUpdateProperty'

describe('useUpdateProperty', () => {
  it('should update a property and return the updated record', async () => {
    const { result } = renderHookWithProviders(() => useUpdateProperty('property-1'))

    result.current.mutate(makePropertyFormValues({ title: 'Título atualizado' }))

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.title).toBe('Título atualizado')
  })
})
