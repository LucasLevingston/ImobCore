import { describe, expect, it, vi } from 'vitest'
import { ZodError, z } from 'zod'
import { ConflictError } from '../../../application/errors/conflict-error'
import { errorHandler } from './error-handler'

function makeReply() {
  const reply = {
    status: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
  }
  return reply
}

function makeRequest() {
  return { log: { error: vi.fn() } }
}

describe('errorHandler', () => {
  it('should map an AppError to its own status code and name', () => {
    const reply = makeReply()
    const error = new ConflictError('E-mail já cadastrado.')

    errorHandler(error, makeRequest() as never, reply as never)

    expect(reply.status).toHaveBeenCalledWith(409)
    expect(reply.send).toHaveBeenCalledWith({
      statusCode: 409,
      error: 'ConflictError',
      message: 'E-mail já cadastrado.',
    })
  })

  it('should map a ZodError to 400 with a joined message', () => {
    const reply = makeReply()
    const schema = z.object({ email: z.string().email() })
    const result = schema.safeParse({ email: 'not-an-email' })
    const zodError = result.success ? null : result.error
    expect(zodError).toBeInstanceOf(ZodError)

    errorHandler(zodError as ZodError, makeRequest() as never, reply as never)

    expect(reply.status).toHaveBeenCalledWith(400)
    const [payload] = reply.send.mock.calls[0] as [{ error: string }]
    expect(payload.error).toBe('ValidationError')
  })

  it('should map an unknown error to 500 without leaking internal details', () => {
    const reply = makeReply()
    const request = makeRequest()
    const error = new Error('detalhe interno sensível de stack trace')

    errorHandler(error, request as never, reply as never)

    expect(reply.status).toHaveBeenCalledWith(500)
    expect(reply.send).toHaveBeenCalledWith({
      statusCode: 500,
      error: 'InternalError',
      message: 'Erro interno do servidor.',
    })
  })

  it('should log unknown errors for observability', () => {
    const reply = makeReply()
    const request = makeRequest()
    const error = new Error('boom')

    errorHandler(error, request as never, reply as never)

    expect(request.log.error).toHaveBeenCalledWith(error)
  })
})
