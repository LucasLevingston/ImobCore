import { describe, expect, it } from 'vitest'
import { isMutatingMethod, isOriginAllowed } from './origin-guard'

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

describe('isOriginAllowed', () => {
  const allowed = ['http://localhost:3000', 'http://localhost:3003']

  it('should allow a request whose Origin header matches the allowlist', () => {
    expect(isOriginAllowed('http://localhost:3000', undefined, allowed)).toBe(true)
  })

  it('should reject a request whose Origin header is not in the allowlist', () => {
    expect(isOriginAllowed('http://evil.example', undefined, allowed)).toBe(false)
  })

  it('should fall back to Referer when Origin is absent', () => {
    expect(isOriginAllowed(undefined, 'http://localhost:3003/dashboard', allowed)).toBe(true)
  })

  it('should reject when Referer origin is not in the allowlist', () => {
    expect(isOriginAllowed(undefined, 'http://evil.example/steal', allowed)).toBe(false)
  })

  it('should reject when neither Origin nor Referer is present', () => {
    expect(isOriginAllowed(undefined, undefined, allowed)).toBe(false)
  })

  it('should reject a malformed Referer URL instead of throwing', () => {
    expect(isOriginAllowed(undefined, 'not-a-valid-url', allowed)).toBe(false)
  })

  it('should accept a single string as the allowlist (not just an array)', () => {
    expect(isOriginAllowed('http://localhost:3000', undefined, 'http://localhost:3000')).toBe(true)
  })

  it('should treat an array header value by checking its first entry', () => {
    expect(isOriginAllowed(['http://localhost:3000', 'http://other'], undefined, allowed)).toBe(
      true,
    )
  })
})
