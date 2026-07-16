import type { FastifyReply, FastifyRequest } from 'fastify'
import { ZodError } from 'zod'
import { AppError } from '../../../application/errors/app-error'

export function errorHandler(error: Error, request: FastifyRequest, reply: FastifyReply): void {
  if (error instanceof AppError) {
    reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      error: error.name,
      message: error.message,
    })
    return
  }

  if (error instanceof ZodError) {
    reply.status(400).send({
      statusCode: 400,
      error: 'ValidationError',
      message: error.issues.map((issue) => issue.message).join(', '),
    })
    return
  }

  request.log.error(error)
  reply.status(500).send({
    statusCode: 500,
    error: 'InternalError',
    message: 'Erro interno do servidor.',
  })
}
