import { describe, expect, it } from 'vitest'
import { AppError } from './app-error'
import { NotFoundError } from './not-found-error'

describe('NotFoundError', () => {
  it('should carry status code 404', () => {
    expect(new NotFoundError('usuário não encontrado').statusCode).toBe(404)
  })

  it('should be an instance of AppError', () => {
    expect(new NotFoundError('x')).toBeInstanceOf(AppError)
  })

  it('should preserve the given message', () => {
    expect(new NotFoundError('usuário não encontrado').message).toBe('usuário não encontrado')
  })
})
