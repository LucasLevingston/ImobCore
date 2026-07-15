import { describe, expect, it } from 'vitest'
import { AppError } from './app-error'
import { ValidationError } from './validation-error'

describe('ValidationError', () => {
  it('should carry status code 400', () => {
    expect(new ValidationError('dado inválido').statusCode).toBe(400)
  })

  it('should be an instance of AppError', () => {
    expect(new ValidationError('x')).toBeInstanceOf(AppError)
  })

  it('should preserve the given message', () => {
    expect(new ValidationError('dado inválido').message).toBe('dado inválido')
  })
})
