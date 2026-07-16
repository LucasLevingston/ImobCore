import { describe, expect, it } from 'vitest'
import { loginSchema, registerUserSchema, userResponseSchema } from './auth.schema'

describe('loginSchema', () => {
  it('should accept a valid email and non-empty password', () => {
    const result = loginSchema.safeParse({ email: 'lucas@email.com', password: 'x' })
    expect(result.success).toBe(true)
  })

  it('should reject an invalid email', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: 'x' })
    expect(result.success).toBe(false)
  })

  it('should reject an empty password', () => {
    const result = loginSchema.safeParse({ email: 'lucas@email.com', password: '' })
    expect(result.success).toBe(false)
  })
})

describe('registerUserSchema', () => {
  const validInput = { name: 'Lucas Levingston', email: 'lucas@email.com', password: 'senha1234' }

  it('should accept a fully valid registration payload', () => {
    const result = registerUserSchema.safeParse(validInput)
    expect(result.success).toBe(true)
  })

  it('should reject a name shorter than 2 characters', () => {
    const result = registerUserSchema.safeParse({ ...validInput, name: 'L' })
    expect(result.success).toBe(false)
  })

  it('should reject a password shorter than 8 characters', () => {
    const result = registerUserSchema.safeParse({ ...validInput, password: 'short' })
    expect(result.success).toBe(false)
  })

  it('should reject an invalid email', () => {
    const result = registerUserSchema.safeParse({ ...validInput, email: 'not-an-email' })
    expect(result.success).toBe(false)
  })
})

describe('userResponseSchema', () => {
  const validResponse = {
    id: 'user-1',
    name: 'Lucas Levingston',
    email: 'lucas@email.com',
    createdAt: '2026-01-01T00:00:00.000Z',
  }

  it('should accept a fully valid user response', () => {
    const result = userResponseSchema.safeParse(validResponse)
    expect(result.success).toBe(true)
  })

  it('should never accept a passwordHash field being required', () => {
    // garante que o schema de resposta não exige/expõe passwordHash — a
    // fronteira entre entidade de domínio e resposta HTTP é intencional
    expect(Object.keys(userResponseSchema.shape)).not.toContain('passwordHash')
  })
})
