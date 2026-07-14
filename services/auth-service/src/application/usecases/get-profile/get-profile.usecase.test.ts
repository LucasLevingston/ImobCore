import { describe, expect, it } from 'vitest'
import { InMemoryUserRepository } from '../../../test-utils/fakes/in-memory-user-repository'
import { makeUser } from '../../../test-utils/factories/make-user'
import { NotFoundError } from '../../errors/not-found-error'
import { GetProfileUseCase } from './get-profile.usecase'

function makeSut() {
  const userRepository = new InMemoryUserRepository()
  const useCase = new GetProfileUseCase(userRepository)
  return { useCase, userRepository }
}

describe('GetProfileUseCase', () => {
  it('should return the user matching the given id', async () => {
    const { useCase, userRepository } = makeSut()
    const user = makeUser({ email: 'lucas@email.com' })
    userRepository.users.push(user)

    const result = await useCase.execute(user.id)

    expect(result).toEqual(user)
  })

  it('should throw NotFoundError when the user does not exist', async () => {
    const { useCase } = makeSut()

    await expect(useCase.execute('non-existent-id')).rejects.toBeInstanceOf(NotFoundError)
  })
})
