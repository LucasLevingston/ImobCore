import type { Property } from '../../../domain/entities/property.entity'
import type { PropertyRepository } from '../../../domain/repositories/property-repository'
import type { UpdatePropertyInput } from '../../dto/update-property.types'
import { NotFoundError } from '../../errors/not-found-error'

export class UpdatePropertyUseCase {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async execute(id: string, input: UpdatePropertyInput): Promise<Property> {
    const existing = await this.propertyRepository.findById(id)
    if (!existing) {
      throw new NotFoundError('Imóvel não encontrado.')
    }
    return this.propertyRepository.update(id, input)
  }
}
