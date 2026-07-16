import { afterEach, describe, expect, it, vi } from 'vitest'

describe('env', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('should expose NEXT_PUBLIC_API_GATEWAY_URL when set', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_GATEWAY_URL', 'http://localhost:3004')
    const { env } = await import('./env')
    expect(env.NEXT_PUBLIC_API_GATEWAY_URL).toBe('http://localhost:3004')
  })

  it('should throw when NEXT_PUBLIC_API_GATEWAY_URL is missing', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_GATEWAY_URL', '')
    await expect(import('./env')).rejects.toThrow()
  })
})
