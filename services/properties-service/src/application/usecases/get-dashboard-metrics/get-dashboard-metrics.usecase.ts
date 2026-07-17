import type { PropertyRepository } from '../../../domain/repositories/property-repository'
import type { DashboardMetrics } from '../../../domain/repositories/property-repository-result.types'

export class GetDashboardMetricsUseCase {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async execute(): Promise<DashboardMetrics> {
    return this.propertyRepository.getDashboardMetrics()
  }
}
