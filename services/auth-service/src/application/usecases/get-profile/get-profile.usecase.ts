import type { User } from '../../../domain/entities/user.entity'
import type { UserRepository } from '../../../domain/repositories/user-repository'
import { NotFoundError } from '../../errors/not-found-error'

export class GetProfileUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new NotFoundError('Usuário não encontrado.')
    }
    return user
  }
}
