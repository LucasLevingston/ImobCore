import jwt from 'jsonwebtoken'
import { describe, expect, it } from 'vitest'
import { JwtTokenProvider } from './jwt-token-provider'

describe('JwtTokenProvider', () => {
  it('should generate an access token as a non-empty string', () => {
    const provider = new JwtTokenProvider()
    const token = provider.generateAccessToken({ sub: 'user-1', email: 'lucas@email.com' })
    expect(typeof token).toBe('string')
    expect(token.length).toBeGreaterThan(0)
  })

  it('should verify a token it generated and return the original payload', () => {
    const provider = new JwtTokenProvider()
    const token = provider.generateAccessToken({ sub: 'user-1', email: 'lucas@email.com' })

    const payload = provider.verifyAccessToken(token)

    expect(payload).toEqual({ sub: 'user-1', email: 'lucas@email.com' })
  })

  it('should return null for a malformed token', () => {
    const provider = new JwtTokenProvider()
    expect(provider.verifyAccessToken('not-a-valid-token')).toBeNull()
  })

  it('should return null for a token signed with a different secret', () => {
    const providerA = new JwtTokenProvider('secret-a-with-32-characters-min')
    const providerB = new JwtTokenProvider('secret-b-with-32-characters-min')

    const token = providerA.generateAccessToken({ sub: 'user-1', email: 'lucas@email.com' })

    expect(providerB.verifyAccessToken(token)).toBeNull()
  })

  it('should return null for an expired token', () => {
    const provider = new JwtTokenProvider(undefined, '-1s')
    const token = provider.generateAccessToken({ sub: 'user-1', email: 'lucas@email.com' })

    expect(provider.verifyAccessToken(token)).toBeNull()
  })

  it('should generate a refresh token as a high-entropy opaque string', () => {
    const provider = new JwtTokenProvider()
    const tokenA = provider.generateRefreshToken()
    const tokenB = provider.generateRefreshToken()

    expect(tokenA).not.toBe(tokenB)
    expect(tokenA.length).toBeGreaterThanOrEqual(32)
  })

  it('should return null when the token has a valid signature but is missing sub/email claims', () => {
    const provider = new JwtTokenProvider('secret-with-32-characters-minimum')
    const tokenWithoutClaims = jwt.sign({ foo: 'bar' }, 'secret-with-32-characters-minimum')

    expect(provider.verifyAccessToken(tokenWithoutClaims)).toBeNull()
  })

  it('should throw immediately when JWT_SECRET is not configured (fail fast, no insecure default)', () => {
    const originalSecret = process.env.JWT_SECRET
    delete process.env.JWT_SECRET

    expect(() => new JwtTokenProvider()).toThrow('JWT_SECRET não configurado.')

    process.env.JWT_SECRET = originalSecret
  })

  it('should fall back to a 15m expiry when JWT_ACCESS_TOKEN_EXPIRES_IN is unset', () => {
    const originalExpiresIn = process.env.JWT_ACCESS_TOKEN_EXPIRES_IN
    delete process.env.JWT_ACCESS_TOKEN_EXPIRES_IN

    const provider = new JwtTokenProvider('secret-with-32-characters-minimum')
    const token = provider.generateAccessToken({ sub: 'user-1', email: 'lucas@email.com' })
    const payload = provider.verifyAccessToken(token)

    process.env.JWT_ACCESS_TOKEN_EXPIRES_IN = originalExpiresIn

    expect(payload).toEqual({ sub: 'user-1', email: 'lucas@email.com' })
  })
})
