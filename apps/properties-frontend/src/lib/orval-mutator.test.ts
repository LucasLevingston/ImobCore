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
    await orvalMutator('/properties/x')
    expect(apiClient.get).toHaveBeenCalledWith('/api/properties/x')
  })

  it('should preserve a query string already embedded in the URL', async () => {
    await orvalMutator('/properties?city=S%C3%A3o+Paulo', { method: 'GET' })
    expect(apiClient.get).toHaveBeenCalledWith('/api/properties?city=S%C3%A3o+Paulo')
  })

  it('should call apiClient.post with the parsed body for POST requests', async () => {
    await orvalMutator('/properties', {
      method: 'POST',
      body: JSON.stringify({ title: 'Casa' }),
    })
    expect(apiClient.post).toHaveBeenCalledWith('/api/properties', { title: 'Casa' })
  })

  it('should call apiClient.put with the parsed body for PUT requests', async () => {
    await orvalMutator('/properties/x', {
      method: 'PUT',
      body: JSON.stringify({ title: 'Casa' }),
    })
    expect(apiClient.put).toHaveBeenCalledWith('/api/properties/x', { title: 'Casa' })
  })

  it('should call apiClient.delete for DELETE requests', async () => {
    await orvalMutator('/properties/x', { method: 'DELETE' })
    expect(apiClient.delete).toHaveBeenCalledWith('/api/properties/x')
  })

  it('should throw for an unsupported method', () => {
    expect(() => orvalMutator('/properties/x', { method: 'PATCH' })).toThrow(
      'Método não suportado: PATCH',
    )
  })
})
