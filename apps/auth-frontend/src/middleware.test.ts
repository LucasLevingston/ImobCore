import { NextRequest } from 'next/server'
import { describe, expect, it } from 'vitest'
import { middleware } from './middleware'

function makeRequest(path: string, cookie?: string) {
  const request = new NextRequest(new URL(path, 'http://localhost:3000'))
  if (cookie) {
    request.cookies.set('refreshToken', cookie)
  }
  return request
}

describe('middleware', () => {
  it('should redirect to /login when accessing /profile without a refresh token cookie', () => {
    const response = middleware(makeRequest('/profile'))

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toContain('/login')
  })

  it('should let the request through to /profile when the refresh token cookie is present', () => {
    const response = middleware(makeRequest('/profile', 'some-refresh-token'))

    expect(response.status).toBe(200)
  })

  it('should never block /login even without a cookie', () => {
    const response = middleware(makeRequest('/login'))

    expect(response.status).toBe(200)
  })

  it('should never block /register even without a cookie', () => {
    const response = middleware(makeRequest('/register'))

    expect(response.status).toBe(200)
  })

  it('should preserve the original path as a redirect query param', () => {
    const response = middleware(makeRequest('/profile'))

    const location = new URL(response.headers.get('location') ?? '', 'http://localhost:3000')
    expect(location.searchParams.get('redirectTo')).toBe('/profile')
  })
})
