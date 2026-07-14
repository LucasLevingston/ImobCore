import { describe, expect, it } from 'vitest'
import { AppError } from './app-error'
import { ConflictError } from './conflict-error'

describe('ConflictError', () => {
  it('should carry status code 409', () => {
    expect(new ConflictError('email já cadastrado').statusCode).toBe(409)
  })

  it('should be an instance of AppError', () => {
    expect(new ConflictError('x')).toBeInstanceOf(AppError)
  })

  it('should preserve the given message', () => {
    expect(new ConflictError('email já cadastrado').message).toBe('email já cadastrado')
  })
})
