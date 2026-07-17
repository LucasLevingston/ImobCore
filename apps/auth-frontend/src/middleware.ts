import { type NextRequest, NextResponse } from 'next/server'

const PROTECTED_PATHS = ['/profile']
const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken'

// Não valida o token (evita chamada de rede no edge) — só checa presença do
// cookie de refresh. A validação real acontece client-side: a primeira
// chamada autenticada (useProfile) dispara o refresh automático do
// apiClient; se o refresh falhar, a página trata o erro (ver profile feature).
export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl
  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path))

  if (!isProtected) {
    return NextResponse.next()
  }

  const hasRefreshToken = Boolean(request.cookies.get(REFRESH_TOKEN_COOKIE_NAME)?.value)
  if (!hasRefreshToken) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/profile/:path*'],
}
