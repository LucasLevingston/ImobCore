import type { FastifyReply, FastifyRequest } from 'fastify'
import type { GetDashboardMetricsUseCase } from '../../../application/usecases/get-dashboard-metrics/get-dashboard-metrics.usecase'

export function makeGetDashboardMetricsController(useCase: GetDashboardMetricsUseCase) {
  return async function getDashboardMetricsController(
    _request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const metrics = await useCase.execute()
    return reply.status(200).send(metrics)
  }
}
