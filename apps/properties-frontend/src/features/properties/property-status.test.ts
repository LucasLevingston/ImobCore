import { describe, expect, it } from 'vitest'
import { PROPERTY_STATUSES } from '../../types/property'
import { PROPERTY_STATUS_BADGE_VARIANT, PROPERTY_STATUS_LABELS } from './property-status'

describe('PROPERTY_STATUS_LABELS', () => {
  it('should provide a pt-BR label for every property status', () => {
    for (const status of PROPERTY_STATUSES) {
      expect(PROPERTY_STATUS_LABELS[status]).toBeTruthy()
    }
  })
})

describe('PROPERTY_STATUS_BADGE_VARIANT', () => {
  it('should provide a badge variant for every property status', () => {
    for (const status of PROPERTY_STATUSES) {
      expect(PROPERTY_STATUS_BADGE_VARIANT[status]).toBeTruthy()
    }
  })

  it('should mark Available as success and Inactive as destructive', () => {
    expect(PROPERTY_STATUS_BADGE_VARIANT.Available).toBe('success')
    expect(PROPERTY_STATUS_BADGE_VARIANT.Inactive).toBe('destructive')
  })
})
