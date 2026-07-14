import type { PasswordHasher } from '../../../domain/cryptography/password-hasher'
import type { TokenHasher } from '../../../domain/cryptography/token-hasher'
import type { TokenProvider } from '../../../domain/cryptography/token-provider'
import type { User } from '../../../domain/entities/user.entity'
import type { RefreshTokenRepository } from '../../../domain/repositories/refresh-token-repository'
import type { UserRepository } from '../../../domain/repositories/user-repository'
import type { LoginInput } from '../../dto/login.dto'
import { UnauthorizedError } from '../../errors/unauthorized-error'

const INVALID_CREDENTIALS_MESSAGE = 'E-mail ou senha inválidos.'

export interface LoginOutput {
  accessToken: string
  refreshToken: string
  user: User
}

export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenProvider: TokenProvider,
    private readonly tokenHasher: TokenHasher,
    private readonly refreshTokenTtlMs: number,
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const user = await this.userRepository.findByEmail(input.email)
    if (!user) {
      throw new UnauthorizedError(INVALID_CREDENTIALS_MESSAGE)
    }

    const passwordMatches = await this.passwordHasher.compare(input.password, user.passwordHash)
    if (!passwordMatches) {
      throw new UnauthorizedError(INVALID_CREDENTIALS_MESSAGE)
    }

    const accessToken = this.tokenProvider.generateAccessToken({ sub: user.id, email: user.email })
    const refreshToken = this.tokenProvider.generateRefreshToken()

    await this.refreshTokenRepository.create({
      tokenHash: this.tokenHasher.hash(refreshToken),
      userId: user.id,
      expiresAt: new Date(Date.now() + this.refreshTokenTtlMs),
    })

    return { accessToken, refreshToken, user }
  }
}
