import { describe, expect, it } from 'vitest'
import { AppError } from './app-error'

class DummyError extends AppError {
  constructor(message: string) {
    super(message, 418)
  }
}

describe('AppError', () => {
  it('should expose the given message and status code', () => {
    const error = new DummyError('algo específico')
    expect(error.message).toBe('algo específico')
    expect(error.statusCode).toBe(418)
  })

  it('should be an instance of Error', () => {
    const error = new DummyError('falha')
    expect(error).toBeInstanceOf(Error)
  })

  it('should set name to the concrete subclass name', () => {
    const error = new DummyError('falha')
    expect(error.name).toBe('DummyError')
  })
})
