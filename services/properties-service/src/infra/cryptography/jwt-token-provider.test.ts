import jwt from 'jsonwebtoken'
import { describe, expect, it } from 'vitest'
import { JwtTokenProvider } from './jwt-token-provider'

describe('JwtTokenProvider', () => {
  it('should verify a token signed by auth-service with the same secret', () => {
    const secret = 'shared-secret-with-32-characters-min'
    const token = jwt.sign({ sub: 'user-1', email: 'lucas@email.com' }, secret, {
      expiresIn: '15m',
    })
    const provider = new JwtTokenProvider(secret)

    const payload = provider.verifyAccessToken(token)

    expect(payload).toEqual({ sub: 'user-1', email: 'lucas@email.com' })
  })

  it('should return null for a malformed token', () => {
    const provider = new JwtTokenProvider('secret-with-32-characters-minimum')
    expect(provider.verifyAccessToken('not-a-valid-token')).toBeNull()
  })

  it('should return null for a token signed with a different secret', () => {
    const tokenSignedElsewhere = jwt.sign(
      { sub: 'user-1', email: 'lucas@email.com' },
      'a-completely-different-secret-32ch',
    )
    const provider = new JwtTokenProvider('secret-with-32-characters-minimum')

    expect(provider.verifyAccessToken(tokenSignedElsewhere)).toBeNull()
  })

  it('should return null for an expired token', () => {
    const secret = 'secret-with-32-characters-minimum'
    const token = jwt.sign({ sub: 'user-1', email: 'lucas@email.com' }, secret, {
      expiresIn: '-1s',
    })
    const provider = new JwtTokenProvider(secret)

    expect(provider.verifyAccessToken(token)).toBeNull()
  })

  it('should return null when the token has a valid signature but is missing sub/email claims', () => {
    const secret = 'secret-with-32-characters-minimum'
    const tokenWithoutClaims = jwt.sign({ foo: 'bar' }, secret)
    const provider = new JwtTokenProvider(secret)

    expect(provider.verifyAccessToken(tokenWithoutClaims)).toBeNull()
  })

  it('should throw immediately when JWT_SECRET is not configured (fail fast, no insecure default)', () => {
    const originalSecret = process.env.JWT_SECRET
    delete process.env.JWT_SECRET

    expect(() => new JwtTokenProvider()).toThrow('JWT_SECRET não configurado.')

    process.env.JWT_SECRET = originalSecret
  })
})
