import type { RefreshToken } from '../../../domain/entities/refresh-token.entity'
import type {
  CreateRefreshTokenData,
  RefreshTokenRepository,
} from '../../../domain/repositories/refresh-token-repository'
import type { PrismaClient } from '../../../generated/prisma/client'

export class PrismaRefreshTokenRepository implements RefreshTokenRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateRefreshTokenData): Promise<RefreshToken> {
    return this.prisma.refreshToken.create({ data })
  }

  async findByTokenHash(tokenHash: string): Promise<RefreshToken | null> {
    return this.prisma.refreshToken.findUnique({ where: { tokenHash } })
  }

  async revoke(id: string): Promise<void> {
    await this.prisma.refreshToken.update({ where: { id }, data: { revokedAt: new Date() } })
  }
}
