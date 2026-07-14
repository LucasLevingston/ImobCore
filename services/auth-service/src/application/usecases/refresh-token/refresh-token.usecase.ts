import type { TokenHasher } from '../../../domain/cryptography/token-hasher'
import type { TokenProvider } from '../../../domain/cryptography/token-provider'
import type { RefreshTokenRepository } from '../../../domain/repositories/refresh-token-repository'
import type { UserRepository } from '../../../domain/repositories/user-repository'
import { UnauthorizedError } from '../../errors/unauthorized-error'

const INVALID_REFRESH_TOKEN_MESSAGE = 'Refresh token inválido ou expirado.'

export interface RefreshTokenOutput {
  accessToken: string
  refreshToken: string
}

export class RefreshTokenUseCase {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly userRepository: UserRepository,
    private readonly tokenProvider: TokenProvider,
    private readonly tokenHasher: TokenHasher,
    private readonly refreshTokenTtlMs: number,
  ) {}

  async execute(rawRefreshToken: string): Promise<RefreshTokenOutput> {
    const tokenHash = this.tokenHasher.hash(rawRefreshToken)
    const storedToken = await this.refreshTokenRepository.findByTokenHash(tokenHash)

    if (!storedToken || storedToken.revokedAt !== null || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedError(INVALID_REFRESH_TOKEN_MESSAGE)
    }

    const user = await this.userRepository.findById(storedToken.userId)
    if (!user) {
      throw new UnauthorizedError(INVALID_REFRESH_TOKEN_MESSAGE)
    }

    await this.refreshTokenRepository.revoke(storedToken.id)

    const accessToken = this.tokenProvider.generateAccessToken({ sub: user.id, email: user.email })
    const newRawRefreshToken = this.tokenProvider.generateRefreshToken()

    await this.refreshTokenRepository.create({
      tokenHash: this.tokenHasher.hash(newRawRefreshToken),
      userId: user.id,
      expiresAt: new Date(Date.now() + this.refreshTokenTtlMs),
    })

    return { accessToken, refreshToken: newRawRefreshToken }
  }
}
