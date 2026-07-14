import { randomUUID } from 'node:crypto'
import type { RefreshToken } from '../../domain/entities/refresh-token.entity'
import type {
  CreateRefreshTokenData,
  RefreshTokenRepository,
} from '../../domain/repositories/refresh-token-repository'

export class InMemoryRefreshTokenRepository implements RefreshTokenRepository {
  public readonly tokens: RefreshToken[] = []

  async create(data: CreateRefreshTokenData): Promise<RefreshToken> {
    const token: RefreshToken = {
      id: randomUUID(),
      tokenHash: data.tokenHash,
      userId: data.userId,
      expiresAt: data.expiresAt,
      revokedAt: null,
      createdAt: new Date(),
    }
    this.tokens.push(token)
    return token
  }

  async findByTokenHash(tokenHash: string): Promise<RefreshToken | null> {
    return this.tokens.find((t) => t.tokenHash === tokenHash) ?? null
  }

  async revoke(id: string): Promise<void> {
    const token = this.tokens.find((t) => t.id === id)
    if (token) token.revokedAt = new Date()
  }
}
