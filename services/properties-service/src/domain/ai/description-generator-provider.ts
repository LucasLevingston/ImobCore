import type { Property } from '../entities/property.entity'

// Contrato arquitetural — sem implementação nesta fase (ver ai-provider.ts).
export interface DescriptionGeneratorProvider {
  generate(property: Property): Promise<string>
}
