import type { RefreshToken } from '../entities/refresh-token.entity'

export interface CreateRefreshTokenData {
  tokenHash: string
  userId: string
  expiresAt: Date
}

export interface RefreshTokenRepository {
  create(data: CreateRefreshTokenData): Promise<RefreshToken>
  findByTokenHash(tokenHash: string): Promise<RefreshToken | null>
  revoke(id: string): Promise<void>
}
