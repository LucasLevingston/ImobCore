import { NextResponse, type NextRequest } from 'next/server'
import { env } from './lib/env'

const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken'

// Todo o app exige sessão (não existe página pública aqui) — só checa a
// presença do cookie de refresh (evita chamada de rede no edge). Sem sessão,
// redireciona pro auth-frontend (cross-origin — properties-frontend não tem
// UI de login própria, docs seção 05). A validação real do token acontece
// client-side via apiClient (refresh automático em 401).
export function middleware(request: NextRequest): NextResponse {
  const hasRefreshToken = Boolean(request.cookies.get(REFRESH_TOKEN_COOKIE_NAME)?.value)

  if (!hasRefreshToken) {
    const loginUrl = new URL('/login', env.NEXT_PUBLIC_AUTH_FRONTEND_URL)
    loginUrl.searchParams.set('redirectTo', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  // api/health fica de fora — único endpoint público (usado pelo HEALTHCHECK do Docker)
  matcher: ['/((?!_next|favicon.ico|api/health).*)'],
}
