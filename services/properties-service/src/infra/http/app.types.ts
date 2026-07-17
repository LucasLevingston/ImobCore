import type { TokenProvider } from '../../domain/cryptography/token-provider'
import type { PropertyRepository } from '../../domain/repositories/property-repository'

export interface AppDependencies {
  propertyRepository: PropertyRepository
  tokenProvider: TokenProvider
  checkReadiness?: () => Promise<boolean>
  logger?: boolean
}
