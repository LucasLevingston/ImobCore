export interface ServiceConfig {
  name: string
  url: string
  prefix: string
  rewritePrefix: string
}

export interface AppDependencies {
  services: ServiceConfig[]
  corsOrigin: string | string[]
  logger?: boolean | undefined
  rateLimitMax?: number | undefined
  rateLimitTimeWindow?: string | undefined
}
