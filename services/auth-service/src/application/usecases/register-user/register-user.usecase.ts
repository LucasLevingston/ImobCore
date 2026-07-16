import type { PasswordHasher } from '../../../domain/cryptography/password-hasher'
import type { User } from '../../../domain/entities/user.entity'
import type { UserRepository } from '../../../domain/repositories/user-repository'
import type { RegisterUserInput } from '../../dto/register-user.dto'
import { ConflictError } from '../../errors/conflict-error'

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(input: RegisterUserInput): Promise<User> {
    const existing = await this.userRepository.findByEmail(input.email)
    if (existing) {
      throw new ConflictError('E-mail já cadastrado.')
    }

    const passwordHash = await this.passwordHasher.hash(input.password)

    return this.userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
    })
  }
}
