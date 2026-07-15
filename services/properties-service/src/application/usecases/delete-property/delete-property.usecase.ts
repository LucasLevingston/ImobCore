import type { PropertyRepository } from '../../../domain/repositories/property-repository'
import { NotFoundError } from '../../errors/not-found-error'

export class DeletePropertyUseCase {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.propertyRepository.findById(id)
    if (!existing) {
      throw new NotFoundError('Imóvel não encontrado.')
    }
    await this.propertyRepository.delete(id)
  }
}
