import { describe, expect, it, vi } from 'vitest'
import { InMemoryRefreshTokenRepository } from '../../../test-utils/fakes/in-memory-refresh-token-repository'
import { InMemoryUserRepository } from '../../../test-utils/fakes/in-memory-user-repository'
import { makeRefreshToken } from '../../../test-utils/factories/make-refresh-token'
import { makeUser } from '../../../test-utils/factories/make-user'
import { UnauthorizedError } from '../../errors/unauthorized-error'
import { RefreshTokenUseCase } from './refresh-token.usecase'

function makeSut() {
  const refreshTokenRepository = new InMemoryRefreshTokenRepository()
  const userRepository = new InMemoryUserRepository()
  const tokenProvider = {
    generateAccessToken: vi.fn(() => 'new.access.token'),
    verifyAccessToken: vi.fn(() => null),
    generateRefreshToken: vi.fn(() => 'new-raw-refresh-token'),
  }
  const tokenHasher = { hash: (token: string) => `hashed:${token}` }
  const useCase = new RefreshTokenUseCase(
    refreshTokenRepository,
    userRepository,
    tokenProvider,
    tokenHasher,
    7 * 24 * 60 * 60 * 1000,
  )
  return { useCase, refreshTokenRepository, userRepository, tokenProvider }
}

describe('RefreshTokenUseCase', () => {
  it('should issue a new access token and a new refresh token for a valid token', async () => {
    const { useCase, refreshTokenRepository, userRepository } = makeSut()
    const user = makeUser()
    userRepository.users.push(user)
    refreshTokenRepository.tokens.push(
      makeRefreshToken({ tokenHash: 'hashed:valid-raw-token', userId: user.id }),
    )

    const result = await useCase.execute('valid-raw-token')

    expect(result.accessToken).toBe('new.access.token')
    expect(result.refreshToken).toBe('new-raw-refresh-token')
  })

  it('should revoke the old token after rotation', async () => {
    const { useCase, refreshTokenRepository, userRepository } = makeSut()
    const user = makeUser()
    userRepository.users.push(user)
    const oldToken = makeRefreshToken({ tokenHash: 'hashed:valid-raw-token', userId: user.id })
    refreshTokenRepository.tokens.push(oldToken)

    await useCase.execute('valid-raw-token')

    expect(
      refreshTokenRepository.tokens.find((t) => t.id === oldToken.id)?.revokedAt,
    ).not.toBeNull()
  })

  it('should throw UnauthorizedError when the token does not exist', async () => {
    const { useCase } = makeSut()

    await expect(useCase.execute('unknown-token')).rejects.toBeInstanceOf(UnauthorizedError)
  })

  it('should throw UnauthorizedError when the token was already revoked', async () => {
    const { useCase, refreshTokenRepository, userRepository } = makeSut()
    const user = makeUser()
    userRepository.users.push(user)
    refreshTokenRepository.tokens.push(
      makeRefreshToken({
        tokenHash: 'hashed:revoked-token',
        userId: user.id,
        revokedAt: new Date(),
      }),
    )

    await expect(useCase.execute('revoked-token')).rejects.toBeInstanceOf(UnauthorizedError)
  })

  it('should throw UnauthorizedError when the token is expired', async () => {
    const { useCase, refreshTokenRepository, userRepository } = makeSut()
    const user = makeUser()
    userRepository.users.push(user)
    refreshTokenRepository.tokens.push(
      makeRefreshToken({
        tokenHash: 'hashed:expired-token',
        userId: user.id,
        expiresAt: new Date(Date.now() - 1000),
      }),
    )

    await expect(useCase.execute('expired-token')).rejects.toBeInstanceOf(UnauthorizedError)
  })

  it('should throw UnauthorizedError when the token is valid but the owning user no longer exists', async () => {
    const { useCase, refreshTokenRepository } = makeSut()
    refreshTokenRepository.tokens.push(
      makeRefreshToken({ tokenHash: 'hashed:orphan-token', userId: 'deleted-user-id' }),
    )

    await expect(useCase.execute('orphan-token')).rejects.toBeInstanceOf(UnauthorizedError)
  })

  it('should sign the new access token with the owning user id and email', async () => {
    const { useCase, refreshTokenRepository, userRepository, tokenProvider } = makeSut()
    const user = makeUser()
    userRepository.users.push(user)
    refreshTokenRepository.tokens.push(
      makeRefreshToken({ tokenHash: 'hashed:valid-raw-token', userId: user.id }),
    )

    await useCase.execute('valid-raw-token')

    expect(tokenProvider.generateAccessToken).toHaveBeenCalledWith({
      sub: user.id,
      email: user.email,
    })
  })
})
