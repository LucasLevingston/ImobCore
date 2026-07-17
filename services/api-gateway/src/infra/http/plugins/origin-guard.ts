function firstValue(header: string | string[] | undefined): string | undefined {
  return Array.isArray(header) ? header[0] : header
}

function originOf(url: string): string | undefined {
  try {
    return new URL(url).origin
  } catch {
    return undefined
  }
}

// CORS sozinho não impede o browser de ENVIAR uma requisição mutável
// cross-origin (só impede o site malicioso de LER a resposta) — checar
// Origin/Referer é a defesa real contra CSRF em rotas que alteram estado
// (docs seção 18). Origin tem prioridade; Referer é fallback pra clientes
// que não o enviam (alguns navegadores/situações omitem Origin em navegação
// same-site, mas isso não se aplica ao nosso caso de fetch com credentials).
export function isOriginAllowed(
  originHeader: string | string[] | undefined,
  refererHeader: string | string[] | undefined,
  allowed: string | string[],
): boolean {
  const allowedList = Array.isArray(allowed) ? allowed : [allowed]

  const origin = firstValue(originHeader)
  if (origin) {
    return allowedList.includes(origin)
  }

  const referer = firstValue(refererHeader)
  if (referer) {
    const refererOrigin = originOf(referer)
    return refererOrigin !== undefined && allowedList.includes(refererOrigin)
  }

  return false
}
