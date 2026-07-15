import { NextRequest } from 'next/server'
import { describe, expect, it } from 'vitest'
import { middleware } from './middleware'

function makeRequest(path: string, cookie?: string) {
  const request = new NextRequest(new URL(path, 'http://localhost:3003'))
  if (cookie) {
    request.cookies.set('refreshToken', cookie)
  }
  return request
}

describe('middleware', () => {
  it('should redirect to auth-frontend /login when there is no refresh token cookie', () => {
    const response = middleware(makeRequest('/dashboard'))

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toContain('http://localhost:3000/login')
  })

  it('should let the request through when the refresh token cookie is present', () => {
    const response = middleware(makeRequest('/dashboard', 'some-refresh-token'))

    expect(response.status).toBe(200)
  })

  it('should preserve the original absolute URL as a redirect query param', () => {
    const response = middleware(makeRequest('/properties/123'))

    const location = new URL(response.headers.get('location') ?? '', 'http://localhost:3000')
    expect(location.searchParams.get('redirectTo')).toBe('http://localhost:3003/properties/123')
  })
})
