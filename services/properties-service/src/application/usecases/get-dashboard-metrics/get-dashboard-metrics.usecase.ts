import type {
  DashboardMetrics,
  PropertyRepository,
} from '../../../domain/repositories/property-repository'

export class GetDashboardMetricsUseCase {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async execute(): Promise<DashboardMetrics> {
    return this.propertyRepository.getDashboardMetrics()
  }
}
