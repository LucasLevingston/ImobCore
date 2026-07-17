import { describe, expect, it } from 'vitest'
import { makeRefreshToken } from '../../../test-utils/factories/make-refresh-token'
import { InMemoryRefreshTokenRepository } from '../../../test-utils/fakes/in-memory-refresh-token-repository'
import { LogoutUseCase } from './logout.usecase'

function makeSut() {
  const refreshTokenRepository = new InMemoryRefreshTokenRepository()
  const tokenHasher = { hash: (token: string) => `hashed:${token}` }
  const useCase = new LogoutUseCase(refreshTokenRepository, tokenHasher)
  return { useCase, refreshTokenRepository }
}

describe('LogoutUseCase', () => {
  it('should revoke the matching refresh token', async () => {
    const { useCase, refreshTokenRepository } = makeSut()
    const token = makeRefreshToken({ tokenHash: 'hashed:my-raw-token' })
    refreshTokenRepository.tokens.push(token)

    await useCase.execute('my-raw-token')

    expect(refreshTokenRepository.tokens.find((t) => t.id === token.id)?.revokedAt).not.toBeNull()
  })

  it('should not throw when the token does not exist (idempotent logout)', async () => {
    const { useCase } = makeSut()

    await expect(useCase.execute('unknown-token')).resolves.toBeUndefined()
  })

  it('should not throw when the token is already revoked', async () => {
    const { useCase, refreshTokenRepository } = makeSut()
    refreshTokenRepository.tokens.push(
      makeRefreshToken({ tokenHash: 'hashed:already-revoked', revokedAt: new Date() }),
    )

    await expect(useCase.execute('already-revoked')).resolves.toBeUndefined()
  })
})
