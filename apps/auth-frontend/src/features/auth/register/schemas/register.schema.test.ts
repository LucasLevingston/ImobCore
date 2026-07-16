import { describe, expect, it } from 'vitest'
import { registerSchema } from './register.schema'

describe('registerSchema', () => {
  it('should accept a valid payload', () => {
    const result = registerSchema.safeParse({
      name: 'Lucas Levingston',
      email: 'lucas@email.com',
      password: 'super-secret-1',
    })
    expect(result.success).toBe(true)
  })

  it('should reject a name shorter than 2 characters', () => {
    const result = registerSchema.safeParse({
      name: 'L',
      email: 'lucas@email.com',
      password: 'super-secret-1',
    })
    expect(result.success).toBe(false)
  })

  it('should reject an invalid email', () => {
    const result = registerSchema.safeParse({
      name: 'Lucas Levingston',
      email: 'not-an-email',
      password: 'super-secret-1',
    })
    expect(result.success).toBe(false)
  })

  it('should reject a password shorter than 8 characters', () => {
    const result = registerSchema.safeParse({
      name: 'Lucas Levingston',
      email: 'lucas@email.com',
      password: '1234567',
    })
    expect(result.success).toBe(false)
  })
})
