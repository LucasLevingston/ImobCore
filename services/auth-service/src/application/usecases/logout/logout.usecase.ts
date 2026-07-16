import type { TokenHasher } from '../../../domain/cryptography/token-hasher'
import type { RefreshTokenRepository } from '../../../domain/repositories/refresh-token-repository'

export class LogoutUseCase {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly tokenHasher: TokenHasher,
  ) {}

  // Idempotente: logout sempre "sucede" do ponto de vista do cliente,
  // mesmo se o token já não existir/já estiver revogado.
  async execute(rawRefreshToken: string): Promise<void> {
    const tokenHash = this.tokenHasher.hash(rawRefreshToken)
    const storedToken = await this.refreshTokenRepository.findByTokenHash(tokenHash)

    if (storedToken && storedToken.revokedAt === null) {
      await this.refreshTokenRepository.revoke(storedToken.id)
    }
  }
}
