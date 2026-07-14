import { describe, expect, it } from 'vitest'
import { resolveRequestId } from './request-id'

describe('resolveRequestId', () => {
  it('should generate a new id when the header is absent', () => {
    const id = resolveRequestId(undefined)
    expect(typeof id).toBe('string')
    expect(id.length).toBeGreaterThan(0)
  })

  it('should generate different ids on each call when absent', () => {
    expect(resolveRequestId(undefined)).not.toBe(resolveRequestId(undefined))
  })

  it('should reuse the incoming header value when present', () => {
    expect(resolveRequestId('client-provided-id-123')).toBe('client-provided-id-123')
  })

  it('should reuse the first value when the header arrives as an array', () => {
    expect(resolveRequestId(['first-id', 'second-id'])).toBe('first-id')
  })

  it('should generate a new id when the header is an empty string', () => {
    const id = resolveRequestId('')
    expect(id.length).toBeGreaterThan(0)
  })
})
