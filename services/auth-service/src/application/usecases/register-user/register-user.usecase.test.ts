import { describe, expect, it } from 'vitest'
import { InMemoryUserRepository } from '../../../test-utils/fakes/in-memory-user-repository'
import { makeUser } from '../../../test-utils/factories/make-user'
import { ConflictError } from '../../errors/conflict-error'
import { RegisterUserUseCase } from './register-user.usecase'

function makeSut() {
  const userRepository = new InMemoryUserRepository()
  const passwordHasher = {
    hash: async (plain: string) => `hashed:${plain}`,
    compare: async () => true,
  }
  const useCase = new RegisterUserUseCase(userRepository, passwordHasher)
  return { useCase, userRepository, passwordHasher }
}

describe('RegisterUserUseCase', () => {
  it('should create a new user with a hashed password', async () => {
    const { useCase, userRepository } = makeSut()

    const user = await useCase.execute({
      name: 'Lucas Levingston',
      email: 'lucas@email.com',
      password: 'super-secret-1',
    })

    expect(user.email).toBe('lucas@email.com')
    expect(user.passwordHash).toBe('hashed:super-secret-1')
    expect(userRepository.users).toHaveLength(1)
  })

  it('should never persist the plain password', async () => {
    const { useCase, userRepository } = makeSut()

    await useCase.execute({ name: 'Lucas', email: 'lucas@email.com', password: 'super-secret-1' })

    expect(userRepository.users[0]?.passwordHash).not.toBe('super-secret-1')
  })

  it('should throw ConflictError when the email is already registered', async () => {
    const { useCase, userRepository } = makeSut()
    userRepository.users.push(makeUser({ email: 'lucas@email.com' }))

    await expect(
      useCase.execute({ name: 'Outro Nome', email: 'lucas@email.com', password: 'super-secret-1' }),
    ).rejects.toBeInstanceOf(ConflictError)
  })

  it('should not create a duplicate user after a conflict', async () => {
    const { useCase, userRepository } = makeSut()
    userRepository.users.push(makeUser({ email: 'lucas@email.com' }))

    await expect(
      useCase.execute({ name: 'Outro Nome', email: 'lucas@email.com', password: 'super-secret-1' }),
    ).rejects.toThrow()

    expect(userRepository.users).toHaveLength(1)
  })
})
