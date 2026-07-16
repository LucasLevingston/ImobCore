import { describe, expect, it } from 'vitest'
import { BcryptHasher } from './bcrypt-hasher'

describe('BcryptHasher', () => {
  it('should hash a plain string into a different value', async () => {
    const hasher = new BcryptHasher()
    const hash = await hasher.hash('my-password')
    expect(hash).not.toBe('my-password')
    expect(hash.length).toBeGreaterThan(0)
  })

  it('should return true when comparing the correct plain value', async () => {
    const hasher = new BcryptHasher()
    const hash = await hasher.hash('my-password')
    await expect(hasher.compare('my-password', hash)).resolves.toBe(true)
  })

  it('should return false when comparing an incorrect plain value', async () => {
    const hasher = new BcryptHasher()
    const hash = await hasher.hash('my-password')
    await expect(hasher.compare('wrong-password', hash)).resolves.toBe(false)
  })

  it('should produce different hashes for the same input (salted)', async () => {
    const hasher = new BcryptHasher()
    const [hashA, hashB] = await Promise.all([hasher.hash('same-input'), hasher.hash('same-input')])
    expect(hashA).not.toBe(hashB)
  })

  it('should fall back to 10 salt rounds when BCRYPT_SALT_ROUNDS is not set', async () => {
    const original = process.env.BCRYPT_SALT_ROUNDS
    delete process.env.BCRYPT_SALT_ROUNDS

    const hasher = new BcryptHasher()
    const hash = await hasher.hash('my-password')

    process.env.BCRYPT_SALT_ROUNDS = original

    expect(hash).toMatch(/^\$2[aby]\$10\$/)
  })
})
