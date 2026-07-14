import { describe, expect, it } from 'vitest'
import { Sha256TokenHasher } from './sha256-token-hasher'

describe('Sha256TokenHasher', () => {
  it('should produce a deterministic hash for the same input', () => {
    const hasher = new Sha256TokenHasher()
    expect(hasher.hash('my-refresh-token')).toBe(hasher.hash('my-refresh-token'))
  })

  it('should produce different hashes for different inputs', () => {
    const hasher = new Sha256TokenHasher()
    expect(hasher.hash('token-a')).not.toBe(hasher.hash('token-b'))
  })

  it('should produce a hex-encoded 64-character string (SHA-256)', () => {
    const hasher = new Sha256TokenHasher()
    expect(hasher.hash('any-token')).toMatch(/^[a-f0-9]{64}$/)
  })
})
