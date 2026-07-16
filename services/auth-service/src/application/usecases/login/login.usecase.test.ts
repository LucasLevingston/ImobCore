import { describe, expect, it, vi } from 'vitest'
import { InMemoryRefreshTokenRepository } from '../../../test-utils/fakes/in-memory-refresh-token-repository'
import { InMemoryUserRepository } from '../../../test-utils/fakes/in-memory-user-repository'
import { makeUser } from '../../../test-utils/factories/make-user'
import { UnauthorizedError } from '../../errors/unauthorized-error'
import { LoginUseCase } from './login.usecase'

function makeSut() {
  const userRepository = new InMemoryUserRepository()
  const refreshTokenRepository = new InMemoryRefreshTokenRepository()
  const passwordHasher = { hash: async () => 'irrelevant', compare: vi.fn(async () => true) }
  const tokenProvider = {
    generateAccessToken: vi.fn(() => 'signed.access.token'),
    verifyAccessToken: vi.fn(() => null),
    generateRefreshToken: vi.fn(() => 'raw-refresh-token'),
  }
  const tokenHasher = { hash: (token: string) => `hashed:${token}` }
  const useCase = new LoginUseCase(
    userRepository,
    refreshTokenRepository,
    passwordHasher,
    tokenProvider,
    tokenHasher,
    7 * 24 * 60 * 60 * 1000,
  )
  return { useCase, userRepository, refreshTokenRepository, passwordHasher, tokenProvider }
}

describe('LoginUseCase', () => {
  it('should return an access token and a raw refresh token on success', async () => {
    const { useCase, userRepository } = makeSut()
    userRepository.users.push(makeUser({ email: 'lucas@email.com' }))

    const result = await useCase.execute({ email: 'lucas@email.com', password: 'correct-password' })

    expect(result.accessToken).toBe('signed.access.token')
    expect(result.refreshToken).toBe('raw-refresh-token')
  })

  it('should persist only the hash of the refresh token, never the raw value', async () => {
    const { useCase, userRepository, refreshTokenRepository } = makeSut()
    userRepository.users.push(makeUser({ email: 'lucas@email.com' }))

    await useCase.execute({ email: 'lucas@email.com', password: 'correct-password' })

    expect(refreshTokenRepository.tokens[0]?.tokenHash).toBe('hashed:raw-refresh-token')
    expect(refreshTokenRepository.tokens[0]?.tokenHash).not.toBe('raw-refresh-token')
  })

  it('should throw UnauthorizedError when the email does not exist', async () => {
    const { useCase } = makeSut()

    await expect(
      useCase.execute({ email: 'ghost@email.com', password: 'whatever' }),
    ).rejects.toBeInstanceOf(UnauthorizedError)
  })

  it('should throw UnauthorizedError when the password is incorrect', async () => {
    const { useCase, userRepository, passwordHasher } = makeSut()
    userRepository.users.push(makeUser({ email: 'lucas@email.com' }))
    passwordHasher.compare.mockResolvedValueOnce(false)

    await expect(
      useCase.execute({ email: 'lucas@email.com', password: 'wrong-password' }),
    ).rejects.toBeInstanceOf(UnauthorizedError)
  })

  it('should use the same generic error message for unknown email and wrong password', async () => {
    const { useCase, userRepository, passwordHasher } = makeSut()
    userRepository.users.push(makeUser({ email: 'lucas@email.com' }))
    passwordHasher.compare.mockResolvedValueOnce(false)

    let wrongPasswordMessage = ''
    try {
      await useCase.execute({ email: 'lucas@email.com', password: 'wrong-password' })
    } catch (error) {
      wrongPasswordMessage = (error as Error).message
    }

    let unknownEmailMessage = ''
    try {
      await useCase.execute({ email: 'ghost@email.com', password: 'whatever' })
    } catch (error) {
      unknownEmailMessage = (error as Error).message
    }

    expect(wrongPasswordMessage).toBe(unknownEmailMessage)
  })

  it('should sign the access token with the user id and email', async () => {
    const { useCase, userRepository, tokenProvider } = makeSut()
    const user = makeUser({ email: 'lucas@email.com' })
    userRepository.users.push(user)

    await useCase.execute({ email: 'lucas@email.com', password: 'correct-password' })

    expect(tokenProvider.generateAccessToken).toHaveBeenCalledWith({
      sub: user.id,
      email: user.email,
    })
  })
})
