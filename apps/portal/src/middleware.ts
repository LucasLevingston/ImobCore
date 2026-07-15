import { NextResponse, type NextRequest } from 'next/server'
import { env } from './lib/env'
import { buildLoginRedirectUrl, hasSessionCookie } from './lib/session-guard'

const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken'

// Todo o Portal exige sessão (não existe página pública aqui) — só checa a
// presença do cookie de refresh (evita chamada de rede no edge). Sem sessão,
// redireciona pro auth-frontend (cross-origin — Portal não tem UI de login
// própria, docs/ARCHITECTURE.md seção 05a). A validação real do token
// acontece client-side via apiClient (refresh automático em 401).
export function middleware(request: NextRequest): NextResponse {
  const hasSession = hasSessionCookie(request.cookies.get(REFRESH_TOKEN_COOKIE_NAME)?.value)

  if (!hasSession) {
    const host = request.headers.get('host') ?? request.nextUrl.host
    const loginUrl = buildLoginRedirectUrl(env.NEXT_PUBLIC_AUTH_FRONTEND_URL, {
      protocol: request.nextUrl.protocol,
      host,
      pathname: request.nextUrl.pathname,
      search: request.nextUrl.search,
    })
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  // api/health fica de fora — único endpoint público (usado pelo HEALTHCHECK do Docker)
  matcher: ['/((?!_next|favicon.ico|api/health).*)'],
}
