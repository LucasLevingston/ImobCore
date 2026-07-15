import { describe, expect, it } from 'vitest'
import { MOCK_PROPERTY } from '../../../../mocks/handlers/properties'
import { makePropertyFormValues } from '../../../../test-utils/factories/make-property-form-values'
import { createProperty } from './create-property.service'

describe('createProperty', () => {
  it('should POST to /api/properties and return the created property', async () => {
    const result = await createProperty(makePropertyFormValues())

    expect(result.title).toBe(MOCK_PROPERTY.title)
    expect(result.id).toBe('property-new')
  })
})
