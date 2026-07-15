import { describe, expect, it } from 'vitest'
import { AppError } from './app-error'
import { UnauthorizedError } from './unauthorized-error'

describe('UnauthorizedError', () => {
  it('should carry status code 401', () => {
    expect(new UnauthorizedError('token inválido').statusCode).toBe(401)
  })

  it('should be an instance of AppError', () => {
    expect(new UnauthorizedError('x')).toBeInstanceOf(AppError)
  })

  it('should default to a generic message when none is given', () => {
    expect(new UnauthorizedError().message).toBe('Não autorizado.')
  })
})
