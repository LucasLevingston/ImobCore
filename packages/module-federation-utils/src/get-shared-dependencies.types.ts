export interface SharedDependencyOptions {
  singleton?: boolean
  eager?: boolean
  /** Sobrescreve a versão lida do package.json — só quando o range declarado não é o correto pro shared. */
  requiredVersion?: string
}

export interface SharedDependencyConfig {
  singleton: boolean
  eager: boolean
  requiredVersion: string
}
