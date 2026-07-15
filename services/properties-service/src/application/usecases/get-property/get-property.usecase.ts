import type { Property } from '../../../domain/entities/property.entity'
import type { PropertyRepository } from '../../../domain/repositories/property-repository'
import { NotFoundError } from '../../errors/not-found-error'

export class GetPropertyUseCase {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async execute(id: string): Promise<Property> {
    const property = await this.propertyRepository.findById(id)
    if (!property) {
      throw new NotFoundError('Imóvel não encontrado.')
    }
    return property
  }
}
