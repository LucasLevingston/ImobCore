import type { FastifyReply, FastifyRequest } from 'fastify'
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod'
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

  // Body rejeitado pelo schema Zod registrado na rota (auth.routes.ts) —
  // Fastify embrulha o ZodError original num formato próprio antes de
  // chegar aqui, hasZodFastifySchemaValidationErrors é o type guard oficial
  // da lib pra reconhecer esse formato.
  if (hasZodFastifySchemaValidationErrors(error)) {
    reply.status(400).send({
      statusCode: 400,
      error: 'ValidationError',
      message: error.validation.map((issue) => issue.message).join(', '),
    })
    return
  }

  // ZodError puro ainda pode ocorrer fora do fluxo de rota (ex: parse manual
  // em algum use case) — mantido por completude.
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
