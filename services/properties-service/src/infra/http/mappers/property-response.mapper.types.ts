import type { Property } from '../../../domain/entities/property.entity'

export type PropertyResponse = Omit<Property, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
}
