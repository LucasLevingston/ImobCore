import { describe, expect, it } from 'vitest'
import { loginSchema } from './login.schema'

describe('loginSchema', () => {
  it('should accept a valid payload', () => {
    expect(loginSchema.safeParse({ email: 'lucas@email.com', password: 'anything' }).success).toBe(
      true,
    )
  })

  it('should reject an invalid email', () => {
    expect(loginSchema.safeParse({ email: 'not-an-email', password: 'anything' }).success).toBe(
      false,
    )
  })

  it('should reject an empty password', () => {
    expect(loginSchema.safeParse({ email: 'lucas@email.com', password: '' }).success).toBe(false)
  })
})
