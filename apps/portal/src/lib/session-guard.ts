// Guard reutilizável (docs/ARCHITECTURE.md seção 05a) — lógica pura, sem
// dependência de next/server, pra ser testável isoladamente e reaproveitável
// por qualquer boundary futuro (middleware hoje, client-side guard depois).

export function hasSessionCookie(cookieValue: string | undefined | null): boolean {
  return Boolean(cookieValue)
}

interface CurrentUrlParts {
  protocol: string
  host: string
  pathname: string
  search: string
}

// Nunca usa request.url direto: no server.js standalone (Docker), a origem
// dele reflete o HOSTNAME/PORT de bind do processo (0.0.0.0), não o Host
// header real da requisição — vazaria "http://0.0.0.0:3005/..." num redirect real
export function buildLoginRedirectUrl(authFrontendUrl: string, current: CurrentUrlParts): URL {
  const loginUrl = new URL('/login', authFrontendUrl)
  const redirectTarget = `${current.protocol}//${current.host}${current.pathname}${current.search}`
  loginUrl.searchParams.set('redirectTo', redirectTarget)
  return loginUrl
}
