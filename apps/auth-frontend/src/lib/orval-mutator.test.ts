import { afterEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from './api-client'
import { orvalMutator } from './orval-mutator'

vi.mock('./api-client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('orvalMutator', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should prefix the URL with /api and call apiClient.get when no method is given', async () => {
    await orvalMutator('/auth/me')
    expect(apiClient.get).toHaveBeenCalledWith('/api/auth/me')
  })

  it('should call apiClient.post with the parsed body for POST requests', async () => {
    await orvalMutator('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'lucas@email.com', password: 'x' }),
    })
    expect(apiClient.post).toHaveBeenCalledWith('/api/auth/login', {
      email: 'lucas@email.com',
      password: 'x',
    })
  })

  it('should call apiClient.put with the parsed body for PUT requests', async () => {
    await orvalMutator('/auth/x', { method: 'PUT', body: JSON.stringify({ name: 'Lucas' }) })
    expect(apiClient.put).toHaveBeenCalledWith('/api/auth/x', { name: 'Lucas' })
  })

  it('should call apiClient.delete for DELETE requests', async () => {
    await orvalMutator('/auth/x', { method: 'DELETE' })
    expect(apiClient.delete).toHaveBeenCalledWith('/api/auth/x')
  })

  it('should throw for an unsupported method', () => {
    expect(() => orvalMutator('/auth/x', { method: 'PATCH' })).toThrow(
      'Método não suportado: PATCH',
    )
  })
})
