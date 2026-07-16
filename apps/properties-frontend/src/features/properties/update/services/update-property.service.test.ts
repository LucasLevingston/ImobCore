import { describe, expect, it } from 'vitest'
import { makePropertyFormValues } from '../../../../test-utils/factories/make-property-form-values'
import { updateProperty } from './update-property.service'

describe('updateProperty', () => {
  it('should PUT to /api/properties/:id and return the updated property', async () => {
    const result = await updateProperty(
      'property-1',
      makePropertyFormValues({ title: 'Novo título' }),
    )

    expect(result.id).toBe('property-1')
    expect(result.title).toBe('Novo título')
  })
})
