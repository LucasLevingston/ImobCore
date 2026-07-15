import { describe, expect, it, vi } from 'vitest'
import { UnauthorizedError } from '../../../application/errors/unauthorized-error'
import { makeAuthenticate } from './authenticate'

function makeSut() {
  const tokenProvider = { verifyAccessToken: vi.fn() }
  const authenticate = makeAuthenticate(tokenProvider)
  return { authenticate, tokenProvider }
}

describe('authenticate middleware', () => {
  it('should set request.user when the bearer token is valid', async () => {
    const { authenticate, tokenProvider } = makeSut()
    tokenProvider.verifyAccessToken.mockReturnValue({ sub: 'user-1', email: 'lucas@email.com' })
    const request = { headers: { authorization: 'Bearer valid.token.here' } } as never

    await authenticate(request, {} as never)

    expect((request as { user?: unknown }).user).toEqual({
      sub: 'user-1',
      email: 'lucas@email.com',
    })
  })

  it('should throw UnauthorizedError when the Authorization header is missing', async () => {
    const { authenticate } = makeSut()
    const request = { headers: {} } as never

    await expect(authenticate(request, {} as never)).rejects.toBeInstanceOf(UnauthorizedError)
  })

  it('should throw UnauthorizedError when the header does not start with Bearer', async () => {
    const { authenticate } = makeSut()
    const request = { headers: { authorization: 'Basic abc123' } } as never

    await expect(authenticate(request, {} as never)).rejects.toBeInstanceOf(UnauthorizedError)
  })

  it('should throw UnauthorizedError when the token is invalid or expired', async () => {
    const { authenticate, tokenProvider } = makeSut()
    tokenProvider.verifyAccessToken.mockReturnValue(null)
    const request = { headers: { authorization: 'Bearer invalid.token' } } as never

    await expect(authenticate(request, {} as never)).rejects.toBeInstanceOf(UnauthorizedError)
  })
})
