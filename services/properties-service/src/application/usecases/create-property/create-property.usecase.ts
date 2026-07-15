import type { Property } from '../../../domain/entities/property.entity'
import type { PropertyRepository } from '../../../domain/repositories/property-repository'
import type { CreatePropertyInput } from '../../dto/create-property.dto'

export class CreatePropertyUseCase {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async execute(input: CreatePropertyInput & { brokerId: string }): Promise<Property> {
    return this.propertyRepository.create(input)
  }
}
