export interface AppDependencies {
  authServiceUrl: string
  propertiesServiceUrl: string
  corsOrigin: string | string[]
  logger?: boolean
  rateLimitMax?: number
  rateLimitTimeWindow?: string
}
