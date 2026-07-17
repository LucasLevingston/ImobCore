import { describe, expect, it } from 'vitest'
import { hasSessionCookie } from './session-guard'
import { buildLoginRedirectUrl } from './build-login-redirect-url'

describe('hasSessionCookie', () => {
  it('should return false when the cookie value is undefined', () => {
    expect(hasSessionCookie(undefined)).toBe(false)
  })

  it('should return false when the cookie value is an empty string', () => {
    expect(hasSessionCookie('')).toBe(false)
  })

  it('should return true when the cookie value is a non-empty string', () => {
    expect(hasSessionCookie('some-refresh-token')).toBe(true)
  })
})

describe('buildLoginRedirectUrl', () => {
  it('should build a login URL against the auth-frontend origin', () => {
    const url = buildLoginRedirectUrl('http://localhost:3000', {
      protocol: 'http:',
      host: 'localhost:3005',
      pathname: '/clients',
      search: '',
    })

    expect(url.origin).toBe('http://localhost:3000')
    expect(url.pathname).toBe('/login')
  })

  it('should set redirectTo from the current protocol/host/pathname/search', () => {
    const url = buildLoginRedirectUrl('http://localhost:3000', {
      protocol: 'http:',
      host: 'localhost:3005',
      pathname: '/clients',
      search: '?tab=active',
    })

    expect(url.searchParams.get('redirectTo')).toBe('http://localhost:3005/clients?tab=active')
  })

  it('should use the provided host instead of leaking a 0.0.0.0 bind address', () => {
    // regressão: middleware nunca deve usar request.url direto (reflete o bind
    // do standalone server, não o Host header real — ver docs/ARCHITECTURE.md)
    const url = buildLoginRedirectUrl('http://localhost:3000', {
      protocol: 'http:',
      host: 'portal.example.com',
      pathname: '/',
      search: '',
    })

    expect(url.searchParams.get('redirectTo')).toBe('http://portal.example.com/')
  })
})
