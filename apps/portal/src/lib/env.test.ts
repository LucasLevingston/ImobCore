import { afterEach, describe, expect, it, vi } from 'vitest'

describe('env', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('should expose all required NEXT_PUBLIC_* vars when set', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_GATEWAY_URL', 'http://localhost:3004')
    vi.stubEnv('NEXT_PUBLIC_AUTH_FRONTEND_URL', 'http://localhost:3000')
    vi.stubEnv('NEXT_PUBLIC_PROPERTIES_FRONTEND_URL', 'http://localhost:3003')
    const { env } = await import('./env')
    expect(env.NEXT_PUBLIC_API_GATEWAY_URL).toBe('http://localhost:3004')
    expect(env.NEXT_PUBLIC_AUTH_FRONTEND_URL).toBe('http://localhost:3000')
    expect(env.NEXT_PUBLIC_PROPERTIES_FRONTEND_URL).toBe('http://localhost:3003')
  })

  it('should throw when NEXT_PUBLIC_API_GATEWAY_URL is missing', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_GATEWAY_URL', '')
    vi.stubEnv('NEXT_PUBLIC_AUTH_FRONTEND_URL', 'http://localhost:3000')
    vi.stubEnv('NEXT_PUBLIC_PROPERTIES_FRONTEND_URL', 'http://localhost:3003')
    await expect(import('./env')).rejects.toThrow()
  })

  it('should throw when NEXT_PUBLIC_AUTH_FRONTEND_URL is missing', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_GATEWAY_URL', 'http://localhost:3004')
    vi.stubEnv('NEXT_PUBLIC_AUTH_FRONTEND_URL', '')
    vi.stubEnv('NEXT_PUBLIC_PROPERTIES_FRONTEND_URL', 'http://localhost:3003')
    await expect(import('./env')).rejects.toThrow()
  })

  it('should throw when NEXT_PUBLIC_PROPERTIES_FRONTEND_URL is missing', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_GATEWAY_URL', 'http://localhost:3004')
    vi.stubEnv('NEXT_PUBLIC_AUTH_FRONTEND_URL', 'http://localhost:3000')
    vi.stubEnv('NEXT_PUBLIC_PROPERTIES_FRONTEND_URL', '')
    await expect(import('./env')).rejects.toThrow()
  })
})
