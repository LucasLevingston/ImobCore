import { describe, expect, it } from 'vitest'
import { isMutatingMethod } from './is-mutating-method'

describe('isMutatingMethod', () => {
  it('should treat POST, PUT, PATCH, DELETE as mutating', () => {
    expect(isMutatingMethod('POST')).toBe(true)
    expect(isMutatingMethod('PUT')).toBe(true)
    expect(isMutatingMethod('PATCH')).toBe(true)
    expect(isMutatingMethod('DELETE')).toBe(true)
  })

  it('should treat GET, HEAD, OPTIONS as non-mutating', () => {
    expect(isMutatingMethod('GET')).toBe(false)
    expect(isMutatingMethod('HEAD')).toBe(false)
    expect(isMutatingMethod('OPTIONS')).toBe(false)
  })

  it('should be case-insensitive', () => {
    expect(isMutatingMethod('post')).toBe(true)
  })
})
