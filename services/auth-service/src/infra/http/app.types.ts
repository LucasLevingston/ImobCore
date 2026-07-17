import type { PasswordHasher } from '../../domain/cryptography/password-hasher'
import type { TokenHasher } from '../../domain/cryptography/token-hasher'
import type { TokenProvider } from '../../domain/cryptography/token-provider'
import type { RefreshTokenRepository } from '../../domain/repositories/refresh-token-repository'
import type { UserRepository } from '../../domain/repositories/user-repository'

export interface AppDependencies {
  userRepository: UserRepository
  refreshTokenRepository: RefreshTokenRepository
  passwordHasher: PasswordHasher
  tokenProvider: TokenProvider
  tokenHasher: TokenHasher
  refreshTokenTtlMs: number
  checkReadiness?: () => Promise<boolean>
  logger?: boolean
}
