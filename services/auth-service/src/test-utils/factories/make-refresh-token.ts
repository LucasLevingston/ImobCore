import { randomUUID } from 'node:crypto'
import type { RefreshToken } from '../../domain/entities/refresh-token.entity'

export function makeRefreshToken(overrides: Partial<RefreshToken> = {}): RefreshToken {
  return {
    id: randomUUID(),
    tokenHash: 'hashed-refresh-token',
    userId: randomUUID(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    revokedAt: null,
    createdAt: new Date(),
    ...overrides,
  }
}
