import { NextRequest } from 'next/server'
import { describe, expect, it } from 'vitest'
import { config, middleware } from './middleware'

function makeRequest(path: string, cookie?: string, host = 'localhost:3005') {
  const request = new NextRequest(new URL(path, `http://${host}`), {
    headers: { host },
  })
  if (cookie) {
    request.cookies.set('refreshToken', cookie)
  }
  return request
}

describe('middleware', () => {
  it('should redirect to the auth-frontend /login when there is no refresh token cookie', () => {
    const response = middleware(makeRequest('/'))

    expect(response.status).toBe(307)
    const location = response.headers.get('location') ?? ''
    expect(location).toContain('http://localhost:3000/login')
  })

  it('should let the request through when the refresh token cookie is present', () => {
    const response = middleware(makeRequest('/', 'some-refresh-token'))

    expect(response.status).toBe(200)
  })

  it('should protect every route, not just an allowlist', () => {
    const response = middleware(makeRequest('/clients'))

    expect(response.status).toBe(307)
  })

  it('should preserve the original host and path as the redirectTo query param', () => {
    const response = middleware(makeRequest('/clients', undefined, 'portal.example.com'))

    const location = new URL(response.headers.get('location') ?? '')
    expect(location.searchParams.get('redirectTo')).toBe('http://portal.example.com/clients')
  })

  it('should fall back to nextUrl.host when the Host header is absent', () => {
    const request = new NextRequest(new URL('/clients', 'http://localhost:3005'))

    const response = middleware(request)

    const location = new URL(response.headers.get('location') ?? '')
    expect(location.searchParams.get('redirectTo')).toBe('http://localhost:3005/clients')
  })

  // api/health não é excluído pela função middleware() em si — a exclusão é
  // 100% responsabilidade do `config.matcher` (roteamento do Next.js, fora
  // do alcance de um teste de unidade que chama a função diretamente)
  it('should export a matcher that excludes _next, favicon.ico and api/health', () => {
    expect(config.matcher).toEqual(['/((?!_next|favicon.ico|api/health).*)'])
  })
})
