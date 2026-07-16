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

// Automatiza só a parte tediosa: reescrever a `requiredVersion` toda vez que
// react/react-dom são bumpados no package.json. NUNCA "compartilha tudo que
// está em dependencies" — quais pacotes entram em `shared` continua sendo
// decisão explícita de quem chama (2ª arg), porque isso é escopo de
// arquitetura (o que este monorepo realmente compartilha entre os MFEs é só
// react/react-dom — ver docs/ARCHITECTURE.md seção 06), não algo pra inferir
// automaticamente a partir de tudo que o app importa.
export function getSharedDependencies(
  dependencies: Record<string, string>,
  config: Record<string, SharedDependencyOptions>,
): Record<string, SharedDependencyConfig> {
  return Object.fromEntries(
    Object.entries(config).map(([name, options]) => {
      const declaredVersion = dependencies[name]
      const requiredVersion = options.requiredVersion ?? declaredVersion

      if (!requiredVersion) {
        throw new Error(
          `getSharedDependencies: "${name}" não está em dependencies e nenhum requiredVersion foi informado explicitamente.`,
        )
      }

      return [
        name,
        {
          singleton: options.singleton ?? false,
          eager: options.eager ?? false,
          requiredVersion,
        },
      ]
    }),
  )
}
