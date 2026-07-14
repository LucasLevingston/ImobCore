import { afterEach, describe, expect, it } from 'vitest'
import { refreshTokenCookieOptions } from './refresh-token-cookie'

describe('refreshTokenCookieOptions', () => {
  const originalEnv = process.env.NODE_ENV

  afterEach(() => {
    process.env.NODE_ENV = originalEnv
  })

  it('should convert maxAge from milliseconds to seconds', () => {
    expect(refreshTokenCookieOptions(60_000).maxAge).toBe(60)
  })

  it('should always be httpOnly with sameSite strict', () => {
    const options = refreshTokenCookieOptions(1000)
    expect(options.httpOnly).toBe(true)
    expect(options.sameSite).toBe('strict')
  })

  it('should be secure in production', () => {
    process.env.NODE_ENV = 'production'
    expect(refreshTokenCookieOptions(1000).secure).toBe(true)
  })

  it('should not require secure outside production (local http dev)', () => {
    process.env.NODE_ENV = 'test'
    expect(refreshTokenCookieOptions(1000).secure).toBe(false)
  })
})
