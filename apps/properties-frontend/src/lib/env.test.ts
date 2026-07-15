import { afterEach, describe, expect, it, vi } from 'vitest'

describe('env', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('should expose both gateway and auth-frontend URLs when set', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_GATEWAY_URL', 'http://localhost:3004')
    vi.stubEnv('NEXT_PUBLIC_AUTH_FRONTEND_URL', 'http://localhost:3000')
    const { env } = await import('./env')
    expect(env.NEXT_PUBLIC_API_GATEWAY_URL).toBe('http://localhost:3004')
    expect(env.NEXT_PUBLIC_AUTH_FRONTEND_URL).toBe('http://localhost:3000')
  })

  it('should throw when NEXT_PUBLIC_API_GATEWAY_URL is missing', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_GATEWAY_URL', '')
    vi.stubEnv('NEXT_PUBLIC_AUTH_FRONTEND_URL', 'http://localhost:3000')
    await expect(import('./env')).rejects.toThrow()
  })

  it('should throw when NEXT_PUBLIC_AUTH_FRONTEND_URL is missing', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_GATEWAY_URL', 'http://localhost:3004')
    vi.stubEnv('NEXT_PUBLIC_AUTH_FRONTEND_URL', '')
    await expect(import('./env')).rejects.toThrow()
  })
})
